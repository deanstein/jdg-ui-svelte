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
	referencedHostIds: [], // other timeline hosts that should have an eventRef to this event and host
	additionalContent: {}, // optional; certain event types may have additional data
	// version
	version: jdgSchemaVersion
};

export default jdgTimelineEvent;
