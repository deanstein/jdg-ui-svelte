<script>
	import { css } from '@emotion/css';
	import uiState from '$lib/states/ui-state.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { JDGButton } from '../index.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;
	export let truncateText = true;
	export let matchBodyCopyPadding = false; // if true, uses same padding as body copy (for full-width use only)
	export let backgroundColorRgba = jdgColors.imageLabelBackground;

	let captionTextRef; // the element reference to determine if caption is being truncated
	let isCaptionTruncated = false;

	const toggleCaptionTruncation = () => {
		truncateText = !truncateText;
	};

	const getIsCaptionTruncated = () => {
		if (captionTextRef) {
			isCaptionTruncated = captionTextRef.scrollWidth > captionTextRef.clientWidth;
		}
	};

	const attributionPrefix = 'Image Source: ';

	const captionAttributionContainerCss = css`
		color: ${jdgColors.text};
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
			line-height: 11px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 11.5px;
			line-height: 12.5px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 13px;
			line-height: 14px;
		}
	`;

	const attributionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 8px;
			line-height: 9px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 9px;
			line-height: 10px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 10px;
			line-height: 11px;
		}
	`;

	// dynamic - updated whenever the container is clicked
	let captionAttributionDynamicCss = css``;

	$: {
		captionAttributionDynamicCss = css`
        text-overflow: ${truncateText ? 'ellipsis' : 'clip'};
        white-space: ${truncateText ? 'nowrap' : 'normal'};
        }
    `;
	}

	$: {
		// check for truncation when clientWidth changes
		$uiState.clientWidth;
		getIsCaptionTruncated();
	}
</script>

<div
	class="jdg-caption-attribution-container {captionAttributionContainerCss}"
	on:click={(event) => {
		event.stopPropagation();
		toggleCaptionTruncation();
	}}
	on:keypress={() => {}}
	role="button"
	tabindex="0"
>
	{#if showCaption && imageAttributes.imgCaption}
		<div class="caption-attribution {captionCss}">
			<div bind:this={captionTextRef} class="caption-text {captionAttributionDynamicCss}">
				{imageAttributes.imgCaption}
			</div>
			{#if isCaptionTruncated}
				<JDGButton
					label={truncateText ? 'Show more' : 'Show less'}
					onClickFunction={(event) => {
						event.stopPropagation();
						toggleCaptionTruncation();
					}}
					paddingLeftRight="5px"
					paddingTopBottom="3px"
					fontSize="8px"
					faIcon={null}
				/>
			{/if}
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
		display: grid;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.2rem;
		width: 100%;
		box-sizing: border-box;
	}

	.caption-attribution {
		display: flex;
		gap: 5px;
		align-items: center;
		justify-content: center;
		width: 100%;
		overflow: hidden;
	}

	.caption-text {
		flex: 1;
		overflow: hidden;
	}
</style>
