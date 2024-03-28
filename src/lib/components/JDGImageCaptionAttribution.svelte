<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;

	const attributionPrefix = 'Image Source: ';

	const captionAttributionContainerCss = css`
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;

	const captionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionLg};
		}
	`;

	const attributionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAttributionSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAttributionMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAttributionLg};
		}
	`;
</script>

<div class="caption-attribution-container {captionAttributionContainerCss}">
	{#if showCaption && imageAttributes.imgCaption}
		<div class="caption-attribution {captionCss}">
			{imageAttributes.imgCaption}
		</div>
	{/if}
	{#if showAttribution && imageAttributes.imgAttribution}
		<div class="caption-attribution {attributionCss}">
			{attributionPrefix + imageAttributes.imgAttribution}
		</div>
	{/if}
</div>

<style>
	.caption-attribution-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.1rem;
		padding: 3px 8px 3px 8px;
		width: 100%;
		box-sizing: border-box;
	}
</style>
