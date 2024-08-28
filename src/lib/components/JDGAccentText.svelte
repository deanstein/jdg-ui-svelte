<script>
	import { jdgBreakpoints, jdgColors, jdgFonts, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { css } from '@emotion/css';

	export let isQuote = false; // if true, more gap is used
	export let superText = undefined; // appears above the main text, like a quote segment
	export let superTextFontFamily = jdgFonts.body;
	export let superTextBold = false;
	export let primaryText = undefined; // main text in large font
	export let primaryTextFontFamily = jdgFonts.body;
	export let primaryTextBold = false;
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
	export let secondaryTextFontFamily = jdgFonts.body;
	export let secondaryTextBold = false;
	export let textColor = jdgColors.textDm;

	const accentTextContainerCss = css`
		gap: ${isQuote ? '0.7rem' : '0.1rem'};
	`;

	const superTextCss = css`
		font-family: ${superTextFontFamily};
		font-weight: ${superTextBold ? 'bold' : 'normal'};
		color: ${textColor};
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
		color: ${textColor};
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
		color: ${textColor};
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
		<h2 class="accent-text-super {superTextCss}">
			{@html superText}
		</h2>
	{/if}
	{#if primaryText}
		<h1 class="accent-text-primary {primaryTextCss}">
			{@html `${primaryText}`}
		</h1>
	{/if}
	{#if secondaryText}
		<h2 class="accent-text-secondary {secondaryTextCss}">
			{@html secondaryText}
		</h2>
	{/if}
</div>

<style>
	.jdg-accent-text-container {
		display: flex;
		flex-direction: column;
		padding: 0px 20px 0px 20px;
	}

	.accent-text-primary,
	.accentTextSuper,
	.accent-text-secondary {
		text-align: center;
		text-wrap: balance;
		margin: 0;
	}
</style>
