<script>
	import { css } from '@emotion/css';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { onMount } from 'svelte';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let backgroundColor = getAccentColors()[0];

	const accentBlockCss = css`
		background-color: ${backgroundColor};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 25px, ${jdgSizes.contentBoxFloatingMarginSm}, 25px, ${jdgSizes.contentBoxFloatingMarginSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
				padding: 25px, ${jdgSizes.contentBoxFloatingMarginMd}, 25px, ${jdgSizes.contentBoxFloatingMarginMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 25px ${jdgSizes.contentBoxFloatingMarginLg} 25px ${jdgSizes.contentBoxFloatingMarginLg};
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
