<script>
	import { css } from '@emotion/css';

	import { showImageDetailModal } from '$lib/jdg-state-management.js';

	import { instantiateObject } from './../jdg-utils.js';

	import jdgImageMeta from '../schemas/jdg-image-meta.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGStripesHorizontal } from '../index.js';
	import { setAlphaInRgbaString, verticalSlide } from '$lib/jdg-graphics-factory.js';
	import { jdgColors, jdgSizes, jdgDurations, jdgBreakpoints } from '../jdg-shared-styles.js';
	import { appFontFamily } from '$lib/states/ui-state.js';

	export let imageMeta = instantiateObject(jdgImageMeta); // one object to hold all details
	export let maxWidth = undefined; // if not defined, takes available space
	export let maxHeight = '350px';
	export let cropToFillContainer = true; // if true, image may be cropped to fill container in both axes
	export let objectPosition = 'center'; // only applies if cropToFillContainer is true
	export let useAutoHeightOnMobile = true; // if true, ignores fillContainer on smallest breakpoint for no cropping and fitted container (less height)
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let label = undefined;
	export let labelFontFamily = $appFontFamily;
	export let labelJustification = 'left';
	export let labelColor = jdgColors.text;
	export let labelContainerColor = jdgColors.imageLabelBackground;
	export let labelContainerBlurSize = jdgSizes.blurSizeLarge;
	export let labelContainerVerticalAlign = 'bottom';
	export let href = undefined;
	export let hrefOpenInNewTab = false;
	export let onClickFunction = undefined;
	export let showHorizontalStripesOnHover = true;
	export let showCaption = false;
	export let showAttribution = false;
	export let recordAspectRatioInState = false;
	export let showDebugOverlay = false;

	const hrefTarget = hrefOpenInNewTab ? '_blank' : null;
	let isHovering;

	// if the imageMeta specify no blur, override showBlur to false
	if (!imageMeta.doShowBackgroundBlur) {
		showBlurInUnfilledSpace = false;
	}

	const aCss = css`
		display: ${cropToFillContainer ? 'initial' : 'flex'};
	`;

	const imageTileContainerCss = css`
		width: ${showBlurInUnfilledSpace || cropToFillContainer ? '100%' : 'fit-content'};
	`;

	const imageTileCss = css`
		width: ${showBlurInUnfilledSpace || cropToFillContainer ? '100%' : 'auto'};
	`;

	const imageTileLabelContainerCss = css`
		justify-content: ${labelJustification};
		background-color: ${labelContainerColor};
		backdrop-filter: blur(${labelContainerBlurSize});
		${labelContainerVerticalAlign === 'center'
			? `top: 50%;
		transform: translate(0, -50%);`
			: `${labelContainerVerticalAlign}: 0;`};
	`;

	const imageTileLabelCss = css`
		font-family: ${labelFontFamily};
		color: ${labelColor};
		text-align: ${labelJustification};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 8px;
			font-size: 12px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 14px;
			padding: 10px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 16px;
			padding: 12px;
		}
	`;
</script>

<div class="jdg-image-tile-container {imageTileContainerCss}">
	<a {href} target={hrefTarget} class={aCss}>
		<div
			class="image-tile {imageTileCss}"
			on:mouseenter={() => (isHovering = true)}
			on:mouseleave={() => (isHovering = false)}
			role="button"
			tabindex="0"
			on:click={(event) => {
				// if provided, use the onclick prop
				if (onClickFunction) {
					//@ts-expect-error
					onClickFunction();
				} else if (href) {
					// if href is provided, do nothing
				} else {
					// otherwise, the default behavior is to show image detail modal
					showImageDetailModal(imageMeta);
				}
				// in any case, ensure the hover goes away eventually
				setTimeout(() => {
					isHovering = false;
				}, 600);
			}}
			on:keypress={() => {}}
		>
			{#if label}
				<div class="image-tile-label-container {imageTileLabelContainerCss}">
					<!-- a slot for a pre-label, like for PMX3D use cases -->
					<slot />
					<div class="image-tile-label {imageTileLabelCss}">
						{label}
					</div>
				</div>
			{/if}
			{#if isHovering && showHorizontalStripesOnHover}
				<div
					class="stripes-container"
					transition:verticalSlide={{ duration: jdgDurations.default }}
				>
					<JDGStripesHorizontal
						stripeHeight={jdgSizes.horizontalStripeHeightSm}
						staggeredStripeWidth={false}
					/>
				</div>
			{/if}
			<JDGImage
				{maxHeight}
				{maxWidth}
				{imageMeta}
				showHoverEffect={true}
				{isHovering}
				{cropToFillContainer}
				{objectPosition}
				{useAutoHeightOnMobile}
				{showBlurInUnfilledSpace}
				showCaption={showCaption && !(showBlurInUnfilledSpace || cropToFillContainer)}
				showAttribution={showAttribution && !(cropToFillContainer || showBlurInUnfilledSpace)}
				{recordAspectRatioInState}
				{showDebugOverlay}
			/>
		</div>
	</a>
	{#if (showCaption || showAttribution) && (cropToFillContainer || showBlurInUnfilledSpace)}
		<div class="image-caption-attribution-wrapper">
			<JDGImageCaptionAttribution
				{imageMeta}
				{showCaption}
				{showAttribution}
				backgroundColorRgba={setAlphaInRgbaString(jdgColors.imageLabelBackground, 1.0)}
			/>
		</div>
	{/if}
</div>

<style>
	/* ignore the global link styles */
	.jdg-image-tile-container a,
	.jdg-image-tile-container a::before,
	.jdg-image-tile-container a:hover::before {
		all: unset;
		background: none;
	}

	.jdg-image-tile-container a {
		display: flex;
		min-width: 0;
		justify-content: center;
		align-items: center;
	}

	.jdg-image-tile-container {
		display: flex;
		flex-direction: column;
	}

	.image-tile {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		cursor: pointer;
		transition:
			transform 0.3s ease-in-out,
			box-shadow 0.3s ease-in-out;
		box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		outline: none;
	}

	@media (hover: hover) {
		.image-tile:hover {
			box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		}

		.image-tile:active {
			transform: scale(0.98);
			box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		}
	}

	.image-tile-label-container {
		position: absolute;
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		font-weight: bold;
		letter-spacing: 1px;
		z-index: 1;
		pointer-events: none;
	}

	.image-caption-attribution-wrapper {
		position: relative;
	}

	.stripes-container {
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: 2;
	}
</style>
