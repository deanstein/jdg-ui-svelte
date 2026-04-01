<script>
	import { css } from '@emotion/css';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = undefined;
	export let onInputFunction = undefined;

	$: datePickerCss = css`
		color: ${jdgColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeMobile};
			padding: ${jdgSizes.inputPaddingMobileTablet};
			min-height: ${jdgSizes.inputMinHeightMobile};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeTablet};
			padding: ${jdgSizes.inputPaddingMobileTablet};
			min-height: ${jdgSizes.inputMinHeightDesktop};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeDesktop};
			padding: ${jdgSizes.inputPaddingDesktop};
			min-height: ${jdgSizes.inputMinHeightDesktop};
		}
		border: 2px solid ${jdgColors.activeSecondary};
		:hover {
			border: 2px solid ${jdgColors.active};
		}
		:focus {
			border: 2px solid ${jdgColors.active};
		}
	`;
</script>

<div class="date-picker-container">
	<input
		type="date"
		disabled={!isEnabled}
		bind:value={inputValue}
		on:input={onInputFunction}
		class="date-picker {datePickerCss}"
	/>
</div>

<style>
	.date-picker-container {
		display: flex;
	}

	.date-picker {
		box-sizing: border-box;
		width: 100%;
		outline: none;
		line-height: 1.25;
		font-family: sans-serif;
	}

	input:disabled {
		background-color: white;
		border: 2px solid gainsboro;
	}
</style>
