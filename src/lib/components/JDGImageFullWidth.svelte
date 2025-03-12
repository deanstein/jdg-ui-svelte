<script>
	import { css } from '@emotion/css';
	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import {
		addCloudinaryUrlHeight,
		getMaxHeightPxFromProp,
		instantiateObject
	} from '$lib/jdg-utils.js';
	import {
		JDGAccentText,
		JDGAnchorTag,
		JDGAnimateOnVisible,
		JDGFullWidthContainer,
		JDGImage
	} from '$lib/index.js';
	import { fadeInSettleBeforeSm, jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { fade } from 'svelte/transition';
	import { appFontFamily } from '$lib/states/ui-state.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes);
	export let objectPosition = 'center';
	export let maxHeight = '80vh';
	export let overlapWithHeader = false; // if true, the overlays will be moved down so they're visually centered
	export let showOverlay = false;
	export let overlayColorRgba = 'rgba(50, 50, 50, 0.2)';
	export let superText = undefined;
	export let superTextFontFamily = $appFontFamily;
	export let primaryText = undefined;
	export let primaryTextBold = false;
	export let primaryTextFontFamily = $appFontFamily;
	export let secondaryText = undefined;
	export let secondaryTextFontFamily = $appFontFamily;
	export let overlayImageAttributes = undefined; // for example, a logo or vector graphic over the image
	export let overlayImageMaxHeight = '18vh';
	export let overlayImageText = undefined;
	export let overlayImageTextFontFamily = $appFontFamily;
	export let parallax = false; // if true, image will appear stationary as page scrolls

	let parallaxContainerRef;
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
	<!-- use the primary text as an anchor tag if present -->
	{#if primaryText}
		<JDGAnchorTag anchorTagString={primaryText} adjustPosForPadding={false} />
	{/if}
	<!-- main image -->
	{#if parallax}
		<div
			bind:this={parallaxContainerRef}
			class="parallax-image-container"
			style="height: {getMaxHeightPxFromProp(maxHeight, parallaxContainerRef)}px;"
		>
			<div
				class="parallax-image"
				style="background-image: url({addCloudinaryUrlHeight(
					imageAttributes.imgSrc,
					getMaxHeightPxFromProp(maxHeight, parallaxContainerRef)
				)}); height: {getMaxHeightPxFromProp(
					maxHeight,
					parallaxContainerRef
				)}px; background-position: {objectPosition};"
			></div>
		</div>
	{:else}
		<JDGImage
			{imageAttributes}
			{maxHeight}
			useAutoHeightOnMobile={false}
			{objectPosition}
			alignLoadingSpinner={'end'}
		/>
	{/if}
	<!-- text and image overlay -->
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
							{primaryTextBold}
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
						<!-- overlay image -->
						<JDGImage
							imageAttributes={overlayImageAttributes}
							maxHeight={overlayImageMaxHeight}
							useAutoHeightOnMobile={false}
							cropToFillContainer={false}
							showPlaceholderImage={false}
							showLoadingSpinner={false}
						/>
					</JDGAnimateOnVisible>
					{#if overlayImageText}
						<JDGAnimateOnVisible animationCssBefore={fadeInSettleBeforeSm}>
							<JDGAccentText
								secondaryText={overlayImageText}
								secondaryTextFontFamily={overlayImageTextFontFamily}
							/>
						</JDGAnimateOnVisible>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</JDGFullWidthContainer>

<style>
	.parallax-image-container {
		position: relative;
		overflow: hidden;
	}

	.parallax-image {
		width: 100%;
		height: 100%;
		background-attachment: fixed;
		background-position: top;
	}

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
