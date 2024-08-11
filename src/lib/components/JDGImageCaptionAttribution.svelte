<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import uiState from '$lib/states/ui-state.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	import { JDGButton } from '../index.js';
	import { setAlphaInRgbaString } from '$lib/jdg-graphics-factory.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;
	export let truncateText = true;
	export let matchBodyCopyPadding = false; // if true, uses same padding as body copy (for full-width use only)
	export let backgroundColorRgba = jdgColors.imageLabelBackground;

	let availableWidthRef; // element to determine available space for caption
	let availableWidth = 0; // final available width - updated after loading
	let captionTextRef; // element to determine total length of caption
	let captionTextWidth = 0; // final caption width - updated after loading
	let isCaptionTruncated = false;

	const toggleCaptionTruncation = () => {
		truncateText = !truncateText;
	};

	const getIsCaptionTruncated = () => {
		if (availableWidthRef && captionTextRef) {
			isCaptionTruncated = captionTextWidth >= availableWidth;
		}
	};

	onMount(() => {
		if (showCaption && imageAttributes.imgCaption) {
			// set up a resize observer to calculate the final available width for text
			const observer = new ResizeObserver(() => {
				const availableWidthRefStyles = window.getComputedStyle(availableWidthRef);
				const captionTextRefStyles = window.getComputedStyle(captionTextRef);
				availableWidth = parseFloat(availableWidthRefStyles.width);
				captionTextWidth = parseFloat(captionTextRefStyles.width);
			});
			observer.observe(captionTextRef);
			return () => {
				observer.disconnect();
			};
		}
	});

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
			line-height: 12px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 11.5px;
			line-height: 13.5px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 13px;
			line-height: 15px;
		}
	`;

	const attributionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 8px;
			line-height: 10px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 9px;
			line-height: 11px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 10px;
			line-height: 12px;
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
		availableWidth;
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
	<div bind:this={availableWidthRef} class="caption-attribution-grid-container">
		{#if showCaption && imageAttributes.imgCaption}
			<div class="caption-attribution-flex-container {captionCss}">
				<div
					bind:this={captionTextRef}
					class="caption-attribution-text {captionAttributionDynamicCss}"
				>
					{imageAttributes.imgCaption}
				</div>
			</div>
		{/if}
		{#if showAttribution && imageAttributes.imgAttribution}
			<div
				class="caption-attribution-flex-container {captionAttributionDynamicCss} {attributionCss}"
			>
				<div class="caption-attribution-text">
					{attributionPrefix + imageAttributes.imgAttribution}
				</div>
			</div>
		{/if}
	</div>
	{#if isCaptionTruncated}
		<div class="expand-collapse-button-container">
			<JDGButton
				label={truncateText ? 'Show more' : 'Show less'}
				onClickFunction={(event) => {
					event.stopPropagation();
					toggleCaptionTruncation();
				}}
				textColor={jdgColors.active}
				backgroundColor={setAlphaInRgbaString(jdgColors.headerBackground, 0.2)}
				backgroundColorHover={jdgColors.active}
				paddingLeftRight="5px"
				paddingTopBottom="3px"
				fontSize="10px"
				faIcon={null}
			/>
		</div>
	{/if}
</div>

<style>
	.jdg-caption-attribution-container {
		display: flex;
		width: -webkit-fill-available;
		gap: 5px;
	}

	.caption-attribution-grid-container {
		display: grid;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.2rem;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
	}

	.caption-attribution-flex-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		overflow: hidden;
	}

	.caption-attribution-text {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
</style>
