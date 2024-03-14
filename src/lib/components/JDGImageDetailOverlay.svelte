<script>
	import { setShowImageDetailModal } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGImage, JDGOverlay } from '$lib/index.js';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	export let imageAttributes = instantiateObject(jdgImageAttributes);
</script>

<JDGOverlay
	showTitleBar={true}
	onCloseFunction={() => {
		setShowImageDetailModal(false);
	}}
	closeOnOverlayClick={true}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<JDGImage {imageAttributes} maxHeight="600px" />
</JDGOverlay>
