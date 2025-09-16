<script>
	import { css } from '@emotion/css';
	import { appFontFamily } from '$lib/stores/jdg-ui-store.js';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isQuote = false; // if true, more gap is used

	// supertext: appears above the primary text
	// can be used as an intro to the primary text
	export let superText = undefined;
	export let superTextFontFamily = $appFontFamily;
	export let superTextBold = false;

	// primary text: the largest text in the center
	export let primaryText = undefined; // main text in large font
	export let primaryTextFontFamily = $appFontFamily;
	export let primaryTextBold = false;

	// secondary text: the text below the main text
	// can be used for things like quote attributions
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
	export let secondaryTextFontFamily = $appFontFamily;
	export let secondaryTextBold = false;
	export let textColor = jdgColors.textDm;

	const accentTextContainerCss = css`
		gap: ${isQuote ? '0.7rem' : '0.2rem'};
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

	.accent-text-super,
	.accent-text-primary,
	.accent-text-secondary {
		text-align: center;
		text-wrap: balance;
		margin: 0;
	}
</style>
