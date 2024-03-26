<script>
	import { scale } from 'svelte/transition';

	import { setShowImageDetailModal } from '$lib/jdg-state-management.js';
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
	<div in:scale={{ duration: 300 }}></div>
	<JDGImage {imageAttributes} maxHeight="auto" fillContainer={false} transition={scale} />
</JDGOverlay>
