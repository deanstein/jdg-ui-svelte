<script>
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import JDGInputHint from './JDGInputHint.svelte';

	export let showLabel = true;
	export let label = 'Checkbox label';
	export let labelFontSize = jdgSizes.fontSizeBodySm;
	export let justifyContent = 'left';
	export let isChecked = false;
	export let isEnabled = true;
	export let onCheckAction = () => {};
	export let onUncheckAction = () => {};
	// Optional hint text
	export let hint = undefined;

	const checkboxWrapperCss = css`
		justify-content: ${justifyContent};
	`;

	let checkboxLabelCss = css`
		font-size: ${labelFontSize};
		line-height: normal;
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

<div class="checkbox-container">
	<div class="checkbox-wrapper {checkboxWrapperCss}">
		<input type="checkbox" bind:checked={isChecked} disabled={!isEnabled} class="checkbox" />
		{#if showLabel}
			<div class={checkboxLabelCss}>
				{label}
			</div>
		{/if}
	</div>
	<JDGInputHint {hint} justification={justifyContent} />
</div>

<style>
	.checkbox-container {
		display: flex;
		flex-direction: column;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 0.1vw;
	}

	input {
		margin-left: 0;
	}
</style>
