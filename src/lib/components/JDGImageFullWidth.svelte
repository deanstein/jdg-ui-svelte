<script>
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGAccentText, JDGFullWidthContainer, JDGImage } from '$lib/index.js';

	export let imageEnhancedSrc;
	export let imageAttributes = instantiateObject(jdgImageAttributes);
	export let maxHeight = '80vh';
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';
	export let superText = undefined;
	export let superTextFontFamily = 'REM';
	export let primaryText = undefined;
	export let primaryTextFontFamily = 'REM';
	export let secondaryText = undefined;
	export let secondaryTextFontFamily = 'REM';
	export let overlayImageAttributes = undefined; // for example, a logo or vector graphic over the image
	export let overlayImageEnhancedSrc = undefined;
	export let overlayImageMaxHeight = '18vh';

	const imageOverlayCss = css`
		background-color: ${overlayColorRgba};
	`;
</script>

<JDGFullWidthContainer>
	<JDGImage {imageEnhancedSrc} {imageAttributes} {maxHeight} />
	{#if showOverlay || primaryText || secondaryText || overlayImageAttributes}
		<div class="image-overlay {imageOverlayCss}">
			{#if primaryText || secondaryText}
				<JDGAccentText
					{superText}
					{superTextFontFamily}
					{primaryText}
					{primaryTextFontFamily}
					{secondaryText}
					{secondaryTextFontFamily}
				/>
			{/if}
			{#if overlayImageAttributes}
				<div class="overlay-image-wrapper">
					<JDGImage
						imageEnhancedSrc={overlayImageEnhancedSrc}
						imageAttributes={overlayImageAttributes}
						maxHeight={overlayImageMaxHeight}
					/>
				</div>
			{/if}
		</div>
	{/if}
</JDGFullWidthContainer>

<style>
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

	.overlay-image-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
