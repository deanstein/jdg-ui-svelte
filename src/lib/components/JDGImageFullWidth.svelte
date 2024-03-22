<script>
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGAccentText, JDGImage } from '$lib/index.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes);
	export let maxHeight = '80vh';
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';
	export let superText = undefined;
	export let primaryText = undefined;
	export let secondaryText = undefined;

	const imageOverlayCss = css`
		background-color: ${overlayColorRgba};
	`;
</script>

<div class="jdg-full-width-image-container">
	<JDGImage {imageAttributes} {maxHeight} />
	{#if showOverlay || primaryText || secondaryText}
		<div class="image-overlay {imageOverlayCss}">
			{#if primaryText || secondaryText}
				<JDGAccentText {superText} {primaryText} {secondaryText} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.jdg-full-width-image-container {
		position: relative;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.image-overlay {
		position: absolute;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}
</style>
