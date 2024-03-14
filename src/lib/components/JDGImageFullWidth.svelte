<script>
	import { css } from '@emotion/css';

	import { JDGImage } from '$lib/index.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import jdgImageDetails from '$lib/schemas/image-details.js';

	export let imageDetails = instantiateObject(jdgImageDetails);
	export let maxHeight = '80vh';
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';

	const heroImageOverlayContainerCss = css`
		background-color: ${overlayColorRgba};
	`;
</script>

<div class="jdg-image-hero-container">
	<JDGImage {imageDetails} {maxHeight} />
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
