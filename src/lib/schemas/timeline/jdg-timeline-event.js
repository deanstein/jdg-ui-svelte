import { jdgSchemaVersion } from '$lib/schemas/jdg-schema-versions.js';
import { JDG_INPUT_TYPES } from './jdg-input-types.js';
import jdgTimelineEventTypes from './jdg-timeline-event-types.js';

// NOTE: This is a HYBRID SCHEMA - it has both data and UI
const jdgTimelineEvent = {
	// meta
	id: '',
	type: jdgTimelineEventTypes.generic,
	// content
	date: {
		default: '',
		label: 'Date',
		inputType: JDG_INPUT_TYPES.DATE
	},
	isApprxDate: {
		default: false,
		label: 'Approximate date?',
		inputType: JDG_INPUT_TYPES.CHECKBOX
	},
	description: {
		default: '',
		label: 'Description',
		inputType: JDG_INPUT_TYPES.TEXTAREA
	},
	images: {
		default: [],
		label: 'Images',
		inputType: JDG_INPUT_TYPES.IMAGE_LIST
	},
	// Other timeline hosts that should have an eventRef to this event and host
	referencedHostIds: [],
	// Where did the information in this event come from?
	// e.g. person, publication, etc.
	// Note that some types like article and quote have their own source types like attribution and publication
	source: {
		default: '',
		label: 'Source',
		inputType: JDG_INPUT_TYPES.TEXT
	},
	// Optional; certain event types may have additional data
	additionalContent: {},
	// Timeline events are upgraded with new fields on version mismatch
	version: jdgSchemaVersion
};

export default jdgTimelineEvent;
