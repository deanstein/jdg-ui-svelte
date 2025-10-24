<script>
	import { draftTimelineEvent, draftTimelineHost } from '$lib/stores/jdg-temp-store.js';
	import {
		showTimelineEventModal,
		isTimelineEventModalEditable
	} from '$lib/stores/jdg-ui-store.js';

	import { getIsObjectInArray } from '$lib/jdg-utils.js';

	import { JDGModal, JDGTimelineEventForm } from '$lib/index.js';

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
	backgroundColor={'rgba(235, 235, 235, 1)'}
>
	<div slot="modal-content-slot">
		<JDGTimelineEventForm
			eventStore={draftTimelineEvent}
			isEditable={$isTimelineEventModalEditable || isNewEvent}
			isEditing={$isTimelineEventModalEditable || isNewEvent}
		/>
	</div>
</JDGModal>
