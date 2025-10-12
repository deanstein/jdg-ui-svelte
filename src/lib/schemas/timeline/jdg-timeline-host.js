// A timeline needs a host
// like a person or building.

import { jdgSchemaVersion } from '../jdg-schema-versions.js';

// Hosts are expected to have at least these fields:
const jdgTimelineHost = {
	id: '',
	name: '',
	avatar: '',
	inceptionDate: '', // birth date, construction date, etc.
	cessationDate: '', // death date, demolition date, etc.
	timelineEvents: [],
	timelineEventReferences: [],
	contextualEvents: [],
	version: jdgSchemaVersion
};

export default jdgTimelineHost;
