import { get } from 'svelte/store';

import jdgTimelineHost from './schemas/timeline/jdg-timeline-host.js';
import {
	addOrReplaceObjectByKeyValue,
	deleteObjectByKeyValue,
	extractDefaultsFromSchema,
	getObjectByKeyValue,
	instantiateObject
} from './jdg-utils.js';
import jdgTimelineEventTypes from './schemas/timeline/jdg-timeline-event-types.js';
import jdgTimelineEvent from './schemas/timeline/jdg-timeline-event.js';

export const instantiateTimelineEvent = (typeKey) => {
	const baseSchema = JSON.parse(JSON.stringify(jdgTimelineEvent));
	const typeDef = jdgTimelineEventTypes[typeKey];

	console.log(typeDef);

	if (!typeDef || typeof typeDef !== 'object') {
		console.error(`No schema found for type "${typeKey}"`);
		return extractDefaultsFromSchema(baseSchema);
	}

	const base = extractDefaultsFromSchema(baseSchema);
	base.type = typeKey;

	const contentSchema = typeDef.additionalContent || {};
	base.additionalContent = extractDefaultsFromSchema(contentSchema);

	return base;
};

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
