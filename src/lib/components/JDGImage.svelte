<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import uiState from '$lib/states/ui-state.js';

	import {
		addCloudinaryUrlHeight,
		addCloudinaryUrlWidth,
		addCloudinaryUrlTransformation,
		convertVhToPixels,
		isUrlCloudinary,
		instantiateObject
	} from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { JDGImageCaptionAttribution } from '$lib/index.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes); // one object for all image data
	export let maxHeight = '350px'; // image will never exceed this height, but could be less depending on fillContainer
	export let maxWidth = undefined; // if not defined, takes available space
	export let alternateFitRef = undefined; // optionally use another element for image fit calcs
	export let fillContainer = true; // if true, image may be cropped to fill its container in both directions
	export let compactModeOnMobile = false; // if true, ignores fillContainer on smallest breakpoint for no cropping and fitted container (less height)
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let isHovering = false; // parent can let image know of hover
	export let showHoverEffect = false; // zoom image slightly on hover
	export let showCaption = false;
	export let showAttribution = false;
	export let transition = fade; // fade or scale depending on usage

	let adjustedImgSrc;
	let containerRef;
	let containerAspectRatio;
	let imageRef;
	let imageAspectRatio;
	let isImageLoaded = false;

	// height can be in vh or px or even auto
	// if in vh, convert to pixels for calculations
	let maxHeightValue;
	let maxHeightUnit;
	let maxHeightPx;

	// prevent redundant cloudinary transformation requests
	// by checking if the height of the image container has changed
	let previousHeight = 0;
	let previousWidth = 0;
	const heightOrWidthChangeThreshold = 10;

	// self-executing function that gets the pixel height from maxHeight prop
	// (it may look like this is unused, but it's used! don't delete)
	const getMaxHeightPxFromProp = (() => {
		// only calculate maxHeight if prop is not auto
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
				? //@ts-expect-error
					alternateFitRef.clientWidth / maxHeightPx
				: containerRef.clientWidth / maxHeightPx;
			if (!imageAspectRatio) {
				imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
			}
		}
	};

	const getPreferredContainerHeight = (imageAspectRatio, containerAspectRatio) => {
		if (containerRef && imageRef) {
			// if we're cropping to fill container,
			// or showing the blur behind, height is always the max height
			if (
				fillContainer ||
				showBlurInUnfilledSpace ||
				(compactModeOnMobile && $uiState.isMobileBreakpoint)
			) {
				return maxHeight;
			}
			// otherwise, need to determine crop based on aspect ratios
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
		return maxHeight;
	};

	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		getAspectRatios();
		isImageLoaded = true;
	};

	const imageCssStatic = css`
		object-fit: ${fillContainer || (compactModeOnMobile && $uiState.isMobileBreakpoint)
			? 'cover'
			: 'contain'};
		/* if max height is not specified, use all available space below the header */
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightSm} - ${
						$uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightMd}  - ${
						$uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightLg} - ${
						$uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0
					}px)`
				: ''};
		}
	`;

	const imageAnimationCss = css`
		@media (hover: hover) {
			:hover {
				transform: ${showHoverEffect ? 'scale(1.04);' : ''};
			}
		}
	`;

	// may be updated dynamically by setImageSizeAndFit
	let imageContainerCssDynamic = css`
		height: ${$uiState.isMobileBreakpoint && compactModeOnMobile
			? 'auto'
			: getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
		width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
	`;

	// set dynamically by isHovering and showHoverEffect
	let captionAttributionWrapperCssDynamic = css``;

	// set dynamically when image container size is known
	let imageBlurCssDynamic = css`
		background-image: url(${adjustedImgSrc});
	`;

	onMount(() => {
		if (imageRef && !fillContainer) {
			imageRef.addEventListener('load', onImageLoad);
		}

		// initial image is a low-quality one
		adjustedImgSrc = addCloudinaryUrlTransformation(imageAttributes.imgSrc, 'q_0');
	});

	onDestroy(() => {
		if (imageRef && !fillContainer) {
			imageRef.removeEventListener('load', onImageLoad);
		}
	});

	$: {
		// ensure the aspect ratios are updated when the window width changes in state
		$uiState.windowWidth;
		getAspectRatios();
		imageContainerCssDynamic = css`
			height: ${$uiState.isMobileBreakpoint && compactModeOnMobile
				? 'auto'
				: getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
			width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
		`;

		captionAttributionWrapperCssDynamic = css`
			bottom: ${isHovering && showHoverEffect ? '9px' : '0px'};
			transition: bottom ${isHovering && showHoverEffect ? '400ms' : '200ms'};
		`;

		// if the image is a cloudinary URL,
		// get the required height and width from the image container
		// so we can modify the URL to specify those sizes and get an asset that fits its container
		if (
			containerRef &&
			Math.abs(containerRef.offsetHeight - previousHeight) > heightOrWidthChangeThreshold &&
			isImageLoaded &&
			isUrlCloudinary(imageAttributes.imgSrc)
		) {
			// set the height or width depending on the image fit
			// if this function returns "auto" then the image height should be specified
			if (getPreferredContainerHeight(imageAspectRatio, containerAspectRatio) === 'auto') {
				adjustedImgSrc = addCloudinaryUrlHeight(imageAttributes.imgSrc, containerRef.offsetHeight);
				previousHeight = containerRef.offsetHeight;
			}
			// otherwise, specify the image width
			else {
				adjustedImgSrc = addCloudinaryUrlWidth(imageAttributes.imgSrc, containerRef.offsetWidth);
				previousWidth = containerRef.offsetWidth;
			}
		}

		imageBlurCssDynamic = css`
			background-image: url(${adjustedImgSrc});
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
		on:load={onImageLoad}
		class={`image ${imageCssStatic} ${imageAnimationCss}`}
		src={adjustedImgSrc}
		alt={imageAttributes.imgAlt}
	/>
	<!-- only show blurred image behind if blurUnfilledSpace is true -->
	{#if showBlurInUnfilledSpace && !fillContainer}
		<div class="image-blur {imageBlurCssDynamic}"></div>
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

	.image-loading-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		background-color: rgba(50, 50, 50, 0.5);
		animation: fade 2s infinite;
	}

	/* used for a fading effect while the image is loading */
	@keyframes fade {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.caption-attribution-wrapper {
		position: absolute;
		width: 100%;
	}
</style>
