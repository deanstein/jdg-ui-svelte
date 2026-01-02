export const jdgSchemaVersion = '0.5.0';
export const jdgSchemachanges = {
	'v0.5.x': {
		changes: [
			"Renamed 'storeClose' to 'closure', 'storeOpen' to 'opening', and 'ownershipChanged' to 'ownershipChange' in timeline-event-types"
		]
	},
	'v0.4.x': {
		changes: ["Added 'source' to timeline-event schema", 'Reordered jdg-image-meta']
	},
	'v0.3.x': {
		changes: [
			"Added 'ID' to image-meta schema",
			"Added 'avatar' to timeline-host schema",
			"Removed 'avatarImage' from timeline-host schema"
		]
	},
	'v0.2.x': {
		changes: [
			"Added 'inceptionDate' and 'cessationDate' to timeline-host schema",
			"Removed 'inceptionEvent' and 'cessationEvent' from timeline-host schema"
		]
	},
	'v0.1.x': {
		changes: [
			'Added initial schema versioning to JDG UI Svelte, starting with timeline-host and timeline-event'
		]
	}
};
