<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '../jdg-styling-constants.js';

	export let blockQuote = undefined;
	export let backgroundColor = jdgColors.accentStripesJDG[0];

	const accentBlockCss = css`
		background-color: ${backgroundColor};
	`;
</script>

<div class="jdg-accent-block-container {accentBlockCss}">
	{#if blockQuote}
		<div class="jdg-accent-block-quote">
			{blockQuote}
		</div>
	{/if}
	<slot />
</div>

<style>
	.jdg-accent-block-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: -webkit-fill-available;
		width: -moz-available;
		height: 200px;
	}

	.jdg-accent-block-quote {
		font-size: 5vh;
		color: white;
		text-align: center;
	}
</style>
