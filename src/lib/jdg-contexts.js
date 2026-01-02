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

	// Timeline event type keys - set by parent components to filter available event types
	// Used by JDGTimelineEventForm to determine which event types to show in dropdown
	TIMELINE_EVENT_TYPE_KEYS: 'jdg-timeline-event-type-keys',

	// Event age suffixes - set by parent components to customize age display
	// Used by JDGTimelineEvent and JDGTimelineEventForm
	// Positive suffix is used when eventAge > 0, negative suffix when eventAge < 0
	EVENT_AGE_SUFFIX_POSITIVE: 'jdg-event-age-suffix-positive',
	EVENT_AGE_SUFFIX_NEGATIVE: 'jdg-event-age-suffix-negative',

	// Show months in age display - set by parent components to control whether months are shown
	// Used by JDGTimelineEvent and JDGTimelineEventForm
	// Default is false (don't show months, e.g., "7 years" instead of "7 years, 3 months")
	EVENT_AGE_SHOW_MONTHS: 'jdg-event-age-show-months'
};

export default JDG_CONTEXTS;
