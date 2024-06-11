<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;
	export let truncateText = true;
	export let matchBodyCopyPadding = false; // if true, uses same padding as body copy (for full-width use only)
	export let backgroundColorRgba = jdgColors.imageLabelBackground;

	const toggleTruncate = () => {
		truncateText = !truncateText;
	};

	const attributionPrefix = 'Image Source: ';

	const captionAttributionContainerCss = css`
		background-color: ${backgroundColorRgba};
		backdrop-filter: ${backgroundColorRgba !== 'rgba(0, 0, 0, 0)'
			? `blur(${jdgSizes.blurSizeSmall})`
			: ''};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 3px ${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingSm : '8px'} 3px
				${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingSm : '8px'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 4px ${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingMd : '8px'} 4px
				${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingMd : '8px'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 6px ${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingLg : '8px'} 6px
				${matchBodyCopyPadding ? jdgSizes.bodyCopyVerticalPaddingLg : '8px'};
		}
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
		width: 100%;
		box-sizing: border-box;
	}

	.caption-attribution {
		width: 100%;
		overflow: hidden;
	}
</style>
