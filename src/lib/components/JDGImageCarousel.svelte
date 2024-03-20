<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { JDGImage, JDGImageTile } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';

	export let imageAttributeObjects = []; // all images shown in thumbnail collection
	export let maxHeight = '50vh';
	export let activeThumbnailColor = jdgColors.accentStripesJDG[0];
	export let autoAdvance = true; // if true, auto advance through images at given interval
	export let autoAdvanceInterval = 5000; // ms, interval between auto-advances

	let carouselRef; // used for only auto-advancing when carousel is visible
	let activeImage = imageAttributeObjects[0]; // start with the first image
	let kludge = true; // kludge to force a "crossfade" effect by swapping divs via flag
	let intervalId; // identifier for the auto-advance setInterval() call

	const setActiveImage = (imageAttributesObject, endAutoAdvance = false) => {
		activeImage = imageAttributesObject;
		kludge = !kludge;
		// when user clicks on a thumbnail, auto advance stops
		if (endAutoAdvance) {
			clearInterval(intervalId);
			autoAdvance = false;
		}
	};

	const crossfadeWrapperCss = css`
		height: ${maxHeight};
	`;

	onMount(() => {
		if (autoAdvance) {
			// only start auto-advancing if carousel is visible
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						intervalId = setInterval(() => {
							let currentIndex = imageAttributeObjects.indexOf(activeImage);
							currentIndex = (currentIndex + 1) % imageAttributeObjects.length;
							setActiveImage(imageAttributeObjects[currentIndex]);
						}, autoAdvanceInterval);
					} else {
						clearInterval(intervalId);
					}
				},
				{ threshold: 0.5 /* ensure carousel is 50% visible */ }
			);

			observer.observe(carouselRef);
		}
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});
</script>

<div bind:this={carouselRef} class="jdg-image-carousel-container">
	<div class="carousel-crossfade-wrapper-relative {crossfadeWrapperCss}">
		<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{#if kludge}
			<div class="carousel-crossfade-wrapper-absolute">
				<JDGImage
					imageAttributes={activeImage}
					{maxHeight}
					fillContainer={false}
					showBlurInUnfilledSpace={true}
				/>
			</div>
			<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{:else}
			<div class="carousel-crossfade-wrapper-absolute">
				<JDGImage
					imageAttributes={activeImage}
					{maxHeight}
					fillContainer={false}
					showBlurInUnfilledSpace={true}
				/>
			</div>
		{/if}
	</div>
	<div class="carousel-thumbnail-container">
		{#each imageAttributeObjects as imageAttributesObject, i}
			<div
				class="carousel-thumbnail-wrapper"
				style={imageAttributesObject === activeImage
					? `outline: 5px solid ${activeThumbnailColor}`
					: ''}
			>
				<JDGImageTile
					onClickFunction={() => {
						setActiveImage(imageAttributesObject, true);
					}}
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
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
	}

	.carousel-crossfade-wrapper-relative {
		position: relative;
		width: 100%;
	}

	.carousel-crossfade-wrapper-absolute {
		position: absolute;
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
