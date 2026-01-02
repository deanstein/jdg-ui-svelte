<script>
	import { css } from '@emotion/css';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = '';
	export let options = []; // Array of { value, label }
	export let placeholder = 'Type or select...';
	export let fontColorOverride = undefined;
	export let fontSizeOverride = undefined;
	export let textAlignOverride = undefined;

	let showDropdown = false;
	let inputElement;
	let highlightedIndex = -1;

	// Filter options based on current input
	$: filteredOptions = inputValue
		? options.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()))
		: options;

	// Reset highlighted index when filtered options change
	$: if (filteredOptions) {
		highlightedIndex = -1;
	}

	function selectOption(option) {
		inputValue = option.label;
		showDropdown = false;
		highlightedIndex = -1;
	}

	function handleFocus() {
		if (isEnabled) showDropdown = true;
	}

	function handleBlur() {
		// Delay to allow click on option
		setTimeout(() => {
			showDropdown = false;
			highlightedIndex = -1;
		}, 150);
	}

	function handleKeydown(event) {
		if (!showDropdown || filteredOptions.length === 0) return;

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				highlightedIndex = Math.min(highlightedIndex + 1, filteredOptions.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				highlightedIndex = Math.max(highlightedIndex - 1, 0);
				break;
			case 'Enter':
				event.preventDefault();
				if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					selectOption(filteredOptions[highlightedIndex]);
				}
				break;
			case 'Escape':
				showDropdown = false;
				highlightedIndex = -1;
				break;
		}
	}

	const inputCss = css`
		min-height: 1rem;
		color: ${fontColorOverride ? fontColorOverride : jdgColors.text};
		font-size: ${fontSizeOverride ? fontSizeOverride : '1rem'};
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
		border: 2px solid ${jdgColors.activeSecondary};
		:hover {
			border: 2px solid ${jdgColors.active};
		}
		:focus {
			border: 2px solid ${jdgColors.active};
		}
	`;
</script>

<div class="combobox-container">
	<input
		type="text"
		bind:this={inputElement}
		bind:value={inputValue}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:keydown={handleKeydown}
		class={inputCss}
		disabled={!isEnabled}
		{placeholder}
	/>
	{#if showDropdown && filteredOptions.length > 0 && isEnabled}
		<ul class="dropdown">
			{#each filteredOptions as option, index}
				<li
					class:highlighted={index === highlightedIndex}
					on:mousedown={() => selectOption(option)}
					on:mouseenter={() => (highlightedIndex = index)}
				>
					{option.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.combobox-container {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	input {
		width: 100%;
		box-sizing: border-box;
		outline: none;
		padding: 4px;
	}

	input:disabled {
		background-color: white;
		border: 2px solid gainsboro;
		/* Prevent iOS Safari from overriding color on disabled inputs */
		-webkit-text-fill-color: inherit;
		-webkit-opacity: 1;
		opacity: 1;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		max-height: 200px;
		overflow-y: auto;
		z-index: 100;
		list-style: none;
		margin: 0;
		padding: 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.dropdown li {
		padding: 8px 12px;
		cursor: pointer;
	}

	.dropdown li:hover,
	.dropdown li.highlighted {
		background: #f0f0f0;
	}
</style>

