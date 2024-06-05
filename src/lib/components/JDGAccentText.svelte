<script>
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { css } from '@emotion/css';

	export let isQuote = false; // if true, more gap is used
	export let superText = undefined; // appears above the main text, like a quote segment
	export let superTextFontFamily = 'REM';
	export let superTextBold = false;
	export let primaryText = undefined; // main text in large font
	export let primaryTextFontFamily = 'REM';
	export let primaryTextBold = false;
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
	export let secondaryTextFontFamily = 'REM';
	export let secondaryTextBold = false;

	const accentTextContainerCss = css`
		gap: ${isQuote ? '0.7rem' : '0.1rem'};
	`;

	const superTextCss = css`
		font-family: ${superTextFontFamily};
		font-weight: ${superTextBold ? 'bold' : 'normal'};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondarySm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondaryMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondaryMd};
		}
	`;

	const primaryTextCss = css`
		font-family: ${primaryTextFontFamily};
		font-weight: ${primaryTextBold ? 'bold' : 'normal'};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextPrimarySm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextPrimaryMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextPrimaryLg};
		}
	`;

	const secondaryTextCss = css`
		font-family: ${secondaryTextFontFamily};
		font-weight: ${secondaryTextBold ? 'bold' : 'normal'};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondarySm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondaryMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeAccentTextSecondaryMd};
		}
	`;
</script>

<div class="jdg-accent-text-container {accentTextContainerCss}">
	{#if superText}
		<h2 class="accent-text-secondary {superTextCss}">
			{superText}
		</h2>
	{/if}
	{#if primaryText}
		<h1 class="accent-text-primary {primaryTextCss}">
			{`${primaryText}`}
		</h1>
	{/if}
	{#if secondaryText}
		<h2 class="accent-text-secondary {secondaryTextCss}">
			{secondaryText}
		</h2>
	{/if}
</div>

<style>
	.jdg-accent-text-container {
		display: flex;
		flex-direction: column;
	}

	.accent-text-primary {
		color: white;
		text-align: center;
		margin: 0;
	}

	.accent-text-secondary {
		color: white;
		text-align: center;
		margin: 0;
	}
</style>
