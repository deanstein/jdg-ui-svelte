<script>
	import { css, keyframes } from '@emotion/css';
	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	export let stripeColors = jdgColors.accentStripesJDG;
    export let reverseColors = false;

	let headerStripeContainerAnimation = keyframes`
        0% { width: 0; }
        100% { width: 100%; }
    `;

	let headerStripeContainerCss = css`
		animation: ${headerStripeContainerAnimation} 0.5s ease-out forwards;
	`;

	let headerStripeCss = css`
		height: ${jdgSizes.headerStripeHeight};
	`;
</script>

<div class="jdg-header-stripes-container {headerStripeContainerCss}">
	{#each reverseColors ? stripeColors.reverse() : stripeColors as stripeColor, i}
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
