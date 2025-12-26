export const jdgSchemaVersion = '0.3.0';
export const jdgSchemachanges = {
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
