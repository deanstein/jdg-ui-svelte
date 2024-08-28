<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { isNumberValid } from '$lib/jdg-utils.js';
	import uiState, { isMobileBreakpoint, windowWidth } from '$lib/states/ui-state.js';

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

	// EXPORTS

	export let imageAttributes = instantiateObject(jdgImageAttributes); // one object for all image data
	export let maxHeight = '350px'; // image will never exceed this height, but could be less depending on other props
	export let maxWidth = 'auto'; // if not defined, takes available space
	export let alternateFitRef = undefined; // optionally use another element for image fit calcs
	export let cropToFillContainer = true; // if true, image may be cropped to fill its container in both directions
	export let useCompactHeightOnMobile = false; // if true, sets height to 'auto' on smallest breakpoint for no cropping if calculatedAutoHeight is less than maxHeightPxFromProp (ignores cropToFitContainer)
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let isHovering = false; // parent can let image know of hover
	export let showHoverEffect = false; // zoom image slightly on hover
	export let showCaption = false;
	export let showAttribution = false;
	export let showPlaceholderImage = true;
	export let showLoadingSpinner = true;
	export let alignLoadingSpinner = 'center';
	export let stopEventPropagation = false; // can be used in certain cases to ensure clicking on the image stops the event to its parent
	export let transition = fade; // fade or scale depending on usage

	// DEBUGGING

	const showDebugMessagesInConsole = true;
	export let showDebugLoadingState = false;

	// WINDOW

	let devicePixelRatio;

	// CONTAINER

	// element references used for measurements
	let containerRef; // used for determining container aspect ratio
	let resolutionRef; // used for cloudinary resolution requests - this is either the alternate fit ref or container ref
	let imageRef; // used for determining image aspect ratio

	// these values could change many times or be invalid numbers
	// as the page loads, layout adjusts, or the page loads
	let lastKnownContainerWidth;
	let lastKnownContainerHeight;
	let lastKnownContainerAspectRatio;

	// these values have been validated - they're defined, non-zero, and not NaN
	// they're also not rewritten if valid, unless forced
	let validContainerWidth;
	let validContainerHeight;
	let validContainerAspectRatio;

	// IMAGE

	// for cloudinary images, imgSrc will be modified with transforms for optimization
	// if this isn't a cloudinary image, it will remain the current imgSrc
	let adjustedImgSrc = imageAttributes.imgSrc;

	let imageAspectRatio;
	let isImageLoaded = false;
	let isPlaceholderLoaded = false;

	// prevent redundant calculations
	// by checking last known sizes with current sizes
	let lastKnownPreferredContainerHeightType;
	let lastKnownCloudinaryTransformationValue;

	// FIT TYPES

	const fitTypeMaxHeightDefault = 'MAXHEIGHT (DEFAULT)';
	const fitTypeMaxHeight = 'MAXHEIGHT';
	const fitTypeAuto = 'AUTO';
	const fitTypeCalculatedAuto = 'IMAGEAUTO';

	// SPECIAL CASES

	// for the case where the imgSrc is not provided,
	// consider the image immediately loaded
	if (imageAttributes.imgSrc === imagePlaceholder && !showDebugLoadingState) {
		isImageLoaded = true;
	}

	// if the imageAttributes specify no blur, override showBlur to false
	if (!imageAttributes.allowBackgroundBlur) {
		showBlurInUnfilledSpace = false;
	}

	// even if not specified, default compactModeOnMobile to true
	// if not filling container or showing blur
	if (!cropToFillContainer && !showBlurInUnfilledSpace) {
		//compactModeOnMobile = true;
	}

	// FUNCTIONS

	const onImageClick = (event) => {
		if (stopEventPropagation) {
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
			maxHeightPx = getMaxHeightPxFromContainer();
		}
		return maxHeightPx;
	};

	const getMaxHeightPxFromContainer = () => {
		let maxHeightPx;
		// temporarily set the height to 100%
		const existingHeight = resolutionRef.style.height;
		resolutionRef.style.height = '100%';
		// get the maxHeightPx
		maxHeightPx = resolutionRef.clientHeight;
		// reset the style to what it was before
		resolutionRef.style.height = existingHeight;
		return maxHeightPx;
	};

	// get a pixel value from whatever is passed into the maxHeight prop
	const getMaxWidthFromProp = () => {
		// width can be in vh or px or even auto
		// if in vh, convert to pixels for calculations
		let maxWidthValue;
		let maxWidthUnit;
		let maxWidthPx;
		// only calculate maxWidth if prop is not auto
		if (maxWidth !== 'auto') {
			[maxWidthValue, maxWidthUnit] = maxWidth.match(/^(\d+)(\D+)$/).slice(1);
			const maxWidthParsed = parseFloat(maxWidthValue);
			// get the max width in px for calculations
			if (maxWidthUnit === 'vh') {
				maxWidthPx = Math.ceil(convertVhToPixels(maxWidthParsed));
			} else if (maxWidthUnit === 'px') {
				maxWidthPx = Math.ceil(maxWidthParsed);
			}
		} else {
			maxWidthPx = getMaxWidthFromContainer();
		}
		return maxWidthPx;
	};

	export const getMaxWidthFromContainer = () => {
		let maxWidthPx;
		// temporarily set the width to 100%
		const existingWidth = resolutionRef.style.width;
		resolutionRef.style.width = '-webkit-fill-available';
		// get the maxWidth
		maxWidthPx = resolutionRef.clientWidth;
		// reset the style to what it was before
		resolutionRef.style.width = existingWidth;
		return maxWidthPx;
	};

	// calculate the aspect ratio of the image container and the image (if not already known)
	const getAspectRatios = () => {
		if (resolutionRef && imageRef) {
			imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
			lastKnownContainerHeight = getMaxHeightPxFromContainer();
			lastKnownContainerWidth = getMaxWidthFromContainer();
			lastKnownContainerAspectRatio = lastKnownContainerWidth / lastKnownContainerHeight;
		}
	};

	const getPreferredContainerHeight = () => {
		let preferredHeight = maxHeight;
		let preferredHeightTitle = 'MAXHEIGHT (DEFAULT)';
		if (imageRef && validContainerAspectRatio) {
			if (showDebugMessagesInConsole) {
				console.log('Getting preferred container height for: ' + imageAttributes.imgSrc);
				console.log('Current valid container height: ' + validContainerHeight);
				console.log('Max height from container: ' + getMaxHeightPxFromContainer());
				console.log('Max height from prop: ' + getMaxHeightPxFromProp());
				console.log('Max width from prop: ' + getMaxWidthFromProp());
				console.log('Max width from container: ' + getMaxWidthFromContainer());
			}

			const imageAutoHeight = validContainerWidth / imageAspectRatio;

			// if we're cropping to fill container,
			// or showing the blur behind, height is always the max height
			if (cropToFillContainer || showBlurInUnfilledSpace) {
				preferredHeight = maxHeight;
				preferredHeightTitle = fitTypeMaxHeight;
			}

			if (
				!cropToFillContainer &&
				!showBlurInUnfilledSpace &&
				!$isMobileBreakpoint &&
				!useCompactHeightOnMobile
			) {
				preferredHeight = maxHeight;
				preferredHeightTitle = fitTypeMaxHeight;
			}

			if (
				$isMobileBreakpoint &&
				useCompactHeightOnMobile &&
				getMaxHeightPxFromProp() > getMaxHeightPxFromContainer()
			) {
				preferredHeight = 'auto';
				preferredHeightTitle = fitTypeAuto;
			}

			if (!cropToFillContainer && maxWidth === '100%') {
				preferredHeight = `${imageAutoHeight.toString()}px`;
				preferredHeightTitle = fitTypeCalculatedAuto;
			}

			if (showDebugMessagesInConsole) {
				console.log('Choosing ' + preferredHeightTitle + ' for image: ' + imageAttributes.imgSrc);
			}
		}
		lastKnownPreferredContainerHeightType = preferredHeightTitle;
		return { value: preferredHeight, label: preferredHeightTitle };
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

	// EMOTION STYLES

	const imageCssStatic = css`
		width: ${stopEventPropagation ? '' : '100%'};
		object-fit: ${cropToFillContainer || (useCompactHeightOnMobile && $isMobileBreakpoint)
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

	const imageBlurCss = css`
		filter: blur(${jdgSizes.blurSizeMedium});
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

	// LIFECYCLE

	onMount(() => {
		imageContainerCssDynamic = css`
			height: ${maxHeight};
		`;
		devicePixelRatio = window.devicePixelRatio || 1;
		resolutionRef = alternateFitRef ?? containerRef;
	});

	// REACTIVE BLOCKS

	// set valid values just once, if not already defined
	$: {
		getAspectRatios();
		if (isNumberValid(lastKnownContainerAspectRatio) && !isNumberValid(validContainerAspectRatio)) {
			validContainerAspectRatio = lastKnownContainerAspectRatio;
			if (showDebugMessagesInConsole) {
				console.log('SETTING VALID CONTAINER ASPECT RATIO: ', validContainerAspectRatio);
			}
		}
		if (isNumberValid(lastKnownContainerHeight) && !isNumberValid(validContainerHeight)) {
			validContainerHeight = lastKnownContainerHeight;
		}
		if (isNumberValid(lastKnownContainerWidth) && !isNumberValid(validContainerWidth)) {
			validContainerWidth = lastKnownContainerWidth;
		}
	}

	// update dynamic emotion styles
	let captionAttributionWrapperCssDynamic = css``;
	$: {
		captionAttributionWrapperCssDynamic = css`
			bottom: ${isHovering && showHoverEffect ? '9px' : '0px'};
			transition: bottom ${isHovering && showHoverEffect ? '400ms' : '200ms'};
		`;
	}

	let imageContainerCssDynamic = css`
		height: ${maxHeight};
	`;
	$: {
		if (validContainerAspectRatio) {
			imageContainerCssDynamic = css`
				height: ${getPreferredContainerHeight().value};
				width: ${showBlurInUnfilledSpace ? '100%' : maxWidth ?? 'auto'};
			`;
		}
	}

	// update cloudinary URLs
	$: {
		if (containerRef) {
			if (!lastKnownCloudinaryTransformationValue) {
				lastKnownPreferredContainerHeightType = getPreferredContainerHeight().label;
			}
			const style = getComputedStyle(containerRef);
			const containerHeight = style.getPropertyValue('height');
			const containerWidth = style.getPropertyValue('width');
			const imageAutoHeight = validContainerWidth / imageAspectRatio;
			if (
				isImageLoaded &&
				isUrlCloudinary(imageAttributes.imgSrc) &&
				!isNaN(imageAutoHeight) &&
				!lastKnownCloudinaryTransformationValue
			) {
				if (showDebugMessagesInConsole) {
					console.log(
						'Image auto height: ' + imageAutoHeight,
						'Container height: ' + parseInt(containerHeight)
					);
				}
				// preferred container height is max height
				if (
					lastKnownPreferredContainerHeightType === fitTypeMaxHeight ||
					lastKnownPreferredContainerHeightType === fitTypeMaxHeightDefault
				) {
					if (cropToFillContainer) {
						// if the calculated image height is less than the container,
						// specify cloudinary URL width
						if (imageAutoHeight >= parseInt(containerHeight)) {
							const adjustedWidth = Math.ceil(parseInt(containerWidth) * devicePixelRatio);
							adjustedImgSrc = addCloudinaryUrlWidth(imageAttributes.imgSrc, adjustedWidth);
							if (showDebugMessagesInConsole) {
								console.log(
									'Specifying width in Cloudinary URL. Adjusted Cloudinary URL:',
									adjustedWidth,
									adjustedImgSrc
								);
							}
							lastKnownCloudinaryTransformationValue = adjustedWidth;
						}
						// otherwise, specify cloudinary URL height
						else {
							const adjustedHeight = Math.ceil(getMaxHeightPxFromProp() * devicePixelRatio);
							adjustedImgSrc = addCloudinaryUrlHeight(imageAttributes.imgSrc, adjustedHeight);
							if (showDebugMessagesInConsole) {
								console.log(
									'Specifying height in Cloudinary URL. Adjusted Cloudinary URL:',
									adjustedHeight,
									adjustedImgSrc
								);
							}
							lastKnownCloudinaryTransformationValue = adjustedHeight;
						}
					}
					// no fill container
					else {
						const adjustedHeight = Math.ceil(getMaxHeightPxFromProp() * devicePixelRatio);
						adjustedImgSrc = addCloudinaryUrlHeight(imageAttributes.imgSrc, adjustedHeight);
						if (showDebugMessagesInConsole) {
							console.log(
								'Specifying height in Cloudinary URL. Adjusted Cloudinary URL:',
								adjustedHeight,
								adjustedImgSrc
							);
						}
						lastKnownCloudinaryTransformationValue = adjustedHeight;
					}
					// preferred container height is "image auto" or auto
				} else if (
					lastKnownPreferredContainerHeightType === fitTypeCalculatedAuto ||
					lastKnownPreferredContainerHeightType === fitTypeAuto
				) {
					const adjustedHeight = Math.ceil(
						(validContainerWidth / imageAspectRatio) * devicePixelRatio
					);
					adjustedImgSrc = addCloudinaryUrlHeight(imageAttributes.imgSrc, adjustedHeight);
					if (showDebugMessagesInConsole) {
						console.log(
							'Specifying height in Cloudinary URL. Adjusted Cloudinary URL (auto):',
							adjustedHeight,
							adjustedImgSrc
						);
					}
					lastKnownCloudinaryTransformationValue = adjustedHeight;
				}
			}
		}
	}

	// reset last-known values for recalculation
	$: {
		if ($windowWidth !== 0) {
			console.log('WINDOW WIDTH CHANGED: ', $windowWidth);
			validContainerAspectRatio = undefined;
			validContainerHeight = undefined;
			validContainerWidth = undefined;
			lastKnownContainerHeight = undefined;
			lastKnownContainerWidth = undefined;
			lastKnownCloudinaryTransformationValue = undefined;
			// getAspectRatios();
			// getPreferredContainerHeight();
			// getMaxHeightPxFromContainer();
			// getMaxWidthFromContainer();
		}
	}
</script>

<div
	transition:transition={{ duration: jdgDurations.fadeIn }}
	bind:this={containerRef}
	class="jdg-image-container {imageContainerCssDynamic}"
>
	<!-- need to set an on:click only to potentially ignore clicks in some cases -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<img
		bind:this={imageRef}
		on:load={showPlaceholderImage
			? isPlaceholderLoaded
				? onImageLoad
				: onPlaceholderLoad
			: onImageLoad}
		on:error={onImageError}
		on:click={onImageClick}
		class={`image ${imageCssStatic} ${imageAnimationCss}`}
		src={showPlaceholderImage
			? isImageLoaded || isPlaceholderLoaded
				? adjustedImgSrc
				: imagePlaceholder
			: adjustedImgSrc}
		alt={imageAttributes.imgAlt}
	/>
	<!-- only show blurred image behind if blurUnfilledSpace is true -->
	{#if showBlurInUnfilledSpace && !cropToFillContainer}
		<div
			class="image-blur {imageBlurCss}"
			style={`background-image: url(${imageAttributes.imgSrc}); opacity: ${
				isImageLoaded ? 1 : 0.25
			}; transition: opacity ${jdgDurations.fadeIn}${jdgDurations.unit} ease-in-out;`}
		></div>
		<div class="image-blur-background"></div>
	{/if}
	<!-- caption and attribution -->
	{#if (showCaption && imageAttributes.imgCaption) || (showAttribution && imageAttributes.imgAttribution)}
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
		height: 100%;
		transition: transform 0.3s ease-in-out;
	}

	.image-blur {
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		width: 100%;
		height: 100%;
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
