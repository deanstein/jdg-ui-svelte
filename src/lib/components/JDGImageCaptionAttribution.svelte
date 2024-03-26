<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let imageAttributes;
	export let showCaption = false;
	export let showAttribution = false;

	const captionAttributionContainerCss = css`
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;

	const captionAttributionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionAttributionSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionAttributionMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeCaptionAttributionLg};
		}
	`;
</script>

<div class="caption-attribution-container {captionAttributionContainerCss}">
	{#if showCaption}
		<div class="caption-attribution {captionAttributionCss}">
			{imageAttributes.imgCaption}
		</div>
	{/if}
	{#if showAttribution}
		<div class="caption-attribution {captionAttributionCss}">
			{imageAttributes.imgAttribution}
		</div>
	{/if}
</div>

<style>
	.caption-attribution-container {
		display: flex;
		gap: 1rem;
		padding: 3px 8px 3px 8px;
	}
</style>
