<script>
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes, jdgDurations } from '../jdg-styling-constants.js';

	import { JDGStripesHorizontal } from '../index.js';

	import { scale } from 'svelte/transition';

	export let nHeight = jdgSizes.nImageHeightSm;
	export let heightUnit = jdgSizes.imageHeightUnit;
	export let aspectRatio = null; // if not defined, tile will fill available space
	export let objectFit = 'cover';
	export let label = undefined;
	export let labelJustification = 'left';
	export let labelContainerVerticalAlign = 'bottom';
	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg';
	export let imgAlt = 'Image Tile';
	export let href = undefined;
	export let onClickFunction = () => {};
	export let showHorizontalStripesOnHover = true;

	let isHovering;

	const aCss = css`
		display: ${aspectRatio ? 'flex' : 'auto'};
	`;

	const imageTileCss = css`
		height: ${nHeight.toString() + heightUnit};
		width: ${aspectRatio ? (nHeight * aspectRatio).toString() + heightUnit : 'auto'};
	`;

	const imgCss = css`
		object-fit: ${objectFit};
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

	const fadeAndScale = (node, { delay = 0, duration = 300 }) => {
		return {
			delay,
			duration,
			css: (t, u) => `
        opacity: ${fade(node, { duration }).css(t, u)};
        transform: ${scale(node, { duration }).css(t, u)};
      `,
			easing: cubicOut
		};
	};

	function verticalSlide(node, { delay = 0, duration = 300 }) {
		return {
			delay,
			duration,
			css: (t) => `transform: translateY(${(1 - t) * 100}%);`,
			easing: cubicOut
		};
	}
</script>

<a {href} class={aCss}>
	<div
		class="jdg-image-tile {imageTileCss}"
		on:mouseenter={() => (isHovering = true)}
		on:mouseleave={() => (isHovering = false)}
		role="button"
		tabindex="0"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
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
			<div class="stripes-container" transition:verticalSlide={{ duration: 300 }}>
				<JDGStripesHorizontal stripeHeight="3px" staggeredStripeWidth={false} />
			</div>
		{/if}
		<img class={imgCss} src={imgSrc} alt={imgAlt} />
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
	}

	.stripes-container {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	img {
		height: 100%;
		width: 100%;
		transition: transform 0.3s ease-in-out;
		z-index: -1;
	}

	.jdg-image-tile:hover img {
		transform: scale(1.04); /* Scale the image up to create a zoom effect */
	}
</style>
