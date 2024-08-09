<script>
	import { css } from '@emotion/css';
	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import {
		JDGAccentText,
		JDGAnimateOnVisible,
		JDGFullWidthContainer,
		JDGImage
	} from '$lib/index.js';
	import {
		fadeInSettleBeforeSm,
		jdgBreakpoints,
		jdgFonts,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';
	import { fade } from 'svelte/transition';

	export let imageAttributes = instantiateObject(jdgImageAttributes);
	export let maxHeight = '80vh';
	export let overlapWithHeader = false; // if true, the overlays will be moved down so they're visually centered
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';
	export let superText = undefined;
	export let superTextFontFamily = jdgFonts.body;
	export let primaryText = undefined;
	export let primaryTextFontFamily = jdgFonts.body;
	export let secondaryText = undefined;
	export let secondaryTextFontFamily = jdgFonts.body;
	export let overlayImageAttributes = undefined; // for example, a logo or vector graphic over the image
	export let overlayImageMaxHeight = '18vh';
	export let overlayImageText = undefined;
	export let overlayImageTextFontFamily = jdgFonts.body;

	let overlayContainerRef;
	let imageOverlayWrapperRef;

	const imageOverlayCss = css`
		background-color: ${overlayColorRgba};
	`;

	const overlayContentHeaderOffsetCss = css`
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
	<JDGImage {imageAttributes} {maxHeight} alignLoadingSpinner={'end'} />
	{#if showOverlay || primaryText || secondaryText || overlayImageAttributes}
		<div
			bind:this={overlayContainerRef}
			class="image-overlay {imageOverlayCss}"
			transition:fade={{ duration: 5000 /* set this high to prevent flashing */ }}
		>
			{#if superText || primaryText || secondaryText}
				<div class={overlayContentHeaderOffsetCss}>
					<JDGAnimateOnVisible animationCssBefore={fadeInSettleBeforeSm}>
						<JDGAccentText
							{superText}
							{superTextFontFamily}
							{primaryText}
							{primaryTextFontFamily}
							{secondaryText}
							{secondaryTextFontFamily}
						/>
					</JDGAnimateOnVisible>
				</div>
			{/if}
			{#if overlayImageAttributes}
				<div
					bind:this={imageOverlayWrapperRef}
					class="image-overlay-wrapper {overlayContentHeaderOffsetCss}"
				>
					<JDGAnimateOnVisible animationCssBefore={fadeInSettleBeforeSm}>
						<JDGImage
							imageAttributes={overlayImageAttributes}
							maxHeight={overlayImageMaxHeight}
							fillContainer={false}
							showPlaceholderImage={false}
							showLoadingSpinner={false}
						/>
						{#if overlayImageText}
							<JDGAccentText
								secondaryText={overlayImageText}
								secondaryTextFontFamily={overlayImageTextFontFamily}
							/>
						{/if}
					</JDGAnimateOnVisible>
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

	.image-overlay-wrapper {
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
