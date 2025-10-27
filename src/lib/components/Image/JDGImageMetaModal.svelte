<script>
	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { draftImageMeta } from '$lib/stores/jdg-temp-store.js';

	import { JDGInputContainer, JDGModal } from '$lib/index.js';
</script>

<JDGModal
	title={'Image Meta'}
	subtitle={null}
	onClickCloseButton={() => {
		showImageMetaModal.set(false);
	}}
>
	<div slot="modal-content-slot">
		<JDGInputContainer label="ID">
			{$draftImageMeta.id}
		</JDGInputContainer>
	</div>
</JDGModal>
