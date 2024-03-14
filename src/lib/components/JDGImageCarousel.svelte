<script>
	import imageDetailsCollection from '../../routes/image-details-collection.js';

	import { JDGImage, JDGImageTile } from '$lib/index.js';
	import { getObjectByKeyValue } from '$lib/jdg-utils.js';

	export let imageDetailObjects = [];
	export let maxHeight = '50vh';

	let activeImageObject;
</script>

<div class="jdg-image-carousel-container">
	<JDGImage
		imageDetails={getObjectByKeyValue(imageDetailsCollection, 'imgSrc', './history/cc-2.jpg')}
		{maxHeight}
		cropToFit={false}
	/>
	<div class="carousel-thumbnail-container">
		<JDGImageTile maxHeight="50px" maxWidth="75px" />
		<JDGImageTile maxHeight="50px" maxWidth="75px" />
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

	.carousel-thumbnail-container > div {
		max-width: 200px;
	}
</style>
