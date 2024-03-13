<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	import { convertVhToPixels } from '$lib/jdg-utils.js';
	import { JDGImage } from '$lib/index.js';

	export let imgSrc = './history/CCP1.jpg';
	export let imgAlt = 'Full-width';
	export let nHeightVh = 80;
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';

	const heroImageOverlayContainerCss = css`
		background-color: ${overlayColorRgba};
	`;
</script>

<div class="jdg-image-hero-container">
	<JDGImage {imgSrc} nMaxHeightPx={convertVhToPixels(nHeightVh)} />
	{#if showOverlay}
		<div class="jdg-image-hero-overlay {heroImageOverlayContainerCss}"></div>
	{/if}
</div>

<style>
	.jdg-image-hero-container {
		position: relative;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.jdg-image-hero {
		width: 100%;
	}

	.jdg-image-hero-overlay {
		position: absolute;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
</style>
