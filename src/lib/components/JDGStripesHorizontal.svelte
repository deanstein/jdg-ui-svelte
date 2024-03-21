<script>
	import { css, keyframes } from '@emotion/css';
	import { jdgColors, jdgSizes } from '../jdg-styling-constants.js';

	export let stripeColors = jdgColors.accentStripesJDG;
	export let stripeHeight = jdgSizes.horizontalStripeHeightLg;
	export let staggeredStripeWidth = false;
	export let reverseColors = false;
	export let animationDirection = 'vertical';

	let stripeAnimationVertical = keyframes`
		0% { height: 0; }
        100% { height: ${stripeHeight}}
		`;

	let stripeAnimationHorizontal = keyframes`
        0% { width: 0; }
        100% { width: 100%; }
    `;

	let stripeCss = css`
		height: ${stripeHeight};
		animation: ${animationDirection === 'horizontal' ? stripeAnimationHorizontal : stripeAnimationVertical} 0.3s ease-out forwards;
	`;
</script>

<div class="jdg-stripes-container">
	{#each reverseColors ? [...stripeColors].reverse() : stripeColors as stripeColor, i}
		<div
			style:background-color={stripeColor}
			style:width={staggeredStripeWidth ? jdgSizes.horizontalStripeLengths[i] : '100%'}
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
