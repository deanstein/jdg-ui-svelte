<script>
	import { css, keyframes } from '@emotion/css';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '../jdg-styling-constants.js';
	import { onMount } from 'svelte';
	import { getAccentColors } from '$lib/jdg-state-management.js';

	export let stripeColors = jdgColors.accentColorsJDG;
	export let stripeHeight = undefined; // if not provided, changes per breakpoint
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
		animation: ${animationDirection === 'horizontal'
				? stripeAnimationHorizontal
				: stripeAnimationVertical}
			0.3s ease-out forwards;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			height: ${stripeHeight ?? jdgSizes.horizontalStripeHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			height: ${stripeHeight ?? jdgSizes.horizontalStripeHeightMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			height: ${stripeHeight ?? jdgSizes.horizontalStripeHeightLg};
		}
	`;

	onMount(() => {
		stripeColors = getAccentColors();
	});
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
