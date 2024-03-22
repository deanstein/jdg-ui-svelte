<script>
	import { css } from '@emotion/css';

	export let superText = undefined; // appears above the main text, like a quote segment
	export let primaryText = 'Accent text'; // main text in large font
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
</script>

<div class="jdg-accent-text-container">
	{#if superText}
		<div class="accent-text-secondary">
			{superText}
		</div>
	{/if}
	<div class="accent-text-primary">
		{`${primaryText}`}
	</div>
	{#if secondaryText}
		<div class="accent-text-secondary">
			{secondaryText}
		</div>
	{/if}
</div>

<style>
	.jdg-accent-text-container {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.accent-text-primary {
		font-size: 3rem;
		color: white;
		text-align: center;
	}

	.accent-text-secondary {
		font-size: 1.25rem;
		color: white;
		text-align: center;
	}
</style>
