<script>
	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { JDGModal } from '$lib/index.js';
</script>

<JDGModal
	onClickCloseButton={() => {
		showImageMetaModal.set(false);
	}}
></JDGModal>
