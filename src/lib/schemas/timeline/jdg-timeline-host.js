// A timeline needs a host
// like a person or building.

import { jdgSchemaVersion } from '../jdg-schema-versions.js';

// Hosts are expected to have at least these fields:
const jdgTimelineHost = {
	id: '',
	name: '',
	avatarImage: '',
	// The repo containing the image registry for this timeline
	imageMetaRegistryRepoName: '',
	// Birth date, construction date, etc.
	inceptionDate: '',
	// Death date, demolition date, etc.
	cessationDate: '',
	timelineEvents: [],
	timelineEventReferences: [],
	contextualEvents: [],
	version: jdgSchemaVersion
};

export default jdgTimelineHost;
