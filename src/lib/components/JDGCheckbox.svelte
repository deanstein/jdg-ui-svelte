<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-shared-styles.js';

	export let showLabel = true;
	export let label = 'Checkbox label';
	export let labelFontSize = '14px';
	export let isChecked = false;
	export let isEnabled = true;
	export let onCheckAction = () => {};
	export let onUncheckAction = () => {};

	let checkboxLabelCss = css`
		font-size: ${labelFontSize};
		color: ${jdgColors.text};
	`;

	$: {
		if (isChecked && onCheckAction) {
			onCheckAction();
		} else if (onUncheckAction) {
			onUncheckAction();
		}
	}
</script>

<div class="checkbox-wrapper">
	<input type="checkbox" bind:checked={isChecked} disabled={!isEnabled} class="checkbox" />
	{#if showLabel}
		<div class={checkboxLabelCss}>
			{label}
		</div>
	{/if}
</div>

<style>
	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 0.1vw;
	}

	input {
		margin-left: 0;
	}
</style>
