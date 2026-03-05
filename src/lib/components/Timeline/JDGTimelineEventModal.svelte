<script>
	import {
		draftTimelineEvent,
		draftTimelineHost,
		timelineEventsOrdered
	} from '$lib/stores/jdg-temp-store.js';
	import {
		modalGradientColors,
		showTimelineEventModal,
		isTimelineEventModalEditable
	} from '$lib/stores/jdg-ui-store.js';

	import { getIsObjectInArray } from '$lib/jdg-utils.js';

	import { JDGModal, JDGTimelineEventFormCarousel } from '$lib/index.js';

	let isNewEvent;

	$: {
		// Determine if this is a new event or not
		// If there's no draftTimelineHost, this can't be a new event (nowhere to save)
		if (!$draftTimelineHost) {
			isNewEvent = false;
		}
		// Otherwise, if there is a host draft and this isn't present in its events, it's new
		else if (!getIsObjectInArray($draftTimelineHost?.timelineEvents, $draftTimelineEvent)) {
			isNewEvent = true;
		}
	}

	// Carousel events in chronological order when opened from Timeline; fallback to host's raw list otherwise
	$: orderedEvents =
		($timelineEventsOrdered?.length ?? 0) > 0
			? $timelineEventsOrdered
			: $draftTimelineHost?.timelineEvents ?? [];
	$: carouselEvents = isNewEvent ? [...orderedEvents, $draftTimelineEvent] : orderedEvents;
</script>

<JDGModal
	title={isNewEvent
		? 'New Timeline Event'
		: $isTimelineEventModalEditable
			? 'Edit Timeline Event'
			: 'Timeline Event'}
	subtitle={null}
	onClickCloseButton={() => {
		$showTimelineEventModal = false;
	}}
	closeOnOverlayClick={!($isTimelineEventModalEditable || isNewEvent)}
	backgroundColor={'rgba(235, 235, 235, 1)'}
	gradientColor1={$modalGradientColors?.color1}
	gradientColor2={$modalGradientColors?.color2}
	gradientColor3={$modalGradientColors?.color3}
	width="80vw"
	minWidth="30vw"
	maxWidth="80vw"
	overflow="auto"
>
	<div slot="modal-content-slot" class="modal-content-wrapper">
		<JDGTimelineEventFormCarousel
			events={carouselEvents}
			eventStore={draftTimelineEvent}
			isEditable={$isTimelineEventModalEditable || isNewEvent}
			isEditing={$isTimelineEventModalEditable || isNewEvent}
		/>
	</div>
</JDGModal>

<style>
	.modal-content-wrapper {
		width: 100%;
		align-self: stretch;
		box-sizing: border-box;
	}
</style>
