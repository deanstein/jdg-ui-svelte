<script>
	import { css } from '@emotion/css';

	import jdgImageAttributes from '../schemas/jdg-image-attributes.js';

	import { instantiateObject } from './../jdg-utils.js';

	import { JDGImage, JDGStripesHorizontal } from '../index.js';
	import { fadeAndScale, verticalSlide } from '$lib/jdg-graphics-factory.js';
	import { jdgColors, jdgSizes, jdgDurations } from '../jdg-styling-constants.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes); // one object to hold all details
	export let maxWidth = undefined; // if not defined, takes available space
	export let maxHeight = '300px';
	export let fillContainer = true; // if true, image may be cropped to fill container in both axes
	export let showBlurInUnfilledSpace = false; // if true, shows the image blurred in the unfilled space - only applies if fillContainer is false
	export let label = undefined;
	export let labelJustification = 'left';
	export let labelContainerVerticalAlign = 'bottom';
	export let href = undefined;
	export let onClickFunction = () => {};
	export let showHorizontalStripesOnHover = true;

	let isHovering;

	const aCss = css`
		display: ${fillContainer ? 'relative' : 'flex'};
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
			: `${labelContainerVerticalAlign}: 0;`}
	`;

	const imageTileLabelCss = css`
		font-size: ${jdgSizes.fontSizeImageTileLabel};
		text-align: ${labelJustification};
	`;
</script>

<a {href} class={aCss}>
	<div
		class="jdg-image-tile {imageTileCss}"
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}
		role="button"
		tabindex="0"
		on:click={onClickFunction}
		on:keypress={() => {}}
		transition:fadeAndScale={{ duration: jdgDurations.default }}
	>
		{#if label}
			<div class="jdg-image-tile-label-container {imageTileLabelContainerCss}">
				<div class="jdg-image-tile-label {imageTileLabelCss}">
					{label}
				</div>
			</div>
		{/if}
		{#if isHovering && showHorizontalStripesOnHover}
			<div class="stripes-container" transition:verticalSlide={{ duration: jdgDurations.default }}>
				<JDGStripesHorizontal stripeHeight="3px" staggeredStripeWidth={false} />
			</div>
		{/if}
		<JDGImage
			{maxHeight}
			{maxWidth}
			{imageAttributes}
			showHoverEffect={true}
			{fillContainer}
			{showBlurInUnfilledSpace}
		/>
	</div>
</a>

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

	.jdg-image-tile {
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
	}

	.jdg-image-tile:hover {
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.jdg-image-tile:active {
		transform: scale(0.98);
		box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
	}

	.jdg-image-tile-label-container {
		position: absolute;
		padding: 15px;
		width: -webkit-fill-available;
		width: -moz-available;
		font-weight: bold;
		z-index: 1;
		pointer-events: none;
	}

	.stripes-container {
		position: absolute;
		bottom: 0;
		width: 100%;
		z-index: 2;
	}
</style>
