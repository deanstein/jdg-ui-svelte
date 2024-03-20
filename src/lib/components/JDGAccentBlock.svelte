<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '../jdg-styling-constants.js';

	export let primaryText = undefined; // main content or quote
	export let secondaryText = undefined; // secondary content or quote attribution
	export let backgroundColor = jdgColors.accentStripesJDG[0];

	const accentBlockCss = css`
		background-color: ${backgroundColor};
	`;
</script>

<div class="jdg-accent-block-container {accentBlockCss}">
	{#if primaryText}
		<div class="accent-block-primary-text">
			{primaryText}
		</div>
	{/if}
	{#if secondaryText}
	<div class="accent-block-secondary-text">
		{secondaryText}
	</div>
{/if}
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
		padding: 25px;
	}

	.accent-block-primary-text {
		font-size: 3rem;
		color: white;
		text-align: center;
	}

	.accent-block-secondary-text {
		font-size: 1rem;
		color: white;
		text-align: center;
	}
</style>
