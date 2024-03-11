<script>
	import { css } from '@emotion/css';

	import { JDGImageFullWidth, JDGImageTile } from '$lib/index.js';

	export let imageDetailObjects = [];
	export let height = '50vh';

	let activeImageObject;
</script>

<div class="jdg-image-carousel-container">
	<!-- <JDGImageTile imgSrc={'./history/cc-2.jpg'} nHeightPx={1000} cropToFit={false} /> -->
	<JDGImageFullWidth imgSrc={'./history/cc-2.jpg'} heightVh={'50vh'} />
	<div class="carousel-thumbnail-container">
		<JDGImageTile nHeightPx={50} />
		<JDGImageTile nHeightPx={50} />
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
