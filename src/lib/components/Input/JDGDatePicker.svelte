<script>
	import { css } from '@emotion/css';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = undefined;
	export let onInputFunction = undefined;

	let datePickerCss = css`
		font-size: ${jdgSizes.fontSizeBodySm};
		color: ${jdgColors.text};
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

	input {
		width: 100%;
		outline: none;
		padding: 4px;
		font-family: sans-serif;
	}

	input:disabled {
		background-color: white;
		border: 2px solid gainsboro;
	}
</style>
