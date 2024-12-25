<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import { clientWidth } from '$lib/states/ui-state.js';
	import { setAlphaInRgbaString } from '$lib/jdg-graphics-factory.js';
	import { getFullTextWidth } from '$lib/jdg-ui-management.js';
	import { getMaxElementWidthPx } from '$lib/jdg-utils.js';

	import { JDGButton } from '../index.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let imageAttributes;
	export let showCaption = true;
	export let showAttribution = true;
	export let truncateText = true;
	export let matchBodyCopyPadding = false; // if true, uses same padding as body copy (for full-width use only)
	export let maxTextWidthPx = undefined; // useful for cases where caption/attribution is outside image but must match image width
	export let backgroundColorRgba = jdgColors.imageLabelBackground;

	let availableWidthRef; // element to determine available space for caption
	let availableWidth = 0; // final available width - updated after loading
	let captionTextRef; // element to determine total length of caption
	let captionTextWidth = 0; // final caption width - updated after loading
	let buttonContainerRef; // the expand/collapse button - hidden for measurements
	let isCaptionTooLong = false;

	const toggleCaptionTruncation = () => {
		truncateText = !truncateText;
	};

	const updateWidths = () => {
		if (!buttonContainerRef || !availableWidthRef || !captionTextRef) {
			return;
		}
		// temporarily set the button to absolute
		// so we can calculate the width without the button
		let previousPositionValue;
		previousPositionValue = window.getComputedStyle(buttonContainerRef).position;
		buttonContainerRef.style.position = 'absolute';

		// measure and update the widths
		const currentAvailableWidth = getMaxElementWidthPx(availableWidthRef);
		if (isFinite(currentAvailableWidth)) {
			availableWidth = currentAvailableWidth;
			captionTextWidth = getFullTextWidth(captionTextRef);
		}

		// console.log('Caption text width: ', captionTextWidth, 'Caption available width: ', availableWidth);

		// set the button container ref back to its original value
		// now that we're done measuring
		buttonContainerRef.style.position = previousPositionValue;
	};

	const getIsCaptionTooLong = () => {
		if (availableWidthRef && captionTextRef) {
			return maxTextWidthPx
				? captionTextWidth >= maxTextWidthPx
				: captionTextWidth >= availableWidth;
		}
	};

	const getPaddingForMaxWidth = () => {
		// @ts-ignore
		return Math.abs(availableWidth - maxTextWidthPx) / 2;
	};

	const attributionPrefix = 'Image Source: ';

	const captionAttributionContainerCss = css`
		color: ${jdgColors.text};
		backdrop-filter: ${backgroundColorRgba !== 'rgba(0, 0, 0, 0)'
			? `blur(${jdgSizes.blurSizeSmall})`
			: ''};
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

	onMount(() => {
		if (showCaption && imageAttributes.imgCaption) {
			// set up a resize observer to calculate the final available width for text
			const observer = new ResizeObserver(() => {
				setTimeout(() => {
					updateWidths();
					isCaptionTooLong = getIsCaptionTooLong();
				}, 100);
			});
			observer.observe(captionTextRef);
			return () => {
				observer.disconnect();
			};
		}
	});

	// dynamic css
	let captionAttributionContainerDynamicCss = css``;
	$: {
		captionAttributionContainerDynamicCss = css`
			background-color: ${backgroundColorRgba};
		`;
	}

	let captionAttributionDynamicCss = css``;
	$: {
		availableWidthRef, isCaptionTooLong;
		captionAttributionDynamicCss = css`
			text-overflow: ${truncateText || availableWidth === 0 ? 'ellipsis' : 'clip'};
			white-space: ${truncateText || availableWidth === 0 ? 'nowrap' : 'normal'};
		}`;
	}

	// check for truncation when clientWidth changes
	$: {
		$clientWidth, availableWidthRef, captionTextRef, availableWidth;
		updateWidths();
		isCaptionTooLong = getIsCaptionTooLong();
	}

	let textWidthSizingCss = css``;
	// set the available text width
	$: {
		availableWidth;
		textWidthSizingCss = css`
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				padding: 3px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingSm
							: '8px'}
					3px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingSm
							: '8px'};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				padding: 4px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingMd
							: '8px'}
					4px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingMd
							: '8px'};
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				padding: 6px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingLg
							: '10px'}
					6px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth()}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingLg
							: '10px'};
			}
		`;
	}
</script>

{#if imageAttributes.imgCaption || imageAttributes.imageAttribution}
	<div bind:this={availableWidthRef} class="jdg-caption-attribution-available-width-ref">
		<div
			class="jdg-caption-attribution-container {captionAttributionContainerCss} {captionAttributionContainerDynamicCss} {textWidthSizingCss}"
			on:click|stopPropagation={(event) => {
				event.stopPropagation();
				toggleCaptionTruncation();
			}}
			on:keypress={() => {}}
			role="button"
			tabindex="0"
		>
			<div class="caption-attribution-grid-container">
				{#if showCaption && imageAttributes.imgCaption}
					<div class="caption-attribution-flex-container {captionCss}">
						<div bind:this={captionTextRef} class="caption-text {captionAttributionDynamicCss}">
							{imageAttributes.imgCaption}
						</div>
					</div>
				{/if}
				{#if showAttribution && imageAttributes.imgAttribution}
					<div
						class="caption-attribution-flex-container {captionAttributionDynamicCss} {attributionCss}"
					>
						<div class="attribution-text">
							{attributionPrefix + imageAttributes.imgAttribution}
						</div>
					</div>
				{/if}
			</div>
			<div bind:this={buttonContainerRef} class="expand-collapse-button-container">
				{#if isCaptionTooLong}
					<JDGButton
						label={truncateText ? 'Show more' : 'Show less'}
						faIcon={null}
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
					/>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.jdg-caption-attribution-available-width-ref {
		width: 100%;
	}

	.jdg-caption-attribution-container {
		display: flex;
		width: -webkit-fill-available;
		gap: 5px;
	}

	.caption-attribution-grid-container {
		display: grid;
		align-items: flex-start;
		justify-content: center;
		text-align: center;
		gap: 0.2rem;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		min-height: 20px; /* button is about 18px, so this ensures adding button doesn't shift size */
	}

	.caption-attribution-flex-container {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.caption-text {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		padding: 3px 0 0 0;
	}

	.attribution-text {
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		padding: 0 0 3px 0;
	}

	.expand-collapse-button-container {
		padding: 1px 0 0 0;
	}
</style>
