<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import { clientWidth } from '$lib/stores/jdg-ui-store.js';
	import { getFullTextWidth } from '$lib/jdg-ui-management.js';
	import { getMaxElementWidthPx, setRgbaAlpha } from '$lib/jdg-utils.js';

	import { JDGButton } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let imageMeta;
	export let showCaption = true;
	export let showAttribution = true;
	export let showDate = true;
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

	const fullMonthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	// Format date when showDate is true
	// Use "Circa" only when year-only (isApprx and month 01 and day 01)
	$: formattedDateDisplay = showDate
		? (() => {
				const raw = imageMeta?.date;
				if (raw == null || raw === '') return '';
				const d = new Date(raw);
				if (isNaN(d.getTime())) return '';
				const isApprx = !!imageMeta?.isApprxDate;
				const month = d.getUTCMonth();
				const day = d.getUTCDate();
				const year = d.getUTCFullYear();
				if (isApprx && month === 0 && day === 1) return `Circa ${year}`;
				if (isApprx && day === 1) return `${fullMonthNames[month]} ${year}`;
				return `${fullMonthNames[month]} ${day}, ${year}`;
			})()
		: '';

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
		if (showCaption && imageMeta.caption) {
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
			white-space: ${truncateText || availableWidth === 0 ? 'nowrap' : 'pre-line'};
		}`;
	}

	// Line-height: 1 when collapsed (one line or Show more), 1.5 when expanded (Show less)
	let captionLineHeightCss = css``;
	$: captionLineHeightCss = css`
		line-height: ${truncateText ? 1 : 1.5};
	`;

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
						? `${getPaddingForMaxWidth() + 8}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingSm
							: '8px'}
					3px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth() + 8}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingSm
							: '8px'};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				padding: 4px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth() + 8}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingMd
							: '8px'}
					4px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth() + 8}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingMd
							: '8px'};
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				padding: 6px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth() + 10}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingLg
							: '10px'}
					6px
					${maxTextWidthPx
						? `${getPaddingForMaxWidth() + 10}px`
						: matchBodyCopyPadding
							? jdgSizes.bodyCopyVerticalPaddingLg
							: '10px'};
			}
		`;
	}
</script>

{#if imageMeta.caption || imageMeta.attribution || (showDate && formattedDateDisplay)}
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
				{#if showCaption && imageMeta.caption}
					<div class="caption-attribution-flex-container {captionCss}">
						<div
							bind:this={captionTextRef}
							class="caption-text {captionAttributionDynamicCss} {captionLineHeightCss}"
						>
							{imageMeta.caption}
						</div>
					</div>
				{/if}
				{#if showDate && formattedDateDisplay}
					<div
						class="caption-attribution-flex-container {captionAttributionDynamicCss} {attributionCss}"
					>
						<div class="attribution-text">
							{formattedDateDisplay}
						</div>
					</div>
				{/if}
				{#if showAttribution && imageMeta.attribution}
					<div
						class="caption-attribution-flex-container {captionAttributionDynamicCss} {attributionCss}"
					>
						<div class="attribution-text">
							{imageMeta.attribution}
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
						backgroundColor={setRgbaAlpha(jdgColors.headerBackground, 0.2)}
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
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.05rem;
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

	.caption-text,
	.attribution-text {
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
		padding: 2px 0.5rem 2px 0.5rem;
	}

	.attribution-text {
		line-height: 1;
	}

	/* Caption line-height is set dynamically via captionLineHeightCss (1 when collapsed, 1.5 when expanded) */

	.expand-collapse-button-container {
		padding: 1px 0 0 0;
	}
</style>
