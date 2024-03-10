<script>
	import { setShowImageDetailModal } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGOverlay } from '$lib/index.js';

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
	<div class="image-container">
		<img src={imageDetails.imgSrc} alt={imageDetails.imgAlt} />
	</div>
</JDGOverlay>

<style>
	.image-container {
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
	}
</style>
