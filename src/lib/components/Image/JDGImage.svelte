<script>
	import { onDestroy, onMount, getContext } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';
	import { get } from 'svelte/store';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import jdgImageMeta from '$lib/schemas/jdg-image-meta.js';
	import {
		addCloudinaryUrlTransformation,
		convertVhToPixels,
		doesStringContainVh,
		getMaxElementHeightPx,
		getMaxElementWidthPx,
		getMaxHeightPxFromProp,
		getMaxWidthPxFromProp,
		isNumberValid
	} from '$lib/jdg-utils.js';
	import {
		imageViewerScale,
		imageViewerWidth,
		isAdminMode,
		isMobileBreakpoint,
		showImageEditButtons,
		showImageMetaModal,
		showHeaderStripes,
		windowWidth
	} from '$lib/stores/jdg-ui-store.js';
	import {
		addImageLoading,
		recordImageAspectRatio,
		removeImageLoading
	} from '$lib/jdg-state-management.js';

	import {
		addCloudinaryUrlHeight,
		addCloudinaryUrlWidth,
		isUrlCloudinary,
		instantiateObject,
		upgradeImageMeta
	} from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgDurations, jdgSizes } from '$lib/jdg-shared-styles.js';
	import {
		JDGButton,
		JDGImageCaptionAttribution,
		JDGImageToolbar,
		JDGLoadingSpinner
	} from '$lib/index.js';

	// show a local image while image is loading
	import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';
	import {
		draftImageMeta,
		draftTimelineImageMetaRegistry,
		draftTimelineImageRegistryRepo
	} from '$lib/stores/jdg-temp-store.js';

	// Check if we're inside a Timeline context (for image editing)
	// These will be undefined if not inside a Timeline
	const timelineRegistryContext = getContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY);
	const timelineRegistryRepoContext = getContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY_REPO);

	// EXPORTS

	export let imageMeta = instantiateObject(jdgImageMeta); // one object for all image data

	// Upgrade imageMeta when it changes to ensure all fields have default values
	// and schema version is up to date. This ensures any consumer of JDGImage
	// automatically gets upgraded imageMetas.
	$: imageMeta = upgradeImageMeta(imageMeta);
	export let maxHeight = '350px'; // image will never exceed this height, but could be less depending on other props
	export let maxWidth = 'auto'; // if not defined, takes available space
	export let useAutoHeightOnMobile = true; // if true, sets height to 'auto' on smallest breakpoint for no cropping if calculatedAutoHeight is less than maxHeightPxFromProp (ignores cropToFitContainer)
	export let cropToFillContainer = true; // if true, image may be cropped to fill its container in both directions
	export let objectPosition = 'center'; // only applies when cropToFillContainer is true
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
	export let scaleContext = 'container'; // which element to scale. "container" or "image"
	export let bottomVisibilityOffset = '1000px'; // distance from bottom of screen before loading (positive is down)
	export let recordAspectRatioInState = false;

	// DEBUGGING

	const showDebugMessagesInConsole = false; // also shows any image loading errors and skips any fallbacks
	export let showDebugOverlay = false;
	export let showDebugLoadingState = false; // force loading state

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
	let lastKnownPreferredContainerWidth;
	let lastKnownCloudinaryTransformationValue;

	// these values have been validated - they're defined, non-zero, and not NaN
	// they're also not rewritten if valid, unless forced
	let validContainerWidth;
	let validContainerHeight;
	let validContainerAspectRatio;

	// IMAGE

	// set an initial, low-quality Cloudinary transform for performance
	// this will be replaced with a higher-quality request with a specific width or height
	// this will also be ignored if the src is not a Cloudinary URL
	const initialCloudinaryTransform = 'f_auto,q_1';
	// Initialize adjustedImgSrc reactively when imageMeta changes
	// Other reactive blocks will modify this value for optimized transforms
	let adjustedImgSrc;
	$: {
		adjustedImgSrc = addCloudinaryUrlTransformation(imageMeta.src, initialCloudinaryTransform);
	}
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

	// for the case where the src is not provided,
	// consider the image immediately loaded
	$: if (imageMeta.src === imagePlaceholder && !showDebugLoadingState) {
		isImageLoaded = true;
	}

	// if imageMeta specifies no blur, override showBlur to false
	$: if (!imageMeta.showBackgroundBlur) {
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
	const panDelta = 2.0; // pixels to pan per gesture
	let scale = 1.0;
	let translateX = 0; // current translation in pixels
	let translateY = 0;
	let initialDistance = 0;
	let baseScaleOnPinchStart = 1.0; // Track scale at the start of pinch gesture
	let baseTranslateXOnPinchStart = 0; // Track translation at start of pinch
	let baseTranslateYOnPinchStart = 0;
	let lastPinchCenterX = 0; // Track pinch center for panning
	let lastPinchCenterY = 0;
	let animationFrameId = null;
	let pendingScale = null;
	let pendingTranslateX = null;
	let pendingTranslateY = null;
	let pendingOriginX = null;
	let pendingOriginY = null;
	let isZooming = false;
	let wheelEndTimeout = null;

	// Smooth update function using requestAnimationFrame
	const applyTransform = () => {
		if (pendingScale !== null || pendingTranslateX !== null || pendingTranslateY !== null || pendingOriginX !== null || pendingOriginY !== null) {
			const targetElement = scaleContext === 'container' ? containerRef : imageRef;
			
			// Update transform origin first (needed for zoom-into-point)
			if (pendingOriginX !== null && pendingOriginY !== null) {
				targetElement.style.transformOrigin = `${pendingOriginX}% ${pendingOriginY}%`;
				pendingOriginX = null;
				pendingOriginY = null;
			}
			
			if (pendingScale !== null) {
				scale = pendingScale;
				pendingScale = null;
			}
			
			if (pendingTranslateX !== null) {
				translateX = pendingTranslateX;
				pendingTranslateX = null;
			}
			
			if (pendingTranslateY !== null) {
				translateY = pendingTranslateY;
				pendingTranslateY = null;
			}
			
			// Apply both scale and translate together
			targetElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
			imageViewerScale.set(scale);
			
			animationFrameId = null;
		}
	};

	const scheduleTransform = (newScale, newTranslateX, newTranslateY, newOriginX, newOriginY) => {
		if (newScale !== null) pendingScale = newScale;
		if (newTranslateX !== null) pendingTranslateX = newTranslateX;
		if (newTranslateY !== null) pendingTranslateY = newTranslateY;
		if (newOriginX !== null) pendingOriginX = newOriginX;
		if (newOriginY !== null) pendingOriginY = newOriginY;
		
		if (animationFrameId === null) {
			animationFrameId = requestAnimationFrame(applyTransform);
		}
	};

	// image zoom functions
	// only applicable if doScaleOnZoom is true
	const handleWheel = (event) => {
		if (doScaleOnScrollOrZoom) {
			event.preventDefault();
			const targetElement = scaleContext === 'container' ? containerRef : imageRef;
			const rect = targetElement.getBoundingClientRect();

			// Calculate cursor position as percentage for transform-origin
			const cursorXPercent = ((event.clientX - rect.left) / rect.width) * 100;
			const cursorYPercent = ((event.clientY - rect.top) / rect.height) * 100;

			let newScale = scale;
			let newTranslateX = translateX;
			let newTranslateY = translateY;
			let newOriginX = cursorXPercent;
			let newOriginY = cursorYPercent;
			const isZoomingIn = event.deltaY < 0;
			
			if (isZoomingIn) {
				// Trying to zoom in
				if (scale < maxScale) {
					// Can still zoom - zoom into cursor position
					newScale = Math.min(scale + scaleDelta, maxScale);
					// Transform origin is set to cursor, so zoom will happen from there
					// Reset translate when zooming (transform-origin handles the zoom-into-point)
					newTranslateX = 0;
					newTranslateY = 0;
				} else {
					// At max zoom - pan towards cursor
					const centerX = rect.width / 2;
					const centerY = rect.height / 2;
					const cursorX = event.clientX - rect.left;
					const cursorY = event.clientY - rect.top;
					const deltaX = cursorX - centerX;
					const deltaY = cursorY - centerY;
					const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					const normalizedX = distance > 0 ? deltaX / distance : 0;
					const normalizedY = distance > 0 ? deltaY / distance : 0;
					const panAmount = panDelta * (distance / Math.max(rect.width, rect.height));
					newTranslateX = translateX + normalizedX * panAmount;
					newTranslateY = translateY + normalizedY * panAmount;
					// Keep origin at center when panning
					newOriginX = 50;
					newOriginY = 50;
				}
			} else {
				// Zooming out
				if (scale > 1.0) {
					newScale = Math.max(scale - scaleDelta, 1.0);
					// Reset translate when zooming out
					newTranslateX = 0;
					newTranslateY = 0;
					// Keep origin at cursor for zoom out
				} else {
					// At base scale - reset everything
					newScale = 1.0;
					newTranslateX = 0;
					newTranslateY = 0;
					newOriginX = 50;
					newOriginY = 50;
				}
			}

			// Always update origin when zooming (not panning), otherwise only if scale/translate changed
			const shouldUpdateOrigin = (isZoomingIn && scale < maxScale) || (!isZoomingIn && scale > 1.0);
			if (newScale !== scale || newTranslateX !== translateX || newTranslateY !== translateY || shouldUpdateOrigin) {
				isZooming = true;
				scheduleTransform(
					newScale !== scale ? newScale : null,
					newTranslateX !== translateX ? newTranslateX : null,
					newTranslateY !== translateY ? newTranslateY : null,
					shouldUpdateOrigin ? newOriginX : null,
					shouldUpdateOrigin ? newOriginY : null
				);
			}

			// Reset wheel end timeout
			if (wheelEndTimeout !== null) {
				clearTimeout(wheelEndTimeout);
			}
			wheelEndTimeout = setTimeout(() => {
				isZooming = false;
				wheelEndTimeout = null;
			}, 150);
		}
	};

	const handleTouchStart = (event) => {
		if (doScaleOnScrollOrZoom) {
			if (event.touches.length === 2) {
				event.preventDefault();
				const targetElement = scaleContext === 'container' ? containerRef : imageRef;
				const rect = targetElement.getBoundingClientRect();
				const touch1 = event.touches[0];
				const touch2 = event.touches[1];
				
				initialDistance = getDistance(event.touches);
				// Store the current scale and translation at the start of pinch gesture
				baseScaleOnPinchStart = pendingScale !== null ? pendingScale : scale;
				baseTranslateXOnPinchStart = pendingTranslateX !== null ? pendingTranslateX : translateX;
				baseTranslateYOnPinchStart = pendingTranslateY !== null ? pendingTranslateY : translateY;
				
				// Calculate pinch center in pixels relative to element
				const pinchCenterX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
				const pinchCenterY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
				lastPinchCenterX = pinchCenterX;
				lastPinchCenterY = pinchCenterY;
			}
		}
	};
	
	const handleTouchMove = (event) => {
		if (doScaleOnScrollOrZoom) {
			if (event.touches.length === 2) {
				event.preventDefault();
				const targetElement = scaleContext === 'container' ? containerRef : imageRef;
				const rect = targetElement.getBoundingClientRect();
				const touch1 = event.touches[0];
				const touch2 = event.touches[1];
				
				const currentDistance = getDistance(event.touches);
				const scaleChange = currentDistance / initialDistance;
				
				// Calculate new pinch center as percentage for transform-origin
				const pinchCenterX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
				const pinchCenterY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
				const pinchCenterXPercent = (pinchCenterX / rect.width) * 100;
				const pinchCenterYPercent = (pinchCenterY / rect.height) * 100;
				
				// Calculate direction vector from previous center to current center (for panning)
				const centerDeltaX = pinchCenterX - lastPinchCenterX;
				const centerDeltaY = pinchCenterY - lastPinchCenterY;
				
				// Calculate desired scale
				const desiredScale = baseScaleOnPinchStart * scaleChange;
				const isZoomingIn = scaleChange > 1.0;
				
				let newScale = scale;
				let newTranslateX = translateX;
				let newTranslateY = translateY;
				let newOriginX = pinchCenterXPercent;
				let newOriginY = pinchCenterYPercent;
				
				if (isZoomingIn) {
					// Trying to zoom in
					if (desiredScale <= maxScale) {
						// Can still zoom - zoom into pinch center using transform-origin
						newScale = Math.min(desiredScale, maxScale);
						// Reset translate when zooming (transform-origin handles the zoom-into-point)
						newTranslateX = 0;
						newTranslateY = 0;
					} else {
						// At max zoom - pan in same direction as pinch center movement
						newScale = maxScale;
						// Pan in the same direction as the gesture
						newTranslateX = baseTranslateXOnPinchStart + centerDeltaX;
						newTranslateY = baseTranslateYOnPinchStart + centerDeltaY;
						// Keep origin at center when panning
						newOriginX = 50;
						newOriginY = 50;
					}
				} else {
					// Zooming out
					if (desiredScale >= 1.0) {
						newScale = Math.max(desiredScale, 1.0);
						// Reset translate when zooming out
						newTranslateX = 0;
						newTranslateY = 0;
						// Keep origin at pinch center for zoom out
					} else {
						// At base scale - reset everything
						newScale = 1.0;
						newTranslateX = 0;
						newTranslateY = 0;
						newOriginX = 50;
						newOriginY = 50;
					}
				}
				
				// Update last pinch center
				lastPinchCenterX = pinchCenterX;
				lastPinchCenterY = pinchCenterY;
				
				// Always update origin when zooming (not panning), otherwise only if scale/translate changed
				const shouldUpdateOrigin = (isZoomingIn && desiredScale <= maxScale) || (!isZoomingIn && desiredScale >= 1.0);
				if (newScale !== scale || newTranslateX !== translateX || newTranslateY !== translateY || shouldUpdateOrigin) {
					scheduleTransform(
						newScale !== scale ? newScale : null,
						newTranslateX !== translateX ? newTranslateX : null,
						newTranslateY !== translateY ? newTranslateY : null,
						shouldUpdateOrigin ? newOriginX : null,
						shouldUpdateOrigin ? newOriginY : null
					);
				}
			}
		}
	};
	
	const handleTouchEnd = () => {
		// Reset initial distance when pinch ends
		initialDistance = 0;
		baseScaleOnPinchStart = 1.0;
		baseTranslateXOnPinchStart = 0;
		baseTranslateYOnPinchStart = 0;
	};
	
	const getDistance = (touches) => {
		const [touch1, touch2] = touches;
		const dx = touch2.clientX - touch1.clientX;
		const dy = touch2.clientY - touch1.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};

	// calculate the aspect ratio of the image container and the image (if not already known)
	const getAndRecordAspectRatio = () => {
		if (containerRef && imageRef) {
			// update the aspect ratio if it hasn't changed considerably since last time
			const newImageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
			if (
				!isFinite(imageAspectRatio) ||
				Math.abs(newImageAspectRatio - imageAspectRatio) > jdgSizes.imageAspectRatioUpdateThreshold
			) {
				imageAspectRatio = imageRef.naturalWidth / imageRef.naturalHeight;
				if (showDebugMessagesInConsole) {
					console.log('Updating image aspect ratio:', imageAspectRatio);
				}
			}

			// if requested, record aspect ratio for other components to know about
			if (recordAspectRatioInState) {
				recordImageAspectRatio(imageMeta.src, imageRef.naturalWidth, imageRef.naturalHeight);
			}

			if (showDebugMessagesInConsole) {
				console.log('Image aspect ratio for ' + imageMeta.src + ': ' + imageAspectRatio);
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
			// calculate the height of the image if 'auto' was set
			// this basically assumes the image's width is the full container width
			// and calculates the resulting height if image was fit into its container
			const imageCalcAutoHeight = Math.round(validContainerWidth / imageAspectRatio);

			if (showDebugMessagesInConsole) {
				console.log(
					'Getting information to determine resizing for:',
					imageMeta.src,
					'\nmaxHeight string from prop:',
					maxHeight,
					'\nMax height px from prop:',
					getMaxHeightPxFromProp(maxHeight, containerRef),
					'\nValid container height:',
					validContainerHeight,
					'\nMax height from container:',
					getMaxElementHeightPx(containerRef),
					'\nMax width string from prop',
					maxWidth,
					'\nMax width px from prop:',
					getMaxWidthPxFromProp(maxWidth, containerRef),
					'\nValid container width',
					validContainerWidth,
					'\nMax width from container:',
					getMaxElementWidthPx(containerRef),
					'\nimageCalcAutoHeight:',
					imageCalcAutoHeight,
					'\nUsing auto height?',
					useAutoHeightOnMobile
				);
			}

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
				!useAutoHeightOnMobile
			) {
				preferredHeight = maxHeight;
				preferredHeightFitType = fitTypeMaxHeight;
			}

			// if we're on mobile breakpoint and useCompactHeight is true,
			// and if the the maxHeight from prop is bigger than imageCalcAutoHeight,
			// set preferred height to auto
			if (
				$isMobileBreakpoint &&
				useAutoHeightOnMobile &&
				getMaxHeightPxFromProp(maxHeight, containerRef) > imageCalcAutoHeight
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
				console.log(
					'getPreferredContainerHeight: Choosing ' +
						preferredHeightFitType +
						' for image: ' +
						imageMeta.src
				);
			}
		}
		// if the preferred height is in vh, convert it to pixels
		preferredHeight = doesStringContainVh(preferredHeight)
			? convertVhToPixels(preferredHeight) + 'px'
			: preferredHeight;
		lastKnownPreferredContainerHeight = preferredHeightFitType;
		return { value: preferredHeight, type: preferredHeightFitType };
	};

	const getPreferredContainerWidth = () => {
		let preferredContainerWidth;
		const imageWidthPxAtMaxHeightFromProp =
			getMaxHeightPxFromProp(maxHeight, containerRef) * imageAspectRatio;

		// if maxWidth is 'auto', we may need to choose the best width depending on the scenario
		if (maxWidth === 'auto') {
			// if we're showing blur
			// or if the image width would exceed the container at the given max height,
			// use 100%
			if (showBlurInUnfilledSpace || imageWidthPxAtMaxHeightFromProp >= validContainerWidth) {
				preferredContainerWidth = '100%';
			}
			// if we're not cropping to fill and the image width at the max height is less than the container width
			// use the image's calculated width to ensure image container doesn't extend beyond image
			else if (!cropToFillContainer && imageWidthPxAtMaxHeightFromProp < validContainerWidth) {
				preferredContainerWidth = `${imageWidthPxAtMaxHeightFromProp}px`;
			}
		}
		// otherwise, default is to use the provided max width or auto if not provided
		else {
			preferredContainerWidth = maxWidth ?? 'auto';
		}

		if (showDebugMessagesInConsole) {
			console.log(
				'getPreferredContainerWidth: Choosing ' +
					preferredContainerWidth +
					' for image: ' +
					imageMeta.src
			);
		}

		lastKnownPreferredContainerWidth = preferredContainerWidth;
		return preferredContainerWidth;
	};

	// runs after an image is loaded
	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		getAndRecordAspectRatio();
		if (!showDebugLoadingState) {
			isImageLoaded = true;
		}
		removeImageLoading(imageMeta.src);
	};

	// runs if an image fails to load
	let showImageError = false;
	let imageErrorMessage = 'Error loading image: ';
	const onImageError = () => {
		// cloudinary transform may have failed
		// try falling back to the original src if so
		if (
			isUrlCloudinary(imageMeta.src) &&
			adjustedImgSrc !== imageMeta.src &&
			!showDebugMessagesInConsole // only fall back if debug mode is off
		) {
			// fall back to the non-transformed (less optimized) src and post a warning
			adjustedImgSrc = imageMeta.src;
			console.warn(
				'Cloudinary transform may have failed, falling back to non-transformed URL: ' +
					imageMeta.src
			);
		} else {
			showImageError = true;
			imageErrorMessage += adjustedImgSrc;
			isImageLoaded = true;
		}
	};

	// runs after the placeholder image is loaded
	const onPlaceholderLoad = () => {
		isPlaceholderLoaded = true;
	};

	// EMOTION STYLES

	const imageCssStatic = css`
		width: ${stopEventPropagation ? '' : '100%'};
		object-fit: ${cropToFillContainer || (useAutoHeightOnMobile && $isMobileBreakpoint)
			? 'cover'
			: 'contain'};
		object-position: ${cropToFillContainer ? objectPosition : ''};
		transition: ${isForImageDetailOverlay ? '' : ' transform 0.3s ease-in-out'};

		/* if max height is not specified, use all available space below the header */
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightSm} - ${
						$showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightMd}  - ${
						$showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0
					}px)`
				: ''};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: ${maxHeight === 'auto'
				? `calc(100vh - ${jdgSizes.headerHeightLg} - ${
						$showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0
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

	// DEVICE

	let devicePixelRatio;
	const useDevicePixelRatio = true;

	// LIFECYCLE

	onMount(() => {
		devicePixelRatio = window.devicePixelRatio || 1;

		// set up event listeners
		// we're not using Svelte directives here because the event listeners are conditional
		if (doScaleOnScrollOrZoom) {
			// Initialize transform origin to center and set initial transform
			const targetElement = scaleContext === 'container' ? containerRef : imageRef;
			targetElement.style.transformOrigin = '50% 50%';
			targetElement.style.transform = `translate(0px, 0px) scale(1.0)`;
			
			containerRef.addEventListener('wheel', handleWheel, { passive: false });
			containerRef.addEventListener('touchstart', handleTouchStart, { passive: false });
			containerRef.addEventListener('touchmove', handleTouchMove, { passive: false });
			containerRef.addEventListener('touchend', handleTouchEnd, { passive: true });
			containerRef.addEventListener('touchcancel', handleTouchEnd, { passive: true });
		}

		// set up an observer to set the isVisible flag
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						if (!imageMeta?.src?.includes('placeholder')) {
							addImageLoading(imageMeta.src);
						}
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

	onDestroy(() => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
		}
		if (wheelEndTimeout !== null) {
			clearTimeout(wheelEndTimeout);
		}
		if (doScaleOnScrollOrZoom && containerRef) {
			containerRef.removeEventListener('wheel', handleWheel);
			containerRef.removeEventListener('touchstart', handleTouchStart);
			containerRef.removeEventListener('touchmove', handleTouchMove);
			containerRef.removeEventListener('touchend', handleTouchEnd);
			containerRef.removeEventListener('touchcancel', handleTouchEnd);
		}
	});

	// REACTIVE BLOCKS

	// set valid values just once, if not already defined
	$: {
		if (isNumberValid(lastKnownContainerAspectRatio) && !isNumberValid(validContainerAspectRatio)) {
			validContainerAspectRatio = lastKnownContainerAspectRatio;
			if (showDebugMessagesInConsole) {
				console.log(
					'SETTING VALID CONTAINER ASPECT RATIO: ',
					imageMeta.src,
					validContainerAspectRatio
				);
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
				const widthToSet = imageMeta.showBackgroundBlur
					? validContainerWidth
					: getMaxHeightPxFromProp(maxHeight, containerRef) * imageAspectRatio;
				imageViewerWidth.set(widthToSet);
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
		width: ${maxWidth};
	`;
	$: {
		lastKnownContainerWidth, imageAspectRatio, maxHeight;
		if (validContainerAspectRatio) {
			imageContainerCssDynamic = css`
				height: ${getPreferredContainerHeight().value};
				width: ${getPreferredContainerWidth()};
			`;
		}
	}

	// update Cloudinary URLs
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
				isUrlCloudinary(imageMeta.src) &&
				!imageMeta.src.includes('.gif') &&
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
						// specify Cloudinary URL width
						if (imageAutoHeight >= parseInt(containerHeight)) {
							const adjustedWidth = Math.ceil(
								parseInt(containerWidth) * (useDevicePixelRatio ? devicePixelRatio : 1)
							);
							adjustedImgSrc = addCloudinaryUrlWidth(imageMeta.src, adjustedWidth);
							if (showDebugMessagesInConsole) {
								console.log(
									'Specifying width in Cloudinary URL. Adjusted Cloudinary URL:',
									adjustedImgSrc,
									adjustedWidth
								);
							}
							lastKnownCloudinaryTransformationValue = adjustedWidth;
						}
						// otherwise, specify Cloudinary URL height
						else {
							const adjustedHeight = Math.ceil(
								getMaxHeightPxFromProp(maxHeight, containerRef) *
									(useDevicePixelRatio ? devicePixelRatio : 1)
							);
							adjustedImgSrc = addCloudinaryUrlHeight(imageMeta.src, adjustedHeight);
							if (showDebugMessagesInConsole) {
								console.log(
									'Specifying height in Cloudinary URL. Adjusted Cloudinary URL:',
									adjustedImgSrc,
									adjustedHeight
								);
							}
							lastKnownCloudinaryTransformationValue = adjustedHeight;
						}
					}
					// no fill container
					else {
						const adjustedHeight = Math.ceil(
							getMaxHeightPxFromProp(maxHeight, containerRef) *
								(useDevicePixelRatio ? devicePixelRatio : 1)
						);
						adjustedImgSrc = addCloudinaryUrlHeight(imageMeta.src, adjustedHeight);
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
					// simply fill the container height in this case
					const adjustedHeight = Math.ceil(
						parseInt(containerHeight) * (useDevicePixelRatio ? devicePixelRatio : 1)
					);
					adjustedImgSrc = addCloudinaryUrlHeight(imageMeta.src, adjustedHeight);
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
			getAndRecordAspectRatio();
		}
	}
</script>

<div
	transition:transition={{ duration: jdgDurations.fadeIn }}
	bind:this={containerRef}
	class="jdg-image-container {imageContainerCssDynamic}"
>
	<!-- Only load the image if it's visible -->
	{#if isVisible}
		<!-- Show the toolbar if in adminMode -->
		{#if $isAdminMode && $showImageEditButtons}
			<JDGImageToolbar {imageMeta} toolbarAligment="top">
				<JDGButton
					onClickFunction={() => {
						draftImageMeta.set(imageMeta);
						// If inside a Timeline context, set the draft stores so the modal
						// (which is outside the context tree) can use the timeline's registry
						if (timelineRegistryContext && timelineRegistryRepoContext) {
							const registry = get(timelineRegistryContext);
							const repoName = get(timelineRegistryRepoContext);
							if (registry && repoName) {
								draftTimelineImageMetaRegistry.set(registry);
								draftTimelineImageRegistryRepo.set(repoName);
							}
						}
						showImageMetaModal.set(true);
					}}
					faIcon="fa-solid fa-pencil"
					label={null}
					paddingLeftRight={'8px'}
					paddingTopBottom={'8px'}
					backgroundColor={jdgColors.activeSecondary}
					tooltip="Edit image meta"
					doForceSquareAspect
				/>
			</JDGImageToolbar>
		{/if}
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
			alt={imageMeta.alt}
		/>
		<!-- only show blurred image behind if showBlurInUnfilledSpace is true -->
		<!-- if blurred image is shown, it'll use the initial Cloudinary transform (low-quality) -->
		{#if showBlurInUnfilledSpace && !cropToFillContainer}
			<div
				class="image-blur {imageBlurCss}"
				style={`background-image: url(${addCloudinaryUrlTransformation(
					imageMeta.src,
					initialCloudinaryTransform
				)}); opacity: ${isImageLoaded ? 1 : 0.25}; transition: opacity ${jdgDurations.fadeIn}${
					jdgDurations.unit
				} ease-in-out;`}
			></div>
			<div class="image-blur-background"></div>
		{/if}
		<!-- caption and attribution -->
		{#if (showCaption && imageMeta.caption) || (showAttribution && imageMeta.attribution)}
			<div class="caption-attribution-wrapper {captionAttributionWrapperCssDynamic}">
				<JDGImageCaptionAttribution {imageMeta} {showCaption} {showAttribution} />
			</div>
		{/if}
		<!-- show the spinner during loading if requested -->
		{#if !isImageLoaded && showLoadingSpinner && isVisible}
			<div class="image-loading-spinner-container {imageLoadingSpinnerContainerCss}">
				<JDGLoadingSpinner />
			</div>
		{/if}
		<!-- show the image placeholder during loading if requested -->
		{#if !isImageLoaded && showPlaceholderImage && isVisible}
			<div class="image-loading-overlay {imageLoadingOverlayCss}" />
		{/if}
		{#if showImageError}
			<div class="image-error-overlay">
				{imageErrorMessage}
			</div>
		{/if}
		{#if showDebugOverlay}
			<div class="debug-overlay">
				Calculated image width: {getMaxHeightPxFromProp(maxHeight, containerRef) *
					imageAspectRatio};
				<br />
				Valid container width: {validContainerWidth};
				<br />
				Preferred container width: {lastKnownPreferredContainerWidth};
				<br />
				Preferred container height: {lastKnownPreferredContainerHeight};
				<br />
				Adjusted URL: {adjustedImgSrc}
			</div>
		{/if}
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
		box-sizing: border-box;
		padding: 20px;
	}

	.caption-attribution-wrapper {
		position: absolute;
		width: 100%;
		z-index: 2;
	}

	.debug-overlay {
		background-color: rgba(255, 255, 255, 0.5);
		font-size: 8px;
		position: absolute;
	}
</style>
