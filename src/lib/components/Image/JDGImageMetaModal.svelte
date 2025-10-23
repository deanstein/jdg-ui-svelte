<script>
	import { doShowImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { JDGModal } from '$lib/index.js';
</script>

<JDGModal
	onClickCloseButton={() => {
		doShowImageMetaModal.set(false);
	}}
></JDGModal>
