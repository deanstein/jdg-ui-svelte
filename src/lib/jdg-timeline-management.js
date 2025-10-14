import { get } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

import { jdgSchemaVersion } from '$lib/schemas/jdg-schema-versions.js';
import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
import {
	addOrReplaceObjectByKeyValue,
	deepMatchObjects,
	deleteObjectByKeyValue,
	extractDefaultsFromSchema as extractDataFromHybridSchema,
	getObjectByKeyValue,
	instantiateObject
} from '$lib/jdg-utils.js';
import jdgTimelineEventTypes, {
	jdgTimelineEventKeys
} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';

//
// TIMELINE HOST
//

// Ensure all new timelineHost fields are added to the given host
export function upgradeTimelineHost(timelineHost) {
	// Initial upgrade
	const upgradedHost = deepMatchObjects(jdgTimelineHost, timelineHost);

	// Update the version to the schema version
	upgradedHost.version = jdgSchemaVersion;

	// Ensure the version is updated
	return upgradedHost;
}

//
// TIMELINE EVENT
//

// Creates a data-only TimelineEvent schema
// from TimelineEvent which is a HYBRID schema
export const instantiateTimelineEvent = (typeKey) => {
	const initialTimelineEvent = instantiateObject(jdgTimelineEvent);
	const typeDef = jdgTimelineEventTypes[typeKey];

	if (!typeDef || typeof typeDef !== 'object') {
		console.error(`No schema found for type "${typeKey}"`);
		// HYBRID schema has both UI and data
		return extractDataFromHybridSchema(initialTimelineEvent);
	}

	// HYBRID schema has both UI and data
	const extractedBaseEvent = extractDataFromHybridSchema(initialTimelineEvent);
	extractedBaseEvent.type = typeKey;

	// Apply the default description if it's defined
	extractedBaseEvent.description = typeDef.description;

	const extractedAddlContent = typeDef.additionalContent || {};
	extractedBaseEvent.additionalContent = extractDataFromHybridSchema(extractedAddlContent);

	// Set a random id
	extractedBaseEvent.id = uuidv4();

	// If this is a Today event, use today's date
	if (typeKey === jdgTimelineEventKeys.today) {
		extractedBaseEvent.date = new Date().toLocaleDateString();
	}

	// Update the version to the schema version
	extractedBaseEvent.version = jdgSchemaVersion;

	return extractedBaseEvent;
};

// Upgrades a timeline event with the latest fields
export function upgradeTimelineEvent(event) {
	const typeKey = event?.type;
	const typeDef = jdgTimelineEventTypes[typeKey];

	if (!typeDef) {
		console.warn(`Unknown timeline event type: ${typeKey}`);
		return { ...event, version: jdgSchemaVersion };
	}

	const defaultContent = typeDef.content || {};
	const existingContent = event.additionalContent || {};

	// Merge defaults with existing content, preserving user-entered values
	const upgradedContent = { ...defaultContent, ...existingContent };

	return {
		...event,
		additionalContent: upgradedContent,
		version: jdgSchemaVersion
	};
}

// Timeline events contain both UI and data in their schema.
// This one gets the data:
export const extractDataSchemaFields = (schemaObj = {}) =>
	Object.fromEntries(
		Object.entries(schemaObj)
			.filter(([_, def]) => typeof def === 'object' && def !== null && 'default' in def)
			.map(([key, def]) => [key, def.default])
	);
// This one gets the UI fields:
export const extractUiFromDataSchema = (schemaObj = {}) =>
	Object.fromEntries(
		Object.entries(schemaObj).filter(
			([_, def]) => typeof def === 'object' && def !== null && 'inputType' in def
		)
	);

export const getTimelineEventById = (timelineHostStore, eventId) => {
	if (!timelineHostStore || !eventId) return;

	const currentValue = get(timelineHostStore);

	const safeValue = {
		...jdgTimelineHost,
		...currentValue
	};

	return getObjectByKeyValue(safeValue.timelineEvents, 'id', eventId);
};

// adds or replaces a timeline event object
// in the timeline host stored in temp-state
export const addOrReplaceTimelineEvent = (timelineHostStore, event) => {
	if (!timelineHostStore || !event) return;

	timelineHostStore.update((currentValue) => {
		const safeValue = {
			...jdgTimelineHost,
			...currentValue
		};

		const updatedEvents = getObjectByKeyValue(safeValue.timelineEvents, 'id', event.id)
			? addOrReplaceObjectByKeyValue(safeValue.timelineEvents, 'id', event.eventId, event)
			: [...safeValue.timelineEvents, event];

		return {
			...safeValue,
			timelineEvents: updatedEvents
		};
	});
};

export const deleteTimelineEvent = (timelineHostStore, event) => {
	if (!timelineHostStore || !event) {
		console.error('The supplied timeline event or store was undefined and cannot be deleted');
		return;
	}

	timelineHostStore.update((currentValue) => {
		const safeValue = {
			...jdgTimelineHost,
			...currentValue
		};

		const updatedEvents = getObjectByKeyValue(safeValue.timelineEvents, 'id', event.id)
			? deleteObjectByKeyValue(safeValue.timelineEvents, 'id', event.id)
			: safeValue.timelineEvents;

		if (updatedEvents !== safeValue.timelineEvents) {
			// deleteAllTimelineEventImagesFromRepo(event);
		}

		return {
			...safeValue,
			timelineEvents: updatedEvents
		};
	});
};
