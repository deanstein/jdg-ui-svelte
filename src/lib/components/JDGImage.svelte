<script>
	import { onMount, onDestroy } from 'svelte';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	export let nMaxHeightPx = 300; // image will never exceed this height, but could be less
	export let cropToFit = true; // if true, image may be cropped to fill its container
	export let showHoverEffect = false; // consumers can offer this and additional zoom effects
	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg';
	export let imgAlt = 'Image Tile';

	let containerRef;
	let containerAspectRatio;
	let imageRef;
	let imageAspectRatio;

	// calculate the aspect ratio of the image container and the image (if not already known)
	const updateAspectRatios = () => {
		if (containerRef && imageRef) {
			containerAspectRatio = containerRef.clientWidth / nMaxHeightPx;
			imageAspectRatio = imageAspectRatio ?? imageRef.naturalWidth / imageRef.naturalHeight;
			console.log(imageAspectRatio, containerAspectRatio);
		}
	};

	const getPreferredContainerHeight = (imageAspectRatio, containerAspectRatio) => {
		if (imageRef && containerRef) {
			switch (true) {
				// image is wider than container - crop
				case cropToFit && imageAspectRatio > containerAspectRatio:
					return nMaxHeightPx.toString() + 'px';
				// image is wider than container - no crop
				case !cropToFit && imageAspectRatio > containerAspectRatio:
					return 'auto';
				// image is taller than container - crop
				case cropToFit && imageAspectRatio < containerAspectRatio:
					return nMaxHeightPx.toString() + 'px';
				// image is taller than container - no crop
				case !cropToFit && imageAspectRatio < containerAspectRatio:
					return nMaxHeightPx.toString() + 'px';
				default:
					return nMaxHeightPx.toString() + 'px';
			}
		}
	};

	const getPreferredObjectFit = (imageAspectRatio, containerAspectRatio) => {
		if (imageRef && containerRef) {
			console.log(imageAspectRatio, containerAspectRatio);
			switch (true) {
				// image is wider than container - crop
				case cropToFit && imageAspectRatio > containerAspectRatio:
					return 'cover';
				// image is wider than container - no crop
				case !cropToFit && imageAspectRatio > containerAspectRatio:
					return 'contain';
				// image is taller than container - crop
				case cropToFit && imageAspectRatio < containerAspectRatio:
					return 'cover';
				// image is taller than container - no crop
				case !cropToFit && imageAspectRatio < containerAspectRatio:
					return 'contain';
				default:
					return 'cover';
			}
		}
	};

	const onImageLoad = () => {
		// ensure that the image aspect ratio is captured once the image loads
		updateAspectRatios();
	};

	// set dynamically depending on cropToFit
	let imageContainerCss = css`
		height: ${getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
	`;
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
	});

	onDestroy(() => {
		if (imageRef && !cropToFit) {
			imageRef.removeEventListener('load', onImageLoad);
		}
	});

	$: {
		// ensure the aspect ratios are updated when the window width changes in state
		if (true) {
			$uiState.windowWidth;
			updateAspectRatios();
			imageContainerCss = css`
				height: ${getPreferredContainerHeight(imageAspectRatio, containerAspectRatio)};
			`;
			imageCss = css`
				object-fit: ${getPreferredObjectFit(imageAspectRatio, containerAspectRatio)};
			`;
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
