// Context keys for Svelte contexts
// Used for passing data down the component tree without props

export const JDG_CONTEXTS = {
	// Image meta registry - the source of truth for image metadata
	// Set by JDGAppContainer, consumed by Timeline components
	IMAGE_META_REGISTRY: 'jdg-image-meta-registry',

	// Timeline row heights - used for spine alignment
	TIMELINE_FIRST_ROW_HEIGHT: 'jdg-timeline-first-row-height',
	TIMELINE_LAST_ROW_HEIGHT: 'jdg-timeline-last-row-height'
};
