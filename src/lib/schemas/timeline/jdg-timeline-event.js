import { jdgSchemaVersion } from '$lib/schemas/jdg-schema-versions.js';
import jdgTimelineEventTypes from './jdg-timeline-event-types.js';
import timelineEventOriginTypes from '$lib/schemas/timeline/jdg-timeline-event-origin-types.js';

const jdgTimelineEvent = {
	// meta
	id: '',
	type: jdgTimelineEventTypes.generic,
	originType: timelineEventOriginTypes.self,
	originMeta: undefined,
	// content
	date: '',
	isApprxDate: false,
	description: '',
	images: [],
	referencedHostIds: [], // other hosts that should have an eventRef to this event and host
	// version
	version: jdgSchemaVersion
};

export default jdgTimelineEvent;
