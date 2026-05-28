<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		appAccentColors,
		showImageViewerModal,
		imageAspectRatios,
		imageViewerMeta,
		windowWidth
	} from '$lib/stores/jdg-ui-store.js';

	import { JDGButton, JDGImage, JDGImageCaptionAttribution, JDGImageTile } from '$lib/index.js';
	import { themeColors } from '$lib/jdg-shared-styles.js';
	import { getImageAspectRatioRecord } from '$lib/jdg-state-management.js';
	import {
		getMaxElementHeightPx,
		getMaxElementWidthPx,
		getPixelValueFromString
	} from '$lib/jdg-utils.js';

	export let imageMetaSet; // all images shown in thumbnail collection
	export let showCaption = true;
	export let showAttribution = true;
	export let showDate = true;
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
	let activeImageMeta = imageMetaSet[0]; // start with the first image
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
		imageMetaSet.forEach((imageAttributeObject) => {
			const aspectRatio = getImageAspectRatioRecord(imageAttributeObject.src);
			if (aspectRatio > 0 && availableWidthPx > 0) {
				fittedHeights.push(availableWidthPx / aspectRatio);
			}
		});

		return fittedHeights;
	};

	// uses the aspect ratio and maxHeight to determine
	// maximum required width for the carousel
	// only applies if showBlurInUnfilledSpace is false
	const getAllFittedWidthsPx = () => {
		const fittedWidths = [];

		// for each, record the fitted width
		imageMetaSet.forEach((imageAttributeObject) => {
			const aspectRatio = getImageAspectRatioRecord(imageAttributeObject.src);
			if (aspectRatio > 0 && maxHeightPxFromProp > 0) {
				fittedWidths.push(maxHeightPxFromProp * aspectRatio);
			}
		});

		return fittedWidths;
	};

	const imageMetaSetHasAspectRatios = () =>
		imageMetaSet.every((image) => getImageAspectRatioRecord(image.src) > 0);

	const sizingReady = () =>
		carouselRef &&
		availableWidthPx > 0 &&
		maxHeightPxFromProp > 0 &&
		imageMetaSetHasAspectRatios();

	const setActiveImage = (imageAttributesObject, endAutoAdvance = false) => {
		// only set active image if image is different
		if (activeImageMeta.src !== imageAttributesObject.src) {
			activeImageMeta = imageAttributesObject;
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
			let currentIndex = imageMetaSet.indexOf(activeImageMeta);
			currentIndex = (currentIndex + 1) % imageMetaSet.length;
			setActiveImage(imageMetaSet[currentIndex], true);
		}
		if (touchEndX - touchStartX > minSwipeDistance) {
			// swipe right
			let currentIndex = imageMetaSet.indexOf(activeImageMeta);
			currentIndex = (currentIndex - 1 + imageMetaSet.length) % imageMetaSet.length;
			setActiveImage(imageMetaSet[currentIndex], true);
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
							let currentIndex = imageMetaSet.indexOf(activeImageMeta);
							currentIndex = (currentIndex + 1) % imageMetaSet.length;
							setActiveImage(imageMetaSet[currentIndex]);
						}, autoAdvanceInterval);
					} else {
						clearInterval(intervalId);
					}
				},
				{ threshold: 0.5 /* ensure carousel is 50% visible before auto-advancing */ }
			);

			observer.observe(carouselRef);
		}

		// Shrink-to-fit flex parents reflect the carousel's own width and cause a feedback
		// loop. Measure the flex row, then subtract sibling columns so we don't treat the
		// full row width as space for the image.
		const parentIsFlex =
			parentRef && window.getComputedStyle(parentRef).display === 'flex';
		const flexRowRef =
			parentIsFlex && parentRef.parentElement ? parentRef.parentElement : null;

		const updateAvailableWidthPx = () => {
			let nextWidthPx;

			if (flexRowRef) {
				const rowStyle = window.getComputedStyle(flexRowRef);
				const isRowLayout =
					rowStyle.flexDirection === 'row' || rowStyle.flexDirection === 'row-reverse';

				if (isRowLayout) {
					const rowWidthPx = getMaxElementWidthPx(flexRowRef);
					let siblingWidthPx = 0;
					for (const child of flexRowRef.children) {
						if (child !== parentRef) {
							siblingWidthPx += child.getBoundingClientRect().width;
						}
					}
					const flexGapPx =
						parseFloat(rowStyle.columnGap) || parseFloat(rowStyle.gap) || 0;
					const gapCount = flexRowRef.children.length > 1 ? flexRowRef.children.length - 1 : 0;
					nextWidthPx = rowWidthPx - siblingWidthPx - flexGapPx * gapCount;
				} else {
					nextWidthPx = getMaxElementWidthPx(carouselRef);
				}
			} else {
				nextWidthPx = getMaxElementWidthPx(carouselRef);
			}

			if (nextWidthPx > 0) {
				availableWidthPx = nextWidthPx;
			}
		};

		updateAvailableWidthPx();

		const observer = new ResizeObserver(() => {
			updateAvailableWidthPx();
		});
		const resizeObservedRef = flexRowRef ?? carouselRef;
		observer.observe(resizeObservedRef);
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
		if (sizingReady()) {
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
		if (!sizingReady() || !finalMaxFittedHeightPx) {
			activeImageFittedWidthPx = undefined;
		} else {
			const activeAspectRatio = getImageAspectRatioRecord(activeImageMeta.src);
			const activeImageFittedWidthPxFromRecord = activeAspectRatio * finalMaxFittedHeightPx;
			activeImageFittedWidthPx =
				activeImageFittedWidthPxFromRecord >= availableWidthPx
					? availableWidthPx
					: activeImageFittedWidthPxFromRecord;
		}
	}

	// set the carousel height based on the max height in fitted heights array
	let dynamicHeightCss = css`
		height: ${maxHeight};
	`;
	$: {
		$windowWidth;
		if (sizingReady() && allFittedHeightsPx?.length > 0) {
			const validHeightsPx = allFittedHeightsPx.filter((height) => isFinite(height) && height > 0);
			if (validHeightsPx.length === 0) {
				finalMaxFittedHeightPx = undefined;
			} else {
				const maxFittedHeightPxFromArray = Math.round(Math.max(...validHeightsPx));
				if (
					maxFittedHeightPxFromArray > 0 &&
					isFinite(maxFittedHeightPxFromArray) &&
					isFinite(maxHeightPxFromProp)
				) {
					finalMaxFittedHeightPx = Math.min(maxHeightPxFromProp, maxFittedHeightPxFromArray);
					maxHeight = `${finalMaxFittedHeightPx}px`;
					dynamicHeightCss = css`
						height: ${finalMaxFittedHeightPx}px;
					`;
				}
			}
		}
	}

	// set the carousel dynamic width to ensure it takes up only the width it needs
	// this only applies if showBlurInUnfilledSpace is false
	let dynamicWidthCss = css``;
	$: {
		if (
			sizingReady() &&
			allFittedWidthsPx?.length > 0 &&
			activeImageFittedWidthPx > 0
		) {
			const validWidthsPx = allFittedWidthsPx.filter((width) => isFinite(width) && width > 0);
			if (validWidthsPx.length === 0) {
				dynamicWidthCss = css``;
			} else {
				const maxFittedWidthPxFromArray = Math.round(Math.max(...validWidthsPx));
				finalMaxFittedWidthPx =
					maxFittedWidthPxFromArray <= availableWidthPx
						? maxFittedWidthPxFromArray
						: availableWidthPx;
				const compositeCarouselWidthPx = matchMaxImageWidth
					? finalMaxFittedWidthPx
					: activeImageFittedWidthPx;
				dynamicWidthCss = css`
					width: ${showBlurInUnfilledSpace && activeImageMeta.showBackgroundBlur
						? '100%;'
						: `${compositeCarouselWidthPx}px`};
				`;
			}
		}
	}

	// the thumbnail container shouldn't be wider than the image
	let dynamicThumbnailContainerWidthCss = css``;
	$: {
		if (sizingReady() && isFinite(finalMaxFittedWidthPx)) {
			dynamicThumbnailContainerWidthCss = css`
				width: ${showBlurInUnfilledSpace ? '100%' : `${finalMaxFittedWidthPx}px`};
			`;
		}
	}

	// the expand button overlay should appear in the corner of the active image
	let dynamicExpandButtonOverlayCss = css``;
	$: {
		if (sizingReady() && activeImageFittedWidthPx > 0) {
			dynamicExpandButtonOverlayCss = css`
				width: ${justifyContent === 'center' ? '100%' : activeImageFittedWidthPx + 'px'};
				justify-content: ${activeImageMeta?.toolbarJustification};
				right: ${justifyContent !== 'center' ? '0' : ''};
				padding: 10px
					${(showBlurInUnfilledSpace && activeImageMeta.showBackgroundBlur) ||
					(matchMaxImageWidth && justifyContent === 'center')
						? Math.abs(availableWidthPx - activeImageFittedWidthPx) / 2 + 10 + 'px'
						: '10px'}
					10px
					${(showBlurInUnfilledSpace && activeImageMeta.showBackgroundBlur) ||
					(matchMaxImageWidth && justifyContent === 'center')
						? Math.abs(availableWidthPx - activeImageFittedWidthPx) / 2 + 10 + 'px'
						: '10px'};
			`;
		}
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
					imageMeta={activeImageMeta}
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
					imageMeta={activeImageMeta}
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
					showImageViewerModal.set(true);
					imageViewerMeta.set(activeImageMeta);
				}}
				faIcon="fa-solid fa-expand"
				label={null}
				paddingLeftRight={'8px'}
				paddingTopBottom={'8px'}
				backgroundColor={$appAccentColors[0]}
				tooltip="Expand image"
				doForceSquareAspect
			/>
		</div>
	</div>
	{#if (showCaption && activeImageMeta.caption) || (showAttribution && activeImageMeta.attribution) || (showDate && activeImageMeta.date)}
		<div class="caption-attribution-wrapper {dynamicThumbnailContainerWidthCss}">
			<JDGImageCaptionAttribution
				imageMeta={activeImageMeta}
				{showCaption}
				{showAttribution}
				{showDate}
				backgroundColorRgba={activeImageMeta.showBackgroundBlur
					? $themeColors.imageLabelBackground
					: 'rgba(0, 0, 0, 0)'}
				maxTextWidthPx={activeImageFittedWidthPx}
			/>
		</div>
	{/if}
	<div class="carousel-thumbnail-container {dynamicThumbnailContainerWidthCss} {justificationCss}">
		{#each imageMetaSet as imageAttributesObject, i}
			<div
				class="carousel-thumbnail-wrapper"
				style={imageAttributesObject === activeImageMeta
					? `outline: 5px solid ${activeThumbnailColor}`
					: ''}
			>
				<JDGImageTile
					onClickFunction={() => {
						setActiveImage(imageAttributesObject, true);
					}}
					imageMeta={imageAttributesObject}
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
		display: flex;
		align-items: center;
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
