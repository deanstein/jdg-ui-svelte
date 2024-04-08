<script>
	import { css } from '@emotion/css';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { onMount } from 'svelte';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let backgroundColor = getAccentColors()[0];

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

<div class="jdg-accent-block-container {accentBlockCss}">
	<slot />
</div>

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
