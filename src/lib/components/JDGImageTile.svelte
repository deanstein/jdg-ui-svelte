<script>
	import { css } from '@emotion/css';

	import { setImageDetailAttributes, setShowImageDetailModal } from '$lib/jdg-state-management.js';

	import { instantiateObject } from './../jdg-utils.js';

	import jdgImageAttributes from '../schemas/jdg-image-attributes.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGStripesHorizontal } from '../index.js';
	import { fadeAndScale, verticalSlide } from '$lib/jdg-graphics-factory.js';
	import { jdgColors, jdgSizes, jdgDurations, jdgBreakpoints } from '../jdg-styling-constants.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes); // one object to hold all details
	export let maxWidth = undefined; // if not defined, takes available space
	export let maxHeight = '300px';
	export let fillContainer = true; // if true, image may be cropped to fill container in both axes
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let label = undefined;
	export let labelJustification = 'left';
	export let labelContainerVerticalAlign = 'bottom';
	export let href = undefined;
	export let onClickFunction = undefined;
	export let showHorizontalStripesOnHover = true;
	export let showCaption = false;
	export let showAttribution = false;

	const showImageDetailModal = () => {
		setShowImageDetailModal(true);
		setImageDetailAttributes(imageAttributes);
	};

	let isHovering;
	let alternateFitRef; // use this div to determine aspect ratios

	const aCss = css`
		display: ${fillContainer ? 'initial' : 'flex'};
	`;

	const imageTileCss = css`
		width: ${showBlurInUnfilledSpace ? '100%' : 'auto'};
	`;

	const imageTileLabelContainerCss = css`
		color: ${jdgColors.text};
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
		${labelContainerVerticalAlign === 'center'
			? `top: 50%;
		transform: translate(0, -50%);`
			: `${labelContainerVerticalAlign}: 0;`};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 8px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 10px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 12px;
		}
	`;

	const imageTileLabelCss = css`
		text-align: ${labelJustification};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 12px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 14px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 16px;
		}
	`;
</script>

<div class="jdg-image-tile-container">
	<a bind:this={alternateFitRef} {href} class={aCss}>
		<div
			class="image-tile {imageTileCss}"
			on:mouseenter={() => (isHovering = true)}
			on:mouseleave={() => (isHovering = false)}
			role="button"
			tabindex="0"
			on:click={() => {
				// if provided, use the onclick prop
				if (onClickFunction) {
					onClickFunction();
				} else if (href) {
					// if href is provided, do nothing
				} else {
					// otherwise, the default behavior is to show image detail modal
					showImageDetailModal();
				}
				// in any case, ensure the hover goes away eventually
				setTimeout(() => {
					isHovering = false;
				}, 600);
			}}
			on:keypress={() => {}}
			transition:fadeAndScale={{ duration: jdgDurations.default }}
		>
			{#if label}
				<div class="image-tile-label-container {imageTileLabelContainerCss}">
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
				{alternateFitRef}
				{imageAttributes}
				showHoverEffect={true}
				{isHovering}
				{fillContainer}
				{showBlurInUnfilledSpace}
				showCaption={showCaption && !showBlurInUnfilledSpace}
				showAttribution={showAttribution && !showBlurInUnfilledSpace}
			/>
		</div>
	</a>
	{#if (showCaption || showAttribution) && (fillContainer || showBlurInUnfilledSpace)}
		<div class="image-caption-attribution-wrapper">
			<JDGImageCaptionAttribution {imageAttributes} {showCaption} {showAttribution} />
		</div>
	{/if}
</div>

<style>
	/* ignore the global a styles */
	a::before,
	a:hover::before {
		all: unset;
	}

	a {
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

	.image-tile:hover {
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.image-tile:active {
		transform: scale(0.98);
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.image-tile-label-container {
		position: absolute;
		width: -webkit-fill-available;
		width: -moz-available;
		font-weight: bold;
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
