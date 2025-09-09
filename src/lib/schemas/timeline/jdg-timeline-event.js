import { jdgSchemaVersion } from '$lib/schemas/jdg-schema-versions.js';
import jdgTimelineEventTypes from './jdg-timeline-event-types.js';

const jdgTimelineEvent = {
	// meta
	id: '',
	type: jdgTimelineEventTypes.generic,
	// content
	date: '',
	isApprxDate: false,
	description: '',
	images: [],
	referencedHostIds: [], // other timeline hosts that should have an eventRef to this event and host
	additionalContent: {}, // optional; certain event types may have additional fields
	// version
	version: jdgSchemaVersion
};

export default jdgTimelineEvent;
