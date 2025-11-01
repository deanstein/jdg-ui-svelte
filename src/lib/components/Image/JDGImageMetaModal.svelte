<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { draftImageMeta } from '$lib/stores/jdg-temp-store.js';
	import { upgradeImageMeta } from '$lib/jdg-utils.js';

	import { JDGInputContainer, JDGModal } from '$lib/index.js';

	onMount(() => {
		// Upgrade the image meta
		draftImageMeta.set(upgradeImageMeta(get(draftImageMeta)));
	});
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
