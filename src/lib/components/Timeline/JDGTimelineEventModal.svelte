<script>
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';
	import { doShowTimelineEventModal } from '$lib/stores/jdg-ui-store.js';

	import { JDGModal, JDGTimelineEventForm } from '$lib/index.js';
</script>

<JDGModal
	title={'Timeline Event'}
	subtitle={null}
	onClickCloseButton={() => {
		$doShowTimelineEventModal = false;
	}}
>
	<div slot="modal-content-slot">
		<JDGTimelineEventForm eventStore={timelineEventDraft} />
	</div>
</JDGModal>
