<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = '';
	export let resizable = 'none'; // none, vertical, horizontal, or both
	export let minHeight = '100px';

	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};

	let textArea;

	$: textAreaCss = css`
		resize: ${resizable};
		min-height: ${minHeight};
		color: ${jdgColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeMobile};
			padding: ${jdgSizes.inputPaddingMobileTablet};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeTablet};
			padding: ${jdgSizes.inputPaddingMobileTablet};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.inputFontSizeDesktop};
			padding: ${jdgSizes.inputPaddingDesktop};
		}
		border: 2px solid ${jdgColors.activeSecondary};
		:hover {
			border: 2px solid ${jdgColors.active};
		}
		:focus {
			border: 2px solid ${jdgColors.active};
		}
	`;

	const autoGrow = (textArea) => {
		if (!textArea) return;
		textArea.style.height = 'auto'; // Reset height
		textArea.style.height = textArea.scrollHeight + 'px'; // Set to scrollHeight
	};

	onMount(() => {
		autoGrow(textArea);
	});
</script>

<div class="input-container">
	<textarea
		bind:value={inputValue}
		bind:this={textArea}
		use:useFunction
		class="jdg-textarea-field {textAreaCss}"
		disabled={!isEnabled}
		on:blur={() => autoGrow(textArea)}
		on:input={() => autoGrow(textArea)}
	/>
</div>

<style>
	.input-container {
		display: flex;
		height: 100%;
	}

	.jdg-textarea-field {
		box-sizing: border-box;
		width: 100%;
		height: min-content;
		outline: none;
		max-width: 100%;
		line-height: 1.25;
	}

	.jdg-textarea-field:disabled {
		background-color: white;
		border: 2px solid gainsboro;
		-webkit-opacity: 1;
		opacity: 1;
	}
</style>
