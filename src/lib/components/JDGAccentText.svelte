<script>
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { css } from '@emotion/css';

	export let superText = undefined; // appears above the main text, like a quote segment
	export let superTextFontFamily = 'REM';
	export let primaryText = 'Accent text'; // main text in large font
	export let primaryTextFontFamily = 'REM';
	export let secondaryText = undefined; // appears below the main text, like a quote attribution
	export let secondaryTextFontFamily = 'REM';

	const superTextCss = css`
		font-family: ${superTextFontFamily};
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
		color: white;
		text-align: center;
	}

	.accent-text-secondary {
		color: white;
		text-align: center;
	}
</style>
