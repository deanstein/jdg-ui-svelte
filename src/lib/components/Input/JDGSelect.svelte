<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	// required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
	export let optionsGroup;
	export let inputValue;
	export let optionValueKey = 'value';
	export let optionLabelKey = 'label';
	export let isEnabled = true;
	export let textAlignOverride = undefined;

	$: selectCss = css`
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
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
		:hover:not(:disabled) {
			border: 2px solid ${jdgColors.active};
		}
		:focus:not(:disabled) {
			border: 2px solid ${jdgColors.active};
		}
		&:disabled {
			border: 2px solid gainsboro;
		}
		&:disabled:hover,
		&:disabled:focus {
			border-color: gainsboro;
		}
	`;
</script>

<div class="select-container">
	<select class={selectCss} bind:value={inputValue} on:click|stopPropagation disabled={!isEnabled}>
		{#if optionsGroup}
			{#each Object.entries(optionsGroup) as [category, items]}
				{#if items.hasOwnProperty(optionLabelKey)}
					<optgroup label={items[optionLabelKey]}>
						{#each Object.entries(items) as [itemKey, itemValue]}
							{#if itemKey !== optionLabelKey && itemValue.hasOwnProperty(optionLabelKey)}
								<option value={itemValue[optionValueKey]}>{itemValue[optionLabelKey]}</option>
							{/if}
						{/each}
					</optgroup>
				{:else}
					{#each Object.entries(items) as [itemKey, itemValue]}
						{#if itemKey !== optionLabelKey && itemValue.hasOwnProperty(optionLabelKey)}
							<option value={itemValue[optionValueKey]}>{itemValue[optionLabelKey]}</option>
						{/if}
					{/each}
				{/if}
			{/each}
		{/if}
	</select>
</div>

<style>
	.select-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	select {
		box-sizing: border-box;
		line-height: 1.25;
		height: auto;
		width: 100%;
		outline: none;
	}

	select:disabled {
		opacity: 1;
		background-color: white;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}

	.select {
		background-color: white;
	}
</style>
