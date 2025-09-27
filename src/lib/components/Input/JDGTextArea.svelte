<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = '';
	export let resizable = 'none'; // none, vertical, horizontal, or both
	export let minHeight = '100px';

	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};

	let textArea;

	const textInputCss = css`
		border: 2px solid ${jdgColors.active};
		resize: ${resizable};
		min-height: ${minHeight};
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
		class={textInputCss}
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

	textarea {
		height: min-content;
		width: 100%;
		outline: none;
		padding: 4px;
		max-width: 100%;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		white-space: nowrap;
	}

	textarea:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
