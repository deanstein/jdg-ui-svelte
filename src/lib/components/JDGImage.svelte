<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import uiState from '$lib/states/ui-state.js';

	import {
		addCloudinaryUrlHeight,
		addCloudinaryUrlWidth,
		convertVhToPixels,
		isUrlCloudinary,
		instantiateObject
	} from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgDurations, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { JDGImageCaptionAttribution, JDGLoadingSpinner } from '$lib/index.js';

	// show a local image while image is loading
	// @ts-expect-error
	import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';
	import { hideImageDetailModal } from '$lib/jdg-state-management.js';

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
	export let showPlaceholderImage = true;
	export let showLoadingSpinner = true;
	export let alignLoadingSpinner = 'center';
	export let transition = fade; // fade or scale depending on usage
	export let stopClickPropagation = false; // optional, for certain cases

	// DEBUGGING
	const showDebugMessagesInConsole = false;
	export let showDebugLoadingState = false;

	// for cloudinary media, imgSrc will be modified with transforms for optimization
	// if this isn't a cloudinary image, it will remain the current imgSrc
	let adjustedImgSrc = imageAttributes.imgSrc;
	let containerRef;
	// the ref used for cloudinary resolutions requests
	// this is either the alternate fit ref or the container ref
	let resolutionRef;
	let containerAspectRatio;
	let imageRef;
	let imageAspectRatio;
	let devicePixelRatio;
	let isImageLoaded = false;
	let isPlaceholderLoaded = false;

	// prevent redundant cloudinary transformation requests
	// by checking if the height of the image container has changed
	let previousHeight = 0;
	let previousWidth = 0;
	const heightOrWidthChangeThreshold = 100;

	// for the case where the imgSrc is not provided,
	// consider the image immediately loaded
	if (imageAttributes.imgSrc === imagePlaceholder && !showDebugLoadingState) {
		isImageLoaded = true;
	}

	// if the imageAttributes specify no blur, override showBlur to false
	if (!imageAttributes.allowBackgroundBlur) {
		showBlurInUnfilledSpace = false;
	}

	const onImageClick = (event) => {
		if (stopClickPropagation) {
			event.stopPropagation();
		}
	};

	// get a pixel value from whatever is passed into the maxHeight prop
	const getMaxHeightPxFromProp = () => {
		// height can be in vh or px or even auto
		// if in vh, convert to pixels for calculations
		let maxHeightValue;
		let maxHeightUnit;
		let maxHeightPx;
		// only calculate maxHeight if prop is not auto
		if (maxHeight !== 'auto') {
			[maxHeightValue, maxHeightUnit] = maxHeight.match(/^(\d+)(\D+)$/).slice(1);
			const maxHeightParsed = parseFloat(maxHeightValue);
			// get the max height in px for calculations
			if (maxHeightUnit === 'vh') {
				maxHeightPx = Math.ceil(convertVhToPixels(maxHeightParsed));
			} else if (maxHeightUnit === 'px') {
				maxHeightPx = Math.ceil(maxHeightParsed);
			}
		} else {
			// temporarily set the height to 100%
			const style = window.getComputedStyle(resolutionRef);
			const existingHeight = style.getPropertyValue('height');
			resolutionRef.style.height = '100%';
			// get the maxHeightPx
			maxHeightPx = resolutionRef.clientHeight;
			// reset the style to what it was before
			resolutionRef.style.height = parseInt(existingHeight) === 0 ? '' : existingHeight;
		}
		return maxHeightPx;
	};

	// calculate the aspect ratio of the image container and the image (if not already known)
	const getAspectRatios = () => {
		if (resolutionRef && imageRef) {
			imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
			const style = window.getComputedStyle(resolutionRef);
			const containerWidth = parseInt(style.getPropertyValue('width'));
			const containerHeight = parseInt(style.getPropertyValue('height'));
			containerAspectRatio = containerWidth / containerHeight;
		}
	};

	const getPreferredContainerHeight = () => {
		let preferredHeight;
		if (resolutionRef && imageRef) {
			// if we're cropping to fill container,
			// or showing the blur behind, height is always the max height
			if (
				fillContainer ||
				!showBlurInUnfilledSpace ||
				(compactModeOnMobile && $uiState.isMobileBreakpoint)
			) {
				preferredHeight = maxHeight;
			}

			// otherwise, need to determine crop based on aspect ratios
			switch (true) {
				// image is wider than container
				case imageAspectRatio > containerAspectRatio:
					preferredHeight = 'auto';
				// image is taller than container
				case imageAspectRatio < containerAspectRatio:
					preferredHeight = maxHeight;
				default:
					preferredHeight = maxHeight;
			}
		}
		return preferredHeight;
	};

	// is the image sizing and resolution based on the container's height, or its width?
	const getIsUsingContainerHeight = () => {
		getAspectRatios();
		if (!imageAspectRatio || !containerAspectRatio) {
			return true;
		}
		//debugger;
		// image is wider than container
		if (imageAspectRatio > containerAspectRatio) {
			// if filling container, use container height
			if (fillContainer) {
				return true;
				// otherwise, use container width
			} else {
				return false;
			}
		}
		// image is narrower than container
		else {
			// if filling the container, use container width
			if (fillContainer) {
				return false;
				// otherwise, use container height
			} else {
				return true;
			}
		}
	};

	// has the container's width or height changed since last time this was called?
	// this prevents duplicate/redundant Cloudinary requests
	const getHasDimensionChanged = () => {
		if (getIsUsingContainerHeight()) {
			if (
				Math.abs(resolutionRef.offsetHeight - previousHeight) > heightOrWidthChangeThreshold ||
				previousHeight === 0
			) {
				return true;
			}
		} else {
			if (
				Math.abs(resolutionRef.offsetWidth - previousWidth) > heightOrWidthChangeThreshold ||
				previousWidth === 0
			) {
				return true;
			}
		}
		return false;
	};

	// runs after an image is loaded
	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		getAspectRatios();
		if (!showDebugLoadingState) {
			isImageLoaded = true;
		}
	};

	// runs if an image fails to load
	const onImageError = () => {
		showImageError = true;
		imageErrorMessage += adjustedImgSrc;
	};
	let showImageError = false;
	let imageErrorMessage = 'Error loading image: ';

	// runs after the placeholder image is loaded
	const onPlaceholderLoad = () => {
		isPlaceholderLoaded = true;
	};

	const imageCssStatic = css`
		width: ${!fillContainer && showBlurInUnfilledSpace ? 'fit-content' : '100%'};
		height: 100%;
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

	// fading effect while image is loading
	const imageLoadingOverlayCss = css`
		animation: fade ${jdgDurations.loadingSpinnerInterval}${jdgDurations.unit} infinite;
		@keyframes fade {
			0% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
			100% {
				opacity: 1;
			}
		}
	`;

	const imageLoadingSpinnerContainerCss = css`
		align-items: ${alignLoadingSpinner};
		bottom: ${alignLoadingSpinner === 'end' ? '20px' : ''};
	`;

	// may be updated dynamically later
	let imageContainerCssDynamic = css`
		height: ${$uiState.isMobileBreakpoint && compactModeOnMobile
			? 'auto'
			: getPreferredContainerHeight()};
		width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
	`;

	// set dynamically by isHovering and showHoverEffect
	let captionAttributionWrapperCssDynamic = css``;

	onMount(() => {
		devicePixelRatio = window.devicePixelRatio || 1;
		resolutionRef = alternateFitRef ?? containerRef;
	});

	$: {
		captionAttributionWrapperCssDynamic = css`
			bottom: ${isHovering && showHoverEffect ? '9px' : '0px'};
			transition: bottom ${isHovering && showHoverEffect ? '400ms' : '200ms'};
		`;
	}

	$: {
		// ensure the aspect ratios are updated when the window width changes in state
		$uiState.windowWidth;
		getAspectRatios();
		imageAspectRatio;
		containerAspectRatio;
		imageContainerCssDynamic = css`
			height: ${$uiState.isMobileBreakpoint && compactModeOnMobile
				? 'auto'
				: getPreferredContainerHeight()};
			width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
		`;
		if (
			resolutionRef &&
			getHasDimensionChanged() &&
			isImageLoaded &&
			isUrlCloudinary(imageAttributes.imgSrc)
		) {
			// set the height or width depending on the image fit
			// image is wider than container, so specify height
			if (getIsUsingContainerHeight()) {
				const adjustedHeight = Math.ceil(getMaxHeightPxFromProp() * devicePixelRatio);
				adjustedImgSrc = addCloudinaryUrlHeight(imageAttributes.imgSrc, adjustedHeight);
				previousHeight = resolutionRef.offsetHeight;
				if (showDebugMessagesInConsole) {
					console.log(
						'Specifying height in Cloudinary URL. Adjusted Cloudinary URL: ' + adjustedImgSrc
					);
				}
			}
			// otherwise, image is narrower than container
			// so specify the image width
			else {
				adjustedImgSrc = addCloudinaryUrlWidth(
					imageAttributes.imgSrc,
					Math.ceil(containerRef.offsetWidth * devicePixelRatio)
				);
				previousWidth = containerRef.offsetWidth;
				if (showDebugMessagesInConsole) {
					console.log(
						'Specifying width in Cloudinary URL. Adjusted Cloudinary URL: ' + adjustedImgSrc
					);
				}
			}
		}
	}
</script>

<div
	transition:transition={{ duration: jdgDurations.fadeIn }}
	bind:this={containerRef}
	class="jdg-image-container {imageContainerCssDynamic}"
>
	<img
		on:click={onImageClick}
		bind:this={imageRef}
		on:load={showPlaceholderImage
			? isPlaceholderLoaded
				? onImageLoad
				: onPlaceholderLoad
			: onImageLoad}
		on:error={onImageError}
		class={`image ${imageCssStatic} ${imageAnimationCss}`}
		src={showPlaceholderImage
			? isImageLoaded || isPlaceholderLoaded
				? adjustedImgSrc
				: imagePlaceholder
			: adjustedImgSrc}
		alt={imageAttributes.imgAlt}
	/>
	<!-- only show blurred image behind if blurUnfilledSpace is true -->
	{#if showBlurInUnfilledSpace && !fillContainer}
		<div
			class="image-blur"
			style={`background-image: url(${imageAttributes.imgSrc}); opacity: ${
				isImageLoaded ? 1 : 0.25
			}; transition: opacity ${jdgDurations.fadeIn}${jdgDurations.unit} ease-in-out;`}
		></div>
		<div on:click|self={hideImageDetailModal} class="image-blur-background"></div>
	{/if}
	<!-- caption and attribution -->
	{#if showCaption || showAttribution}
		<div class="caption-attribution-wrapper {captionAttributionWrapperCssDynamic}">
			<JDGImageCaptionAttribution {imageAttributes} {showCaption} {showAttribution} />
		</div>
	{/if}
	<!-- show the spinner during loading if requested -->
	{#if !isImageLoaded && showLoadingSpinner}
		<div class="image-loading-spinner-container {imageLoadingSpinnerContainerCss}">
			<JDGLoadingSpinner />
		</div>
	{/if}
	<!-- show the image placeholder during loading if requested -->
	{#if !isImageLoaded && showPlaceholderImage}
		<div class="image-loading-overlay {imageLoadingOverlayCss}" />
	{/if}
	{#if showImageError}
		<div class="image-error-overlay">
			{imageErrorMessage}
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
		position: absolute;
		z-index: -2;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.image-loading-spinner-container {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		z-index: 3;
	}

	.image-loading-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(50, 50, 50, 0.5);
		z-index: 2;
	}

	.image-error-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: red;
		color: white;
	}

	.caption-attribution-wrapper {
		position: absolute;
		width: 100%;
	}
</style>
