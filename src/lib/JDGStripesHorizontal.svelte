<script>
	import { css, keyframes } from '@emotion/css';
	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	export let stripeColors = jdgColors.accentStripesJDG;
    export let stripeHeight = jdgSizes.horizontalStripeHeight;
	export let reverseColors = false;

	let stripeContainerAnimation = keyframes`
        0% { width: 0; }
        100% { width: 100%; }
    `;

	let stripeContainerCss = css`
		animation: ${stripeContainerAnimation} 0.5s ease-out forwards;
	`;

	let stripeCss = css`
		height: ${stripeHeight};
	`;
</script>

<div class="jdg-stripes-container {stripeContainerCss}">
	{#each reverseColors ? stripeColors.reverse() : stripeColors as stripeColor, i}
		<div
			style:background-color={stripeColor}
			style:width={jdgSizes.horizontalStripeLengths[i]}
			class={stripeCss}
		/>
	{/each}
</div>

<style>
	.jdg-stripes-container {
		display: flex;
		flex-direction: column;
	}
</style>
