export const jdgSchemaVersion = '0.2.0';
export const jdgSchemaChanges = {
	'v0.3.x': {
		Overview:
			'v0.3.x adds an ID field to image-meta schema and changes avatar to avatarImageMeta in timeilne-host schema',
		Changes: [
			'Added ID field to image-meta',
			'Added avatarImageMeta field to timeline-host schema',
			'Removed avatar field from timeline-host schema'
		]
	},
	'v0.2.x': {
		Changes: [
			'Added inceptionDate and cessationDate to timeline-host schema',
			'Removed inceptionEvent and cessationEvent from timeline-host schema'
		]
	},
	'v0.1.x': {
		Changes: [
			'Added initial schema versioning to JDG UI Svelte, starting with timeline-host and timeline-event'
		]
	}
};
