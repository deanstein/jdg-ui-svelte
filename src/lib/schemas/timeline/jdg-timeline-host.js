// A timeline needs a host
// like a person or building.

import { jdgSchemaVersion } from '../jdg-schema-versions.js';

// Hosts are expected to have at least these fields:
const jdgTimelineHost = {
	id: '',
	name: '',
	// The repo containing the image meta registry for this timeline host
	imageMetaRegistryRepo: '',
	// Image meta registry key for the avatar
	avatarImage: '',
	// Birth date, construction date, etc.
	// Also provides bounds for contextual events
	inceptionDate: '',
	// Death date, demolition date, etc.
	// Also provides bounds for contextual events
	cessationDate: '',
	timelineEvents: [],
	timelineEventReferences: [],
	contextualEvents: [],
	version: jdgSchemaVersion
};

export default jdgTimelineHost;
