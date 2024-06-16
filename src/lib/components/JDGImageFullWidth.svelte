<script>
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGAccentText, JDGFullWidthContainer, JDGImage } from '$lib/index.js';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes);
	export let maxHeight = '80vh';
	export let overlapWithHeader = false; // if true, the overlays will be moved down so they're visually centered
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';
	export let superText = undefined;
	export let superTextFontFamily = 'REM';
	export let primaryText = undefined;
	export let primaryTextFontFamily = 'REM';
	export let secondaryText = undefined;
	export let secondaryTextFontFamily = 'REM';
	export let overlayImageAttributes = undefined; // for example, a logo or vector graphic over the image
	export let overlayImageMaxHeight = '18vh';
	export let overlayImageText = undefined;
	export let overlayImageTextFontFamily = 'REM';

	const imageOverlayCss = css`
		background-color: ${overlayColorRgba};
	`;

	const overlayContentHeaderOffset = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding-top: ${overlapWithHeader
				? jdgSizes.nHeaderHeightSm / 2 + jdgSizes.headerHeightUnit
				: '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding-top: ${overlapWithHeader
				? jdgSizes.nHeaderHeightMd / 2 + jdgSizes.headerHeightUnit
				: '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding-top: ${overlapWithHeader
				? jdgSizes.nHeaderHeightLg / 2 + jdgSizes.headerHeightUnit
				: '0'};
		}
	`;
</script>

<JDGFullWidthContainer>
	<JDGImage {imageAttributes} {maxHeight} />
	{#if showOverlay || primaryText || secondaryText || overlayImageAttributes}
		<div class="image-overlay {imageOverlayCss}">
			{#if superText || primaryText || secondaryText}
				<div class={overlayContentHeaderOffset}>
					<JDGAccentText
						{superText}
						{superTextFontFamily}
						{primaryText}
						{primaryTextFontFamily}
						{secondaryText}
						{secondaryTextFontFamily}
					/>
				</div>
			{/if}
			{#if overlayImageAttributes}
				<div class="overlay-image-wrapper {overlayContentHeaderOffset}">
					<JDGImage
						imageAttributes={overlayImageAttributes}
						maxHeight={overlayImageMaxHeight}
						fillContainer={false}
					/>
					{#if overlayImageText}
						<JDGAccentText
							secondaryText={overlayImageText}
							secondaryTextFontFamily={overlayImageTextFontFamily}
						/>
					{/if}
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
		flex-direction: column;
		gap: 15px;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
