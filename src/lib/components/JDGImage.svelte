<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import uiState from '$lib/states/ui-state.js';

	import { convertVhToPixels, instantiateObject } from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { JDGImageCaptionAttribution } from '$lib/index.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes); // one object for all image data
	export let maxHeight = '300px'; // image will never exceed this height, but could be less depending on fillContainer
	export let maxWidth = undefined; // if not defined, takes available space
	export let alternateFitRef = undefined; // optionally use another element for image fit calcs
	export let fillContainer = true; // if true, image may be cropped to fill its container in both directions
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let isHovering = false; // parent can let image know of hover
	export let showHoverEffect = false; // zoom image slightly on hover
	export let showCaption = false;
	export let showAttribution = false;
	export let transition = fade; // fade or scale depending on usage

	let containerRef;
	let containerAspectRatio;
	let imageRef;
	let imageAspectRatio;

	// height can be in vh or px or even auto
	// if in vh, convert to pixels for calculations
	let maxHeightValue;
	let maxHeightUnit;
	let maxHeightPx;
	// self-executing function that gets the pixel height from maxHeight prop
	const getMaxHeightPxFromProp = (() => {
		// if height is auto, skip all this
		if (maxHeight !== 'auto') {
			[maxHeightValue, maxHeightUnit] = maxHeight.match(/^(\d+)(\D+)$/).slice(1);
			const maxHeightParsed = parseFloat(maxHeightValue);
			// get the max height in px for calculations
			if (maxHeightUnit === 'vh') {
				maxHeightPx = convertVhToPixels(maxHeightParsed);
			} else if (maxHeightUnit === 'px') {
				maxHeightPx = maxHeightParsed;
			}
		}
	})();

	// calculate the aspect ratio of the image container and the image (if not already known)
	const getAspectRatios = () => {
		if (containerRef && imageRef) {
			containerAspectRatio = alternateFitRef
				? alternateFitRef.clientWidth / maxHeightPx
				: containerRef.clientWidth / maxHeightPx;
			if (!imageAspectRatio) {
				imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
			}
		}
	};

	const getPreferredContainerHeight = (imageAspectRatio, containerAspectRatio) => {
		if (containerRef && imageRef && maxHeight !== 'auto') {
			// if we're cropping, or showing the blur behind, height is always the max height
			if (fillContainer || showBlurInUnfilledSpace) {
				return maxHeight;
			}
			// else, need to determine crop based on aspect ratios
			switch (true) {
				// image is wider than container
				case imageAspectRatio > containerAspectRatio:
					return 'auto';
				// image is taller than container
				case imageAspectRatio < containerAspectRatio:
					return maxHeight;
				default:
					return maxHeight;
			}
		}
	};

	const getPreferredObjectFit = (imageAspectRatio, containerAspectRatio) => {
		if (imageRef && containerRef) {
			// if we're cropping, fit is always cover
			if (fillContainer) {
				return 'cover';
			}
			// else, need to determine fit based on aspect ratios
			switch (true) {
				// image is wider than container
				case imageAspectRatio > containerAspectRatio:
					return 'contain';
				// image is taller than container
				case imageAspectRatio < containerAspectRatio:
					return 'contain';
				default:
					return 'cover';
			}
		}
	};

	const setImageSizeAndFit = (imageAspectRatio, containerAspectRatio) => {
		imageContainerCssDynamic = css`
			height: ${getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
			width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
		`;
		imageCssDynamic = css`
			object-fit: ${getPreferredObjectFit(imageAspectRatio, containerAspectRatio)};
		`;
	};

	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		getAspectRatios();
	};

	const imageCssStatic = css`
		/* if max height is not specified, use all available space below the header */
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto' ? `calc(100vh - ${jdgSizes.headerHeightSm})` : ''};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto' ? `calc(100vh - ${jdgSizes.headerHeightMd})` : ''};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto' ? `calc(100vh - ${jdgSizes.headerHeightLg})` : ''};
		}
	`;

	const imageAnimationCss = css`
		:hover {
			transform: ${showHoverEffect ? 'scale(1.04);' : ''};
		}
	`;

	const imageBlurCss = css`
		background-image: url(${imageAttributes.imgSrc});
	`;

	// may be updated dynamically by setImageSizeAndFit
	let imageContainerCssDynamic = css`
		height: ${maxHeight};
		width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
	`;
	let imageCssDynamic = css`
		object-fit: cover;
	`;

	// set dynamically by isHovering and showHoverEffect
	let captionAttributionWrapperCssDynamic = css``;

	onMount(() => {
		if (imageRef && !fillContainer) {
			imageRef.addEventListener('load', onImageLoad);
		}
	});

	onDestroy(() => {
		if (imageRef && !fillContainer) {
			imageRef.removeEventListener('load', onImageLoad);
		}
	});

	$: {
		if (!fillContainer) {
			// ensure the aspect ratios are updated when the window width changes in state
			$uiState.windowWidth;
			getAspectRatios();
			setImageSizeAndFit(imageAspectRatio, containerAspectRatio);
		}
		captionAttributionWrapperCssDynamic = css`
			bottom: ${isHovering && showHoverEffect ? '9px' : '0px'};
			transition: bottom ${isHovering && showHoverEffect ? '400ms' : '200ms'};
		`;
	}
</script>

<div
	transition:transition={{ duration: 300 }}
	bind:this={containerRef}
	class="jdg-image-container {imageContainerCssDynamic}"
>
	<img
		bind:this={imageRef}
		class={`image ${imageCssDynamic} ${imageCssStatic} ${imageAnimationCss}`}
		src={imageAttributes.imgSrc}
		alt={imageAttributes.imgAlt}
	/>
	<!-- only show blurred image behind if blurUnfilledSpace is true -->
	{#if showBlurInUnfilledSpace && !fillContainer}
		<div class="image-blur {imageBlurCss}"></div>
		<div class="image-blur-background"></div>
	{/if}
	<!-- caption and attribution -->
	{#if showCaption || showAttribution}
		<div class="caption-attribution-wrapper {captionAttributionWrapperCssDynamic}">
			<JDGImageCaptionAttribution {imageAttributes} {showCaption} {showAttribution} />
		</div>
	{/if}
</div>

<style>
	.jdg-image-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
	}

	.image {
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease-in-out;
	}

	.image-blur {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
		filter: blur(5px);
		background-size: cover;
		background-position: center;
		opacity: 0.5;
	}

	.image-blur-background {
		background-color: white;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
	}

	.caption-attribution-wrapper {
		position: absolute;
		width: 100%;
	}
</style>
