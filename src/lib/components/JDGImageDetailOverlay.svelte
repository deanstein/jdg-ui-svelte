<script>
	import { setShowImageDetailModal } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGImage, JDGOverlay } from '$lib/index.js';

	import jdgImageDetails from '$lib/schemas/image-details.js';
	export let imageDetails = instantiateObject(jdgImageDetails);
</script>

<JDGOverlay
	showTitleBar={true}
	onCloseFunction={() => {
		setShowImageDetailModal(false);
	}}
	closeOnOverlayClick={true}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<JDGImage {imageDetails} maxHeight="600px" />
</JDGOverlay>
