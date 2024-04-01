<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { setAlphaInRgbaString } from '$lib/jdg-graphics-factory.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;
	export let truncateText = true;

	const toggleTruncate = () => {
		truncateText = !truncateText;
	};

	const attributionPrefix = 'Image Source: ';

	const captionAttributionContainerCss = css`
		background-color: ${setAlphaInRgbaString(jdgColors.headerBackground, 1.0)};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;

	const captionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 10px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 11px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 12px;
		}
	`;

	const attributionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 8px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 8px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 9px;
		}
	`;

	// dynamic - updated whenever the container is clicked
	let captionAttributionDynamicCss = css`
        }
    `;

	$: {
		captionAttributionDynamicCss = css`
        text-overflow: ${truncateText ? 'ellipsis' : 'clip'};
        white-space: ${truncateText ? 'nowrap' : 'normal'};
        }
    `;
	}
</script>

<div
	class="jdg-caption-attribution-container {captionAttributionContainerCss}"
	on:click={toggleTruncate}
	on:keypress={() => {}}
	role="button"
	tabindex="0"
>
	{#if showCaption && imageAttributes.imgCaption}
		<div class="caption-attribution {captionAttributionDynamicCss} {captionCss}">
			{imageAttributes.imgCaption}
		</div>
	{/if}
	{#if showAttribution && imageAttributes.imgAttribution}
		<div class="caption-attribution {captionAttributionDynamicCss} {attributionCss}">
			{attributionPrefix + imageAttributes.imgAttribution}
		</div>
	{/if}
</div>

<style>
	.jdg-caption-attribution-container {
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

	.caption-attribution {
		width: 100%;
		overflow: hidden;
	}
</style>
