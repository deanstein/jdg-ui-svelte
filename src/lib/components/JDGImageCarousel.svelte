<script>
	import { css } from '@emotion/css';

	import { JDGImage, JDGImageTile } from '$lib/index.js';
	import { convertVhToPixels } from '$lib/jdg-utils.js';

	export let imageDetailObjects = [];
	export let maxHeight = '50vh';

	let activeImageObject;
</script>

<div class="jdg-image-carousel-container">
	<JDGImage imgSrc={'./history/cc-2.jpg'} {maxHeight} cropToFit={false} />
	<div class="carousel-thumbnail-container">
		<JDGImageTile maxHeight="50px" />
		<JDGImageTile maxHeight="50px" />
	</div>
</div>

<style>
	.jdg-image-carousel-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.carousel-thumbnail-container {
		display: flex;
		gap: 1rem;
	}
</style>
