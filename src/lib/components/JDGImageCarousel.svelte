<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		accentColors,
		doShowImageDetailOverlay,
		imageAspectRatios,
		imageDetailAttributes,
		windowWidth
	} from '$lib/states/ui-state.js';

	import { JDGButton, JDGImage, JDGImageCaptionAttribution, JDGImageTile } from '$lib/index.js';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { getImageAspectRatioRecord } from '$lib/jdg-state-management.js';
	import {
		getMaxElementHeightPx,
		getMaxElementWidthPx,
		getPixelValueFromString
	} from '$lib/jdg-utils.js';

	export let imageAttributeObjects; // all images shown in thumbnail collection
	export let maxHeight = '50vh';
	export let activeThumbnailColor = $accentColors[0];
	export let autoAdvance = true; // if true, auto advance through images at given interval
	export let autoAdvanceInterval = 5000; // ms, interval between auto-advances
	export let showBlurInUnfilledSpace = true;

	// height calculations - raw numeric values in px
	let maxHeightPxFromProp;
	let allFittedHeightsPx;

	let carouselRef; // used for only auto-advancing when carousel is visible
	let activeImage = imageAttributeObjects[0]; // start with the first image
	let kludge = true; // kludge to force a "crossfade" effect by swapping divs via flag
	let intervalId; // identifier for the auto-advance setInterval() call

	const getMaxHeightPxFromProp = () => {
		let maxHeightPx;
		// only calculate maxHeight if prop is not auto
		if (maxHeight !== 'auto') {
			maxHeightPx = getPixelValueFromString(maxHeight);
		} else {
			maxHeightPx = getMaxElementHeightPx(carouselRef);
		}
		return maxHeightPx;
	};

	// gets the largest height from all images provided
	// by multiplying each image aspect ratio by the available container width
	const getAllFittedHeightsPx = () => {
		const fittedHeights = [];

		// for each, record the aspect ratio
		imageAttributeObjects.forEach((imageAttributeObject) => {
			const aspectRatio = getImageAspectRatioRecord(imageAttributeObject.imgSrc);
			const containerWidth = getMaxElementWidthPx(carouselRef);
			const fittedHeight = containerWidth / aspectRatio;
			fittedHeights.push(fittedHeight);
		});

		return fittedHeights;
	};

	const setActiveImage = (imageAttributesObject, endAutoAdvance = false) => {
		activeImage = imageAttributesObject;
		kludge = !kludge;
		// when user clicks on a thumbnail, auto advance stops
		if (endAutoAdvance) {
			clearInterval(intervalId);
			autoAdvance = false;
		}
	};

	const thumbnailContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 0.75rem ${jdgSizes.bodyCopyVerticalPaddingSm} 0.75rem
				${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 0.75rem ${jdgSizes.bodyCopyVerticalPaddingMd} 0.75rem
				${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 0.75rem ${jdgSizes.bodyCopyVerticalPaddingLg} 0.75rem
				${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;

	onMount(() => {
		maxHeightPxFromProp = getMaxHeightPxFromProp();
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
				{ threshold: 0.5 /* ensure carousel is 50% visible before auto-advancing */ }
			);

			observer.observe(carouselRef);
		}
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	$: {
		$imageAspectRatios, $windowWidth;
		if (carouselRef) {
			const newFittedHeights = getAllFittedHeightsPx();
			if (JSON.stringify(newFittedHeights) !== JSON.stringify(allFittedHeightsPx)) {
				allFittedHeightsPx = newFittedHeights;
			}
		}
	}

	// set the carousel height based on the max height in fitted heights array
	let dynamicHeightCss = css`
		height: ${maxHeight};
	`;
	$: {
		$windowWidth;
		if (carouselRef && allFittedHeightsPx?.length > 0) {
			// ensure we're getting the max from only finite numbers
			const validHeightsPx = allFittedHeightsPx.filter((height) => isFinite(height));
			const maxFittedHeightPxFromArray = Math.round(Math.max(...validHeightsPx));
			if (
				maxFittedHeightPxFromArray !== 0 &&
				!isNaN(maxFittedHeightPxFromArray) &&
				isFinite(maxFittedHeightPxFromArray) &&
				isFinite(maxHeightPxFromProp) &&
				maxHeightPxFromProp > 0
			) {
				const finalMaxHeightPx = Math.min(maxHeightPxFromProp, maxFittedHeightPxFromArray);
				maxHeight = `${finalMaxHeightPx}px`;
				dynamicHeightCss = css`
					height: ${finalMaxHeightPx}px;
				`;
			}
		}
	}
</script>

<div bind:this={carouselRef} class="jdg-image-carousel-container">
	<div class="carousel-crossfade-wrapper-relative {dynamicHeightCss}">
		<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{#if kludge}
			<div class="carousel-crossfade-wrapper-absolute">
				<JDGImage
					imageAttributes={activeImage}
					{maxHeight}
					cropToFillContainer={false}
					{showBlurInUnfilledSpace}
					recordAspectRatioInState
				/>
			</div>
			<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{:else}
			<div class="carousel-crossfade-wrapper-absolute">
				<JDGImage
					imageAttributes={activeImage}
					{maxHeight}
					cropToFillContainer={false}
					{showBlurInUnfilledSpace}
					recordAspectRatioInState
				/>
			</div>
		{/if}
		<div class="carousel-button-overlay">
			<JDGButton
				onClickFunction={() => {
					doShowImageDetailOverlay.set(true);
					imageDetailAttributes.set(activeImage);
				}}
				faIcon="fa-solid fa-expand"
				label={null}
				paddingLeftRight={'8px'}
				paddingTopBottom={'8px'}
				backgroundColor={$accentColors[0]}
				tooltip="Expand image"
				forceSquareRatio
			/>
		</div>
	</div>
	<JDGImageCaptionAttribution
		imageAttributes={activeImage}
		backgroundColorRgba="rgba(0, 0, 0, 0)"
		matchBodyCopyPadding={true}
	/>
	<div class="carousel-thumbnail-container {thumbnailContainerCss}">
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
					useCompactHeightOnMobile={false}
					recordAspectRatioInState
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
		width: 100%;
	}

	.carousel-crossfade-wrapper-relative {
		position: relative;
		width: 100%;
	}

	.carousel-crossfade-wrapper-absolute {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.carousel-button-overlay {
		position: absolute;
		bottom: 0;
		right: 0;
		padding: 10px;
	}

	.carousel-thumbnail-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}

	.carousel-thumbnail-wrapper {
		box-sizing: border-box;
	}
</style>
