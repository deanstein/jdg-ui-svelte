<script>
	import { JDGImage, JDGImageTile } from '$lib/index.js';

	export let imageAttributeObjects = []; // all images shown in thumbnail collection
	export let maxHeight = '50vh';

	let activeImage = imageAttributeObjects[0]; // start with the first image

	const setActiveImage = (imageAttributesObject) => {
		activeImage = imageAttributesObject;
	};
</script>

<div class="jdg-image-carousel-container">
	<JDGImage imageAttributes={activeImage} {maxHeight} cropToFit={false} />
	<div class="carousel-thumbnail-container">
		{#each imageAttributeObjects as imageAttributesObject, i}
			<JDGImageTile
				onClickFunction={() => setActiveImage(imageAttributesObject)}
				imageAttributes={imageAttributesObject}
				maxHeight="50px"
				maxWidth="75px"
			/>
		{/each}
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
