<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		appAccentColors,
		doShowImageDetailOverlay,
		imageAspectRatios,
		imageDetailAttributes,
		windowWidth
	} from '$lib/states/ui-state.js';

	import { JDGButton, JDGImage, JDGImageCaptionAttribution, JDGImageTile } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { getImageAspectRatioRecord } from '$lib/jdg-state-management.js';
	import {
		getMaxElementHeightPx,
		getMaxElementWidthPx,
		getPixelValueFromString
	} from '$lib/jdg-utils.js';

	export let imageAttributeObjects; // all images shown in thumbnail collection
	export let showCaption = true;
	export let showAttribution = true;
	export let maxHeight = '50vh';
	export let activeThumbnailColor = $appAccentColors[0];
	export let autoAdvance = true; // if true, auto advance through images at given interval
	export let autoAdvanceInterval = 5000; // ms, interval between auto-advances
	export let showBlurInUnfilledSpace = true;
	export let justifyContent = 'center';
	export let matchMaxImageWidth = false; // maintains the carousel width at the widest image width

	// width and height calculations - raw numeric values in px
	let maxHeightPxFromProp;
	let allFittedHeightsPx;
	let finalMaxFittedHeightPx; // max image height of all images

	let allFittedWidthsPx;
	let finalMaxFittedWidthPx; // max image width of all images

	let availableWidthPx; // total available width for the carousel
	let activeImageFittedWidthPx; // the fitted width of the active image

	let parentRef;
	let carouselRef; // used for only auto-advancing when carousel is visible
	let activeImageAttributes = imageAttributeObjects[0]; // start with the first image
	let kludge = true; // kludge to force a "crossfade" effect by swapping divs via flag
	let intervalId; // identifier for the auto-advance setInterval() call

	// variables for touch events
	let touchStartX = 0;
	let touchEndX = 0;
	const minSwipeDistance = 50;

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

		// for each, record the fitted height
		imageAttributeObjects.forEach((imageAttributeObject) => {
			const aspectRatio = getImageAspectRatioRecord(imageAttributeObject.imgSrc);
			const fittedHeight = availableWidthPx / aspectRatio;
			fittedHeights.push(fittedHeight);
		});

		return fittedHeights;
	};

	// uses the aspect ratio and maxHeight to determine
	// maximum required width for the carousel
	// only applies if showBlurInUnfilledSpace is false
	const getAllFittedWidthsPx = () => {
		const fittedWidths = [];

		// for each, record the fitted width
		imageAttributeObjects.forEach((imageAttributeObject) => {
			const aspectRatio = getImageAspectRatioRecord(imageAttributeObject.imgSrc);
			const maxWidth = maxHeightPxFromProp * aspectRatio;
			fittedWidths.push(maxWidth);
		});

		return fittedWidths;
	};

	const setActiveImage = (imageAttributesObject, endAutoAdvance = false) => {
		// only set active image if image is different
		if (activeImageAttributes.imgSrc !== imageAttributesObject.imgSrc) {
			activeImageAttributes = imageAttributesObject;
			kludge = !kludge;
		}
		// when user clicks on a thumbnail, auto advance stops
		if (endAutoAdvance) {
			clearInterval(intervalId);
			autoAdvance = false;
		}
	};

	const handleTouchStart = (e) => {
		touchStartX = e.touches[0].clientX;
	};

	const handleTouchMove = (e) => {
		touchEndX = e.touches[0].clientX;
	};

	const handleTouchEnd = (e) => {
		touchEndX = e.changedTouches[0].clientX;
		if (touchStartX - touchEndX > minSwipeDistance) {
			// swipe left
			let currentIndex = imageAttributeObjects.indexOf(activeImageAttributes);
			currentIndex = (currentIndex + 1) % imageAttributeObjects.length;
			setActiveImage(imageAttributeObjects[currentIndex], true);
		}
		if (touchEndX - touchStartX > minSwipeDistance) {
			// swipe right
			let currentIndex = imageAttributeObjects.indexOf(activeImageAttributes);
			currentIndex =
				(currentIndex - 1 + imageAttributeObjects.length) % imageAttributeObjects.length;
			setActiveImage(imageAttributeObjects[currentIndex], true);
		}
	};

	onMount(() => {
		// get the parent ref so we can check if it's a flexbox later, for width calculations
		parentRef = carouselRef.parentNode;

		// get the initial max height
		maxHeightPxFromProp = getMaxHeightPxFromProp();

		// handle auto-advancing, if requested
		if (autoAdvance) {
			// only start auto-advancing if carousel is visible
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						intervalId = setInterval(() => {
							let currentIndex = imageAttributeObjects.indexOf(activeImageAttributes);
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

		// the element ref we use to determine the width depends on
		// whether the parent is a flex or not
		// a flex parent will cause width calculations to go wrong
		const widthRef =
			window.getComputedStyle(parentRef).display === 'flex' ? parentRef : carouselRef;

		// set up a resize observer to calculate the final available width for the carousel
		const observer = new ResizeObserver(() => {
			setTimeout(() => {
				availableWidthPx = getMaxElementWidthPx(widthRef);
			}, 100);
		});
		observer.observe(widthRef);
		return () => {
			observer.disconnect();
		};
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	const justificationCss = css`
		justify-content: ${justifyContent};
		align-items: ${justifyContent === 'right' ? 'end' : 'center'};
	`;

	$: {
		$imageAspectRatios, $windowWidth, availableWidthPx;
		if (carouselRef) {
			const newFittedHeights = getAllFittedHeightsPx();
			const newFittedWidths = getAllFittedWidthsPx();
			if (JSON.stringify(newFittedHeights) !== JSON.stringify(allFittedHeightsPx)) {
				allFittedHeightsPx = newFittedHeights;
			}
			if (JSON.stringify(newFittedWidths) !== JSON.stringify(allFittedWidthsPx)) {
				allFittedWidthsPx = newFittedWidths;
			}
		}
	}

	// update the active image fitted width for downstream components
	$: {
		allFittedHeightsPx;
		// first, get the fitted width from the aspect ratio records
		const activeImageFittedWidthPxFromRecord =
			getImageAspectRatioRecord(activeImageAttributes.imgSrc) * finalMaxFittedHeightPx;
		// if the fitted width from record is wider than the available width,
		// set the fitted width to the available width
		activeImageFittedWidthPx =
			activeImageFittedWidthPxFromRecord >= availableWidthPx
				? availableWidthPx
				: activeImageFittedWidthPxFromRecord;
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
				finalMaxFittedHeightPx = Math.min(maxHeightPxFromProp, maxFittedHeightPxFromArray);
				maxHeight = `${finalMaxFittedHeightPx}px`;
				dynamicHeightCss = css`
					height: ${finalMaxFittedHeightPx}px;
				`;
			}
		}
	}

	// set the carousel dynamic width to ensure it takes up only the width it needs
	// this only applies if showBlurInUnfilledSpace is false
	let dynamicWidthCss = css``;
	$: {
		if (carouselRef && allFittedWidthsPx?.length > 0) {
			// ensure we're getting the max from only finite numbers
			const validWidthsPx = allFittedWidthsPx.filter((width) => isFinite(width));
			const maxFittedWidthPxFromArray = Math.round(Math.max(...validWidthsPx));

			if (
				maxFittedWidthPxFromArray !== 0 &&
				!isNaN(maxFittedWidthPxFromArray) &&
				isFinite(maxFittedWidthPxFromArray)
			) {
				// final max fitted width is used only if it can fit within the available width
				finalMaxFittedWidthPx =
					maxFittedWidthPxFromArray <= availableWidthPx
						? maxFittedWidthPxFromArray
						: availableWidthPx;
				const compositeCarouselWidthPx = matchMaxImageWidth
					? finalMaxFittedWidthPx
					: `${activeImageFittedWidthPx}`;
				dynamicWidthCss = css`
					width: ${showBlurInUnfilledSpace && activeImageAttributes.allowBackgroundBlur
						? '100%;'
						: `${compositeCarouselWidthPx}`}px;
				`;
			}
		}
	}

	// the thumbnail container shouldn't be wider than the image
	let dynamicThumbnailContainerWidthCss = css``;
	$: {
		if (isFinite(finalMaxFittedWidthPx)) {
			dynamicThumbnailContainerWidthCss = css`
				width: ${showBlurInUnfilledSpace ? '100%' : `${finalMaxFittedWidthPx}px`};
			`;
		}
	}

	// the expand button overlay should appear in the corner of the active image
	let dynamicExpandButtonOverlayCss = css``;
	$: {
		dynamicExpandButtonOverlayCss = css`
			width: ${justifyContent === 'center' ? '100%' : activeImageFittedWidthPx + 'px'};
			justify-content: ${activeImageAttributes?.toolbarAlignment};
			right: ${justifyContent !== 'center' ? '0' : ''};
			padding: 10px
				${(showBlurInUnfilledSpace && activeImageAttributes.allowBackgroundBlur) ||
				(matchMaxImageWidth && justifyContent === 'center')
					? Math.abs(availableWidthPx - activeImageFittedWidthPx) / 2 + 10 + 'px'
					: '10px'}
				10px
				${(showBlurInUnfilledSpace && activeImageAttributes.allowBackgroundBlur) ||
				(matchMaxImageWidth && justifyContent === 'center')
					? Math.abs(availableWidthPx - activeImageFittedWidthPx) / 2 + 10 + 'px'
					: '10px'};
		`;
	}
</script>

<div
	bind:this={carouselRef}
	class="jdg-image-carousel-container {justificationCss}"
	on:touchstart|passive={handleTouchStart}
	on:touchmove|passive={handleTouchMove}
	on:touchend|passive={handleTouchEnd}
>
	<div class="carousel-crossfade-wrapper-relative {dynamicHeightCss} {dynamicWidthCss}">
		<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{#if kludge && finalMaxFittedHeightPx}
			<div class="carousel-crossfade-wrapper-absolute {justificationCss}">
				<JDGImage
					imageAttributes={activeImageAttributes}
					{maxHeight}
					useAutoHeightOnMobile={false}
					cropToFillContainer={false}
					{showBlurInUnfilledSpace}
					recordAspectRatioInState
				/>
			</div>
			<!-- kludge to force a "crossfade" effect by swapping divs via flag -->
		{:else}
			<div class="carousel-crossfade-wrapper-absolute {justificationCss}">
				<JDGImage
					imageAttributes={activeImageAttributes}
					{maxHeight}
					useAutoHeightOnMobile={false}
					cropToFillContainer={false}
					{showBlurInUnfilledSpace}
					recordAspectRatioInState
				/>
			</div>
		{/if}
		<div class="carousel-button-overlay {dynamicExpandButtonOverlayCss}">
			<JDGButton
				onClickFunction={() => {
					doShowImageDetailOverlay.set(true);
					imageDetailAttributes.set(activeImageAttributes);
				}}
				faIcon="fa-solid fa-expand"
				label={null}
				paddingLeftRight={'8px'}
				paddingTopBottom={'8px'}
				backgroundColor={$appAccentColors[0]}
				tooltip="Expand image"
				doForceSquareRatio
			/>
		</div>
	</div>
	{#if (showCaption && activeImageAttributes.imgCaption) || (showAttribution && activeImageAttributes.imgAttribution)}
		<div class="caption-attribution-wrapper {dynamicThumbnailContainerWidthCss}">
			<JDGImageCaptionAttribution
				imageAttributes={activeImageAttributes}
				backgroundColorRgba={activeImageAttributes.allowBackgroundBlur
					? jdgColors.imageLabelBackground
					: 'rgba(0, 0, 0, 0)'}
				maxTextWidthPx={activeImageFittedWidthPx}
			/>
		</div>
	{/if}
	<div class="carousel-thumbnail-container {dynamicThumbnailContainerWidthCss} {justificationCss}">
		{#each imageAttributeObjects as imageAttributesObject, i}
			<div
				class="carousel-thumbnail-wrapper"
				style={imageAttributesObject === activeImageAttributes
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
					useAutoHeightOnMobile={false}
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
		justify-content: flex-start;
		width: 100%;
	}

	.carousel-crossfade-wrapper-relative {
		position: relative;
	}

	.carousel-crossfade-wrapper-absolute {
		position: absolute;
		width: 100%;
		display: flex;
	}

	.carousel-button-overlay {
		position: absolute;
		display: flex;
		box-sizing: border-box;
		bottom: 0;
	}

	.carousel-thumbnail-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding: 0.75rem;
		box-sizing: border-box;
	}

	.carousel-thumbnail-wrapper {
		box-sizing: border-box;
	}
</style>
