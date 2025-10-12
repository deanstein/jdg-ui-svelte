export const jdgSchemaVersion = '0.2.0';
export const jdgSchemaChanges = {
	'v0.2.x': {
		Overview:
			'v0.2.x adds inceptionDate and cessationDate to TimelineHost, removing inceptionEvent and cessationEvent from TimelineEvent.',
		Changes: ['Added timeline event, timeline event content schemas']
	},
	'v0.1.x': {
		Overview:
			'v0.1.x adds the initial schema to JDG UI Svelte, starting with timeline event schemas.',
		Changes: ['Added timeline event, timeline event content schemas']
	}
};
