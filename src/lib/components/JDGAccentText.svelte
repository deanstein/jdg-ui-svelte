<script>
	import { css } from '@emotion/css';
	import { appFontFamily } from '$lib/stores/jdg-ui-store.js';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isQuote = false; // if true, uses semantic blockquote/figure elements and more gap

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

{#if isQuote}
	<!-- Semantic quote structure with blockquote and figcaption -->
	<figure class="jdg-accent-text-container {accentTextContainerCss}">
		{#if superText}
			<p class="accent-text-super {superTextCss}">
				{@html superText}
			</p>
		{/if}
		{#if primaryText}
			<blockquote class="accent-text-primary {primaryTextCss}">
				<p>{@html primaryText}</p>
			</blockquote>
		{/if}
		{#if secondaryText}
			<figcaption class="accent-text-secondary {secondaryTextCss}">
				{@html secondaryText}
			</figcaption>
		{/if}
	</figure>
{:else}
	<!-- Non-quote callout/accent text -->
	<div class="jdg-accent-text-container {accentTextContainerCss}">
		{#if superText}
			<p class="accent-text-super {superTextCss}">
				{@html superText}
			</p>
		{/if}
		{#if primaryText}
			<p class="accent-text-primary {primaryTextCss}">
				{@html primaryText}
			</p>
		{/if}
		{#if secondaryText}
			<p class="accent-text-secondary {secondaryTextCss}">
				{@html secondaryText}
			</p>
		{/if}
	</div>
{/if}

<style>
	.jdg-accent-text-container {
		display: flex;
		flex-direction: column;
		padding: 0px 20px 0px 20px;
		/* Reset figure default margin */
		margin: 0;
	}

	.accent-text-super,
	.accent-text-primary,
	.accent-text-secondary {
		text-align: center;
		text-wrap: balance;
		margin: 0;
	}

	/* Reset blockquote default styles */
	blockquote.accent-text-primary {
		margin: 0;
		padding: 0;
	}

	blockquote.accent-text-primary p {
		margin: 0;
	}
</style>
