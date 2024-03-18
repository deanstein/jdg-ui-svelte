<script>
	import { JDGImage, JDGImageTile } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';

	export let imageAttributeObjects = []; // all images shown in thumbnail collection
	export let maxHeight = '50vh';
	export let activeThumbnailColor = jdgColors.accentStripesJDG[0];

	let activeImage = imageAttributeObjects[0]; // start with the first image

	const setActiveImage = (imageAttributesObject) => {
		activeImage = imageAttributesObject;
	};
</script>

<div class="jdg-image-carousel-container">
	<JDGImage
		imageAttributes={activeImage}
		{maxHeight}
		fillContainer={false}
		showBlurInUnfilledSpace={true}
	/>
	<div class="carousel-thumbnail-container">
		{#each imageAttributeObjects as imageAttributesObject, i}
			<div
				class="carousel-thumbnail-wrapper"
				style={imageAttributesObject === activeImage
					? `outline: 5px solid ${activeThumbnailColor}`
					: ''}
			>
				<JDGImageTile
					onClickFunction={() => setActiveImage(imageAttributesObject)}
					imageAttributes={imageAttributesObject}
					maxHeight="50px"
					maxWidth="75px"
				/>
			</div>
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
		width: 100%;
	}

	.carousel-thumbnail-container {
		display: flex;
		gap: 1rem;
	}

	.carousel-thumbnail-wrapper {
		box-sizing: border-box;
	}
</style>
