<script>
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	import { JDGStripesHorizontal } from './index.js';

	export let label = undefined;

	let isHovering;

	const imageTileOverlayCss = css`
		background-color: ${jdgColors.overlayMedia};
	`;

	const imageTileLabelContainerCss = css`
		color: ${jdgColors.text};
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;

	const imageTileLabelCss = css`
		font-size: ${jdgSizes.fontSizeImageTileLabel};
	`;
</script>

<div
	class="jdg-image-tile"
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
	role="banner"
	in:fade={{ duration: 500 }}
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
	<img
		src="https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg"
		alt="Temporary"
	/>
</div>

<style>
	.jdg-image-tile-overlay {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.jdg-image-tile {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 300px;
		cursor: pointer;
	}

	.jdg-image-tile-label-container {
		position: absolute;
		bottom: 0;
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
