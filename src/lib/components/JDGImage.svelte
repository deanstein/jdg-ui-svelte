<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import {
		getMaxElementHeightPx,
		getMaxElementWidthPx,
		getPixelValueFromString,
		isNumberValid
	} from '$lib/jdg-utils.js';
	import {
		imageDetailWidth,
		isMobileBreakpoint,
		doShowHeaderStripes,
		windowWidth
	} from '$lib/states/ui-state.js';
	import { recordImageAspectRatio } from '$lib/jdg-state-management.js';

	import {
		addCloudinaryUrlHeight,
		addCloudinaryUrlWidth,
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
	export let cropToFillContainer = true; // if true, image may be cropped to fill its container in both directions
	export let objectPosition = 'center'; // only applies when cropToFillContainer is true
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
	export let isForImageDetailOverlay = false; // special rules for ImageDetailOverlay context
	export let doScaleOnScrollOrZoom = false; // allow scaling up the image on scroll or zoom events
	export let scaleContext = 'container'; // which element to scale. other option: 'image'
	export let bottomVisibilityOffset = '1000px'; // distance from bottom of screen before loading (positive is down)
	export let recordAspectRatioInState = false;

	// DEBUGGING

	const showDebugMessagesInConsole = false;
	export let showDebugLoadingState = false;

	// DEVICE

	let devicePixelRatio;

	// CONTAINER

	// element references used for measurements
	let containerRef; // used for determining container aspect ratio
	let imageRef; // used for determining image aspect ratio

	// these values could change many times or be invalid numbers
	// as the page loads, layout adjusts, or the page loads
	let lastKnownContainerWidth;
	let lastKnownContainerHeight;
	let lastKnownContainerAspectRatio;
	let lastKnownPreferredContainerHeight;
	let lastKnownCloudinaryTransformationValue;

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

	// load states
	let isImageLoaded = false;
	let isPlaceholderLoaded = false;

	// FIT TYPES

	const fitTypeMaxHeightDefault = 'MAXHEIGHT (DEFAULT)';
	const fitTypeMaxHeight = 'MAXHEIGHT';
	const fitTypeAuto = 'AUTO';
	const fitTypeCalculatedAuto = 'CALCAUTOHEIGHT';

	// INTERSECTION OBSERVER

	let isVisible = false;

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

	// FUNCTIONS

	const onImageClick = (event) => {
		if (stopEventPropagation) {
			event.stopPropagation();
		}
	};

	// image zoom vars
	const scaleDelta = 0.05;
	const maxScale = 3.0;
	let scale = 1.0;
	let initialDistance = 0;
	let originX = 0;
	let originY = 0;

	// image zoom functions
	// only applicable if doScaleOnZoom is true
	const handleWheel = (event) => {
		if (doScaleOnScrollOrZoom) {
			const targetElement = scaleContext === 'container' ? containerRef : imageRef;
			const rect = targetElement.getBoundingClientRect();

			const cursorX = ((event.clientX - rect.left) / rect.width) * 100;
			const cursorY = ((event.clientY - rect.top) / rect.height) * 100;

			targetElement.style.transformOrigin = `${cursorX}% ${cursorY}%`;

			if (event.deltaY < 0) {
				scale = Math.min(scale + scaleDelta, maxScale); // scale up
			} else {
				scale = Math.max(scale - scaleDelta, 1.0); // scale down, min 1.0
			}

			targetElement.style.transform = `scale(${scale})`;
		}
	};

	const handleTouchStart = (event) => {
		if (doScaleOnScrollOrZoom) {
			if (event.touches.length === 2) {
				initialDistance = getDistance(event.touches);
			}
		}
	};
	const handleTouchMove = (event) => {
		if (doScaleOnScrollOrZoom) {
			if (event.touches.length === 2) {
				const targetElement = scaleContext === 'container' ? containerRef : imageRef;
				const rect = targetElement.getBoundingClientRect();
				const touch1 = event.touches[0];
				const touch2 = event.touches[1];
				originX = (((touch1.clientX + touch2.clientX) / 2 - rect.left) / rect.width) * 100;
				originY = (((touch1.clientY + touch2.clientY) / 2 - rect.top) / rect.height) * 100;

				const currentDistance = getDistance(event.touches);
				const scaleChange = currentDistance / initialDistance;
				scale = Math.min(Math.max(scale * scaleChange, 1.0), 2.0);
				initialDistance = currentDistance;

				targetElement.style.transformOrigin = `${originX}% ${originY}%`;
				targetElement.style.transform = `scale(${scale})`;
			}
		}
	};
	const getDistance = (touches) => {
		const [touch1, touch2] = touches;
		const dx = touch2.clientX - touch1.clientX;
		const dy = touch2.clientY - touch1.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};

	// get a pixel value from whatever is passed into the maxHeight prop
	const getMaxHeightPxFromProp = () => {
		let maxHeightPx;
		// only calculate maxHeight if prop is not auto
		if (maxHeight !== 'auto') {
			maxHeightPx = getPixelValueFromString(maxHeight);
		} else {
			maxHeightPx = getMaxElementHeightPx(containerRef);
		}
		return maxHeightPx;
	};

	// get a pixel value from whatever is passed into the maxHeight prop
	const getMaxWidthFromProp = () => {
		let maxWidthPx;
		// only calculate maxWidth if prop is not auto
		if (maxWidth !== 'auto') {
			maxWidthPx = getPixelValueFromString(maxWidth);
		} else {
			maxWidthPx = getMaxElementWidthPx(containerRef);
		}
		return maxWidthPx;
	};

	// calculate the aspect ratio of the image container and the image (if not already known)
	const getAspectRatios = () => {
		if (containerRef && imageRef) {
			// update the aspect ratio
			imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;

			// if requested, record aspect ratio for other components to know about
			if (recordAspectRatioInState) {
				recordImageAspectRatio(
					imageAttributes.imgSrc,
					imageRef.naturalWidth,
					imageRef.naturalHeight
				);
			}

			if (showDebugMessagesInConsole) {
				console.log('Image aspect ratio for ' + imageAttributes.imgSrc + ': ' + imageAspectRatio);
			}
			lastKnownContainerHeight = getMaxElementHeightPx(containerRef);
			lastKnownContainerWidth = getMaxElementWidthPx(containerRef);
			lastKnownContainerAspectRatio = lastKnownContainerWidth / lastKnownContainerHeight;
		}
	};

	// get the best container height for the image
	// could be the maxHeight prop passed in, or auto, or a calculated image height
	const getPreferredContainerHeight = () => {
		let preferredHeight = maxHeight;
		let preferredHeightFitType = fitTypeMaxHeightDefault;

		if (imageRef && validContainerAspectRatio) {
			if (showDebugMessagesInConsole) {
				console.log('Getting preferred container height for: ' + imageAttributes.imgSrc);
				console.log('Valid container height: ' + validContainerHeight);
				console.log('Max height from container: ' + getMaxElementHeightPx(containerRef));
				console.log('Max height from prop: ' + getMaxHeightPxFromProp());
				console.log('Max width from prop: ' + getMaxWidthFromProp());
				console.log('Max width from container: ' + getMaxElementWidthPx(containerRef));
			}

			// calculate the height of the image if 'auto' was set
			// this basically assumes the image's width is the full container width
			// and calculates the resulting height if image was fit into its container
			const imageCalcAutoHeight = validContainerWidth / imageAspectRatio;

			// if we're cropping to fill container,
			// or showing the blur behind, height is always maxHeight
			if (cropToFillContainer || showBlurInUnfilledSpace) {
				preferredHeight = maxHeight;
				preferredHeightFitType = fitTypeMaxHeight;
			}

			// if we're not cropping or showing blur,
			// and we're not on mobile breakpoint, height is always maxHeight
			if (
				!cropToFillContainer &&
				!showBlurInUnfilledSpace &&
				!$isMobileBreakpoint &&
				!useCompactHeightOnMobile
			) {
				preferredHeight = maxHeight;
				preferredHeightFitType = fitTypeMaxHeight;
			}

			// if we're on mobile breakpoint and useCompactHeight is true,
			// and if the the maxHeight from prop is bigger than imageCalcAutoHeight,
			// set preferred height to auto
			if (
				$isMobileBreakpoint &&
				useCompactHeightOnMobile &&
				getMaxHeightPxFromProp() > imageCalcAutoHeight
			) {
				preferredHeight = 'auto';
				preferredHeightFitType = fitTypeAuto;
			}

			// for a case like ImageDetailoverlay where width is set to 100%
			if (!cropToFillContainer && maxWidth === '100%') {
				preferredHeight = `${imageCalcAutoHeight.toString()}px`;
				preferredHeightFitType = fitTypeCalculatedAuto;
			}

			if (showDebugMessagesInConsole) {
				console.log('Choosing ' + preferredHeightFitType + ' for image: ' + imageAttributes.imgSrc);
			}
		}
		lastKnownPreferredContainerHeight = preferredHeightFitType;
		return { value: preferredHeight, type: preferredHeightFitType };
	};

	const getPreferredContainerWidth = () => {
		let preferredContainerWidth;

		// if we're showing blur
		// width is always 100%
		if (showBlurInUnfilledSpace) {
			preferredContainerWidth = '100%';
		}
		// if we're not cropping to fill or showing blur,
		// width is always max-content to ensure image container doesn't extend beyond image
		else if (
			!cropToFillContainer &&
			!cropToFillContainer &&
			parseInt(getMaxHeightPxFromProp()) * imageAspectRatio <
				parseInt(getMaxElementWidthPx(containerRef))
		) {
			preferredContainerWidth = 'max-content';
		}
		// default is to use the provided max width or auto if not provided
		else {
			preferredContainerWidth = maxWidth ?? 'auto';
		}

		return preferredContainerWidth;
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
		object-position: ${cropToFillContainer ? objectPosition : ''};
		transition: ${isForImageDetailOverlay ? '' : ' transform 0.3s ease-in-out'};

		/* if max height is not specified, use all available space below the header */
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightSm} - ${
						$doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightMd}  - ${
						$doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightLg} - ${
						$doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0
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
		devicePixelRatio = window.devicePixelRatio || 1;

		// set up an observer to set the isVisible flag
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			// distance from screen edges
			// that the element should be considered visible
			{ rootMargin: `0px 0px ${bottomVisibilityOffset} 0px` }
		);

		observer.observe(containerRef);
	});

	// REACTIVE BLOCKS

	// set valid values just once, if not already defined
	$: {
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

			// if this image is used in the context of ImageDetailOverlay,
			// need to record the width of the image so the caption/attribution width can match
			// (required workaround for some reason)
			if (isForImageDetailOverlay) {
				const widthToSet = imageAttributes.allowBackgroundBlur
					? validContainerWidth
					: getMaxHeightPxFromProp() * imageAspectRatio;
				imageDetailWidth.set(widthToSet);
			}
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
		maxHeight;
		if (validContainerAspectRatio) {
			imageContainerCssDynamic = css`
				height: ${getPreferredContainerHeight().value};
				width: ${getPreferredContainerWidth()};
			`;
		}
	}

	// update cloudinary URLs
	$: {
		if (containerRef && isVisible) {
			if (!lastKnownCloudinaryTransformationValue) {
				lastKnownPreferredContainerHeight = getPreferredContainerHeight().type;
			}
			// get dimensions
			const style = getComputedStyle(containerRef);
			const containerHeight = style.getPropertyValue('height');
			const containerWidth = style.getPropertyValue('width');
			const imageAutoHeight = validContainerWidth / imageAspectRatio;
			if (
				isImageLoaded &&
				isUrlCloudinary(imageAttributes.imgSrc) &&
				!imageAttributes.imgSrc.includes('.gif') &&
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
					lastKnownPreferredContainerHeight === fitTypeMaxHeight ||
					lastKnownPreferredContainerHeight === fitTypeMaxHeightDefault
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
					lastKnownPreferredContainerHeight === fitTypeCalculatedAuto ||
					lastKnownPreferredContainerHeight === fitTypeAuto
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
			validContainerAspectRatio = undefined;
			validContainerHeight = undefined;
			validContainerWidth = undefined;
			lastKnownContainerHeight = undefined;
			lastKnownContainerWidth = undefined;
			lastKnownCloudinaryTransformationValue = undefined;
			getAspectRatios();
		}
	}
</script>

<div
	transition:transition={{ duration: jdgDurations.fadeIn }}
	bind:this={containerRef}
	on:scroll={handleWheel}
	on:wheel={handleWheel}
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	class="jdg-image-container {imageContainerCssDynamic}"
>
	<!-- need to set an on:click to ignore clicks in some cases -->
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
			? (isImageLoaded || isPlaceholderLoaded) && isVisible
				? adjustedImgSrc
				: imagePlaceholder
			: adjustedImgSrc}
		alt={imageAttributes.imgAlt}
	/>
	<!-- only show blurred image behind if showBlurInUnfilledSpace is true -->
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
		z-index: 2;
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
