<script>
	import { onMount, onDestroy } from 'svelte';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';
	import { convertVhToPixels } from '$lib/jdg-utils.js';

	export let maxHeight = '300px'; // image will never exceed this height, but could be less depending on cropToFit
	export let cropToFit = true; // if true, image may be cropped to fill its container
	export let showHoverEffect = false; // consumers can offer this and additional zoom effects
	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg';
	export let imgAlt = 'Image Tile';

	let containerRef;
	let containerAspectRatio;
	let imageRef;
	let imageAspectRatio;

	// height can be in vh or px
	// if in vh, convert to pixels for calculations
	let [maxHeightValue, maxHeightUnit] = maxHeight.match(/^(\d+)(\D+)$/).slice(1);
	let maxHeightPx;
	const maxHeightParsed = parseFloat(maxHeightValue);
	// get the max height in px for calculations
	if (maxHeightUnit === 'vh') {
		maxHeightPx = convertVhToPixels(maxHeightParsed);
	} else if (maxHeightUnit === 'px') {
		maxHeightPx = maxHeightParsed;
	}

	// calculate the aspect ratio of the image container and the image (if not already known)
	const updateAspectRatios = () => {
		if (containerRef && imageRef) {
			containerAspectRatio = containerRef.clientWidth / maxHeightPx;
			imageAspectRatio = imageAspectRatio ?? imageRef.naturalWidth / imageRef.naturalHeight;
			console.log(imgSrc, cropToFit, imageAspectRatio, containerAspectRatio);
		}
	};

	const getPreferredContainerHeight = (imageAspectRatio, containerAspectRatio) => {
		if (containerRef && imageRef) {
			// if we're cropping, height is always the max height
			if (cropToFit) {
				return maxHeight;
			}
			// else, need to determine crop based on aspect ratios
			switch (true) {
				// image is wider than container
				case imageAspectRatio > containerAspectRatio:
					return 'auto';
				// image is taller than container
				case !cropToFit && imageAspectRatio < containerAspectRatio:
					return maxHeight;
				default:
					return maxHeight;
			}
		}
	};

	const getPreferredObjectFit = (imageAspectRatio, containerAspectRatio) => {
		if (imageRef && containerRef) {
			// if we're cropping, fit is always cover
			if (cropToFit) {
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

	const setDynamicStyles = () => {
		imageContainerCss = css`
			height: ${getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
		`;
		imageCss = css`
			object-fit: ${getPreferredObjectFit(imageAspectRatio, containerAspectRatio)};
		`;
	};

	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		updateAspectRatios();
	};

	// set dynamically depending on cropToFit
	let imageContainerCss = css`
		height: ${getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
	`;

	// set dynamically depending on cropToFit
	let imageCss = css`
		object-fit: ${getPreferredObjectFit(imageAspectRatio, containerAspectRatio)};
	`;

	// only set from the parent, once
	let imageCssStatic = css`
		:hover {
			transform: ${showHoverEffect ? 'scale(1.04);' : ''};
		}
	`;

	onMount(() => {
		if (imageRef && !cropToFit) {
			imageRef.addEventListener('load', onImageLoad);
		}
		setDynamicStyles();
	});

	onDestroy(() => {
		if (imageRef && !cropToFit) {
			imageRef.removeEventListener('load', onImageLoad);
		}
	});

	$: {
		if (!cropToFit) {
			// ensure the aspect ratios are updated when the window width changes in state
			$uiState.windowWidth;
			updateAspectRatios();
			setDynamicStyles();
		}
	}
</script>

<div bind:this={containerRef} class="jdg-image-container {imageContainerCss}">
	<img bind:this={imageRef} class={`${imageCss} ${imageCssStatic}`} src={imgSrc} alt={imgAlt} />
</div>

<style>
	img {
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease-in-out;
	}

	.jdg-image-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		transition: transform 0.3s ease-in-out;
	}
</style>
