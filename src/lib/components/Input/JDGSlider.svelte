<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-shared-styles.js';

	export let value = 0;
	export let min = 0;
	export let max = 1;
	export let step = 0.01;
	export let showLabel = true;
	export let label = 'Slider';
	export let labelFontSize = '14px';
	export let onChange = (newValue) => {};
	export let isEnabled = true;
	export let sliderId = undefined;

	let uniqueId = `slider-${Math.random().toString(36).substr(2, 9)}`;
	$: effectiveId = sliderId || uniqueId;

	const sliderWrapperCss = css`
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px 0;
		min-width: 200px;
	`;

	let sliderLabelCss = css`
		font-size: ${labelFontSize};
		color: #333;
		font-weight: 500;
	`;

	const handleInput = (event) => {
		const newValue = parseFloat(event.target.value);
		value = newValue;
		onChange(newValue);
	};
</script>

<div class="slider-wrapper {sliderWrapperCss}">
	{#if showLabel}
		<label for={effectiveId} class={sliderLabelCss}>
			{label}
		</label>
	{/if}
	<input
		id={effectiveId}
		type="range"
		{min}
		{max}
		{step}
		bind:value
		on:input={handleInput}
		disabled={!isEnabled}
		class="slider"
	/>
</div>

<style>
	.slider {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #ddd;
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
	}

	.slider:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #4a90e2;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: box-shadow 0.2s ease;
	}

	.slider:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	.slider::-moz-range-thumb {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #4a90e2;
		cursor: pointer;
		border: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: box-shadow 0.2s ease;
	}

	.slider:disabled::-moz-range-thumb {
		cursor: not-allowed;
	}

	.slider:focus {
		outline: none;
	}

	.slider:focus::-webkit-slider-thumb {
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
	}

	.slider:focus::-moz-range-thumb {
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
	}
</style>

