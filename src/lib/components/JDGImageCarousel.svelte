<script>
	import imageAttributesCollection from '../../routes/image-attributes-collection.js';

	import { JDGImage, JDGImageTile } from '$lib/index.js';

	export let imageDetailObjects = [];
	export let maxHeight = '50vh';
</script>

<div class="jdg-image-carousel-container">
	<JDGImage imageAttributes={imageAttributesCollection.get('cc-2')} {maxHeight} cropToFit={false} />
	<div class="carousel-thumbnail-container">
		{#each imageDetailObjects as imageAttributesObject, i}
			<JDGImageTile imageAttributes={imageAttributesObject} maxHeight="50px" maxWidth="75px" />
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

	.carousel-thumbnail-container > div {
		max-width: 200px;
	}
</style>
