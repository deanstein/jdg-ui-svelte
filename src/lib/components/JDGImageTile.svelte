<script>
	import { onMount, onDestroy } from 'svelte';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	import { JDGStripesHorizontal } from '../index.js';

	import { fadeAndScale, verticalSlide } from '$lib/jdg-graphics-factory.js';
	import { jdgColors, jdgSizes, jdgDurations } from '../jdg-styling-constants.js';

	export let nHeightPx = 300;
	export let cropToFit = true; // if false, entire image always shown
	export let label = undefined;
	export let labelJustification = 'left';
	export let labelContainerVerticalAlign = 'bottom';
	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg';
	export let imgAlt = 'Image Tile';
	export let href = undefined;
	export let onClickFunction = () => {};
	export let showHorizontalStripesOnHover = true;

	let containerRef;
	let containerAspectRatio;
	let imgRef;
	let imgAspectRatio;
	let isHovering;

	const calculateImageContainerHeight = (allowCropping, imgAspectRatio, containerAspectRatio) => {
		switch (true) {
			case !allowCropping && imgAspectRatio > containerAspectRatio:
				return 'auto';
			case !allowCropping && imgAspectRatio < containerAspectRatio:
				return nHeightPx.toString() + 'px';
			default:
				return nHeightPx.toString() + 'px';
		}
	};

	const updateContainerHeight = () => {
		// no need to update if cropping
		if (cropToFit) {
			return;
		}
		if (containerRef && imgRef) {
			imgAspectRatio = imgRef.naturalWidth / imgRef.naturalHeight;
			containerAspectRatio = containerRef.clientWidth / nHeightPx;

			imageTileCss = css`
				height: ${calculateImageContainerHeight(cropToFit, imgAspectRatio, containerAspectRatio)};
			`;
		}
	};

	const aCss = css`
		display: ${cropToFit ? 'auto' : 'flex'};
	`;

	const imageTileLabelContainerCss = css`
		color: ${jdgColors.text};
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
		${labelContainerVerticalAlign === 'center'
			? `top: 50%;
		transform: translate(0, -50%);`
			: `${labelContainerVerticalAlign}: 0;`}
	`;

	const imageTileLabelCss = css`
		font-size: ${jdgSizes.fontSizeImageTileLabel};
		text-align: ${labelJustification};
	`;

	// this is possibly set dynamically depending on cropToFit
	let imageTileCss = css`
		height: ${cropToFit ? nHeightPx.toString() + 'px' : 'auto'};
	`;

	onMount(() => {
		if (imgRef && !cropToFit) {
			imgRef.addEventListener('load', onImgLoad);
		}
	});

	onDestroy(() => {
		if (imgRef && !cropToFit) {
			imgRef.removeEventListener('load', onImgLoad);
		}
	});

	$: {
		// ensure the image tile is updated when the window width state
		$uiState.windowWidth;
		updateContainerHeight();
	}

	const onImgLoad = () => {
		updateContainerHeight();
	};
</script>

<a {href} class={aCss}>
	<div
		bind:this={containerRef}
		class="jdg-image-tile {imageTileCss}"
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}
		role="button"
		tabindex="0"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
		transition:fadeAndScale={{ duration: jdgDurations.default }}
	>
		{#if label}
			<div class="jdg-image-tile-label-container {imageTileLabelContainerCss}">
				<div class="jdg-image-tile-label {imageTileLabelCss}">
					{label}
				</div>
			</div>
		{/if}
		{#if isHovering && showHorizontalStripesOnHover}
			<div class="stripes-container" transition:verticalSlide={{ duration: 300 }}>
				<JDGStripesHorizontal stripeHeight="3px" staggeredStripeWidth={false} />
			</div>
		{/if}
		<img bind:this={imgRef} src={imgSrc} alt={imgAlt} />
	</div>
</a>

<style>
	/* ignore the global a styles */
	a::before,
	a:hover::before {
		all: unset;
	}

	a {
		min-width: 0;
		justify-content: center;
		align-items: center;
	}

	img {
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease-in-out;
		z-index: -1;
		object-fit: cover;
	}

	.jdg-image-tile {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		cursor: pointer;
		transition:
			transform 0.3s ease-in-out,
			box-shadow 0.3s ease-in-out;
		box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
		overflow: hidden;
	}

	.jdg-image-tile:hover {
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.jdg-image-tile:active {
		transform: scale(0.98);
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.jdg-image-tile-label-container {
		position: absolute;
		padding: 15px;
		width: -webkit-fill-available;
		width: -moz-available;
		font-weight: bold;
	}

	.stripes-container {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	.jdg-image-tile:hover img {
		transform: scale(1.04); /* Scale the image up to create a zoom effect */
	}
</style>
