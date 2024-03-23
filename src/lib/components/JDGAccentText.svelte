<script>
	import { css } from '@emotion/css';

	export let superText = undefined; // appears above the main text, like a quote segment
	export let superTextFontFamily = 'REM';
	export let primaryText = 'Accent text'; // main text in large font
	export let primaryTextFontFamily = 'REM';
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
	export let secondaryTextFontFamily = 'REM';

	const superTextCss = css`
		font-family: ${superTextFontFamily};
	`;
	const primaryTextCss = css`
		font-family: ${primaryTextFontFamily};
	`;
	const secondaryTextCss = css`
		font-family: ${secondaryTextFontFamily};
	`;
</script>

<div class="jdg-accent-text-container">
	{#if superText}
		<div class="accent-text-secondary {superTextCss}">
			{superText}
		</div>
	{/if}
	<div class="accent-text-primary {primaryTextCss}">
		{`${primaryText}`}
	</div>
	{#if secondaryText}
		<div class="accent-text-secondary {secondaryTextCss}">
			{secondaryText}
		</div>
	{/if}
</div>

<style>
	.jdg-accent-text-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.accent-text-primary {
		font-size: 3rem;
		color: white;
		text-align: center;
	}

	.accent-text-secondary {
		font-size: 1.5rem;
		color: white;
		text-align: center;
	}
</style>
