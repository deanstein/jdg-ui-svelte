<script>
	import { css } from '@emotion/css';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let isEnabled = true;
	export let inputValue = ''; // Stores the value (key) or custom string
	export let options = []; // Array of { value, label }
	export let placeholder = 'Type or select...';
	export let fontColorOverride = undefined;
	export let fontSizeOverride = undefined;
	export let textAlignOverride = undefined;

	let showDropdown = false;
	let inputElement;
	let highlightedIndex = -1;
	let displayValue = ''; // What's shown in the input field (label or custom text)
	let isUserTyping = false; // Track if user is actively typing

	// Get the label for a given value, or return the value if it's not in options (custom)
	function getLabelForValue(value) {
		if (!value) return '';
		const option = options.find((opt) => opt.value === value);
		return option ? option.label : value;
	}

	// Get the value for a given label, or return the label if it's not in options (custom)
	function getValueForLabel(label) {
		if (!label) return '';
		const option = options.find((opt) => opt.label === label);
		return option ? option.value : label;
	}

	// Initialize displayValue from inputValue on mount
	$: if (!isUserTyping) {
		displayValue = getLabelForValue(inputValue);
	}

	// Filter options based on current display input
	$: filteredOptions = displayValue
		? options.filter((opt) => opt.label.toLowerCase().includes(displayValue.toLowerCase()))
		: options;

	// Reset highlighted index when filtered options change
	$: if (filteredOptions) {
		highlightedIndex = -1;
	}

	function selectOption(option) {
		isUserTyping = false; // User selected, not typing
		inputValue = option.value; // Store the value (key)
		displayValue = option.label; // Update display
		showDropdown = false;
		highlightedIndex = -1;
	}

	function handleInput(event) {
		isUserTyping = true;
		const newDisplayValue = event.target.value;
		displayValue = newDisplayValue;
		// Convert display value back to stored value
		inputValue = getValueForLabel(newDisplayValue);
		// Reset typing flag after a short delay to allow external updates
		setTimeout(() => {
			isUserTyping = false;
		}, 100);
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
		bind:value={displayValue}
		on:input={handleInput}
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
					role="option"
					aria-selected={index === highlightedIndex}
					class:highlighted={index === highlightedIndex}
				>
					<button
						type="button"
						class="option-button"
						on:mousedown={() => selectOption(option)}
						on:mouseenter={() => (highlightedIndex = index)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								selectOption(option);
							}
						}}
					>
						{option.label}
					</button>
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
		padding: 0;
		cursor: pointer;
	}

	.dropdown li .option-button {
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		text-align: left;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}

	.dropdown li:hover .option-button,
	.dropdown li.highlighted .option-button {
		background: #f0f0f0;
	}
</style>
