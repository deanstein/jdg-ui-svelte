<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { JDGAnimateOnVisible } from '$lib/index.js';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let backgroundColor = getAccentColors()[0];
	export let animatableElementRef;

	const accentBlockCss = css`
		background-color: ${backgroundColor};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 30px ${jdgSizes.bodyCopyVerticalPaddingSm} 30px ${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 40px ${jdgSizes.bodyCopyVerticalPaddingMd} 40px ${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 50px ${jdgSizes.bodyCopyVerticalPaddingLg} 50px ${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;

	onMount(() => {
		backgroundColor = getAccentColors()[0];
	});
</script>

	<div bind:this={animatableElementRef} class="jdg-accent-block-container {accentBlockCss}">
		<slot />
	</div>
	<JDGAnimateOnVisible animatableElement={animatableElementRef}/>

<style>
	.jdg-accent-block-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
	}
</style>
