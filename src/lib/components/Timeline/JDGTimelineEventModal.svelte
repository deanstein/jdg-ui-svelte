<script>
	import { timelineEventDraft, timelineHostDraft } from '$lib/stores/jdg-temp-store.js';
	import { doShowTimelineEventModal } from '$lib/stores/jdg-ui-store.js';

	import { getIsObjectInArray } from '$lib/jdg-utils.js';

	import { JDGModal, JDGTimelineEventForm } from '$lib/index.js';

	export let isEditable = true;
	export let isEditing = false;

	let isNewEvent;

	$: {
		// If not already in the timeline host, this is a new event
		if (!getIsObjectInArray($timelineHostDraft.timelineEvents, $timelineEventDraft)) {
			isNewEvent = true;
		}
	}
</script>

<JDGModal
	title={isNewEvent ? 'New Timeline Event' : isEditing ? 'Edit Timeline Event' : 'Timeline Event'}
	subtitle={null}
	onClickCloseButton={() => {
		$doShowTimelineEventModal = false;
	}}
>
	<div slot="modal-content-slot">
		<JDGTimelineEventForm eventStore={timelineEventDraft} {isEditable} {isEditing} />
	</div>
</JDGModal>
