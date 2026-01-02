// Context keys for Svelte contexts
// Used for passing data down the component tree without props

const JDG_CONTEXTS = {
	// Image meta registry - the source of truth for image metadata
	// Set by JDGAppContainer, consumed by Timeline components
	IMAGE_META_REGISTRY: 'jdg-image-meta-registry',

	// Timeline-specific image registry - set by JDGTimeline for its host's registry
	// Used by TimelineEvent, TimelineEventModal, and JDGImage (when inside Timeline)
	TIMELINE_IMAGE_REGISTRY: 'jdg-timeline-image-registry',
	// Timeline's registry repo name - needed for saves when editing images inside a timeline
	TIMELINE_IMAGE_REGISTRY_REPO: 'jdg-timeline-image-registry-repo',

	// Timeline row heights - used for spine alignment
	TIMELINE_FIRST_ROW_HEIGHT: 'jdg-timeline-first-row-height',
	TIMELINE_LAST_ROW_HEIGHT: 'jdg-timeline-last-row-height'
};

export default JDG_CONTEXTS;
