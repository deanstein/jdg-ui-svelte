<script>
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	// required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
	export let optionsGroup;
	export let inputValue;
	export let optionValueKey = 'value';
	export let optionLabelKey = 'label';
	export let isEnabled = true;
	export let textAlignOverride = undefined;

	const selectCss = css`
		font-size: ${jdgSizes.fontSizeBodySm};
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

<div class="select-container">
	<select class={selectCss} bind:value={inputValue} on:click|stopPropagation disabled={!isEnabled}>
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
	</select>
</div>

<style>
	.select-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	select {
		height: auto;
		width: 100%;
		outline: none;
		padding: 4px;
	}
	select:disabled {
		opacity: 1;
		background-color: white;
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		border: 2px solid transparent;
		appearance: none;
	}

	.select {
		background-color: white;
	}
</style>
