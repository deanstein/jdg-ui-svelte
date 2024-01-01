<script>
	import { css, keyframes } from '@emotion/css';
	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	export let stripeColors = jdgColors.accentStripesJDG;
	export let isHovering = false;

	let fillAnimation = keyframes`
        0% { width: 0; }
        100% { width: 100%; }
    `;

	let headerStripeContainerCss = css`
		animation: ${fillAnimation} 0.5s ease-out forwards;
	`;

	let headerStripeCss = css`
		height: ${jdgSizes.headerStripeHeight};
	`;

	// Restart the animation when isHovering changes
	$: {
		if (isHovering) {
			fillAnimation = keyframes`
            0% { width: 0; }
            100% { width: 100%; }
        `;

			headerStripeContainerCss = css`
				animation: ${fillAnimation} 0.5s ease-out forwards;
			`;
		} else {
			fillAnimation = undefined;
			headerStripeContainerCss = css`
				animation: ${fillAnimation} 0.5s ease-out forwards;
			`;
		}
	}
</script>

<div class="jdg-header-stripes-container {headerStripeContainerCss}">
	{#each stripeColors as stripeColor, i}
		<div
			style:background-color={stripeColor}
			style:width={jdgSizes.horizontalStripeLengths[i]}
			class={headerStripeCss}
		/>
	{/each}
</div>

<style>
	.jdg-header-stripes-container {
		display: flex;
		flex-direction: column;
	}
</style>
