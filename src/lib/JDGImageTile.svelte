<script>
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	import { JDGStripesHorizontal } from './index.js';

	export let label = undefined;
	export let labelJustification = 'left';
	export let labelContainerVerticalAlign = 'bottom';
	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg';
	export let imgAlt = 'Image Tile';
	export let href = undefined;
	export let onClickFunction = () => {};

	let isHovering;

	const imageTileOverlayCss = css`
		background-color: ${jdgColors.overlayMedia};
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
</script>

<a {href}>
	<div
		class="jdg-image-tile"
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}
		role="button"
		tabindex="0"
		in:fade={{ duration: 500 }}
		on:click={onClickFunction}
		on:keydown={onClickFunction}
	>
		{#if isHovering}
			<div class="jdg-image-tile-overlay {imageTileOverlayCss}" />
		{/if}
		{#if label}
			<div class="jdg-image-tile-label-container {imageTileLabelContainerCss}">
				<div class="jdg-image-tile-label {imageTileLabelCss}">
					{label}
				</div>
			</div>
		{/if}
		{#if isHovering}
			<div class="stripes-container">
				<JDGStripesHorizontal stripeHeight="3px" />
			</div>
		{/if}
		<img src={imgSrc} alt={imgAlt} />
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
	}

	.jdg-image-tile-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.jdg-image-tile {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: 300px;
		cursor: pointer;
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

	img {
		height: -webkit-fill-available;
		height: -moz-available;
		width: -webkit-fill-available;
		width: -moz-available;
		flex-grow: 1;
		object-fit: cover;
	}
</style>
