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
	export let hint = undefined;
	export let checkboxBackgroundColor = jdgColors.active;
	export let checkColor = 'white';

	const checkboxSize = '1.3em';

	const checkboxWrapperCss = css`
		justify-content: ${justifyContent};
	`;

	let checkboxLabelCss = css`
		font-size: ${labelFontSize};
		line-height: normal;
		color: ${jdgColors.text};
	`;

	const checkboxInputCss = css`
		appearance: none;
		-webkit-appearance: none;
		width: ${checkboxSize};
		height: ${checkboxSize};
		border: 2px solid ${jdgColors.textLight};
		border-radius: 3px;
		background-color: white;
		cursor: pointer;
		position: relative;
		flex-shrink: 0;

		&:checked {
			background-color: ${checkboxBackgroundColor};
			border-color: ${checkboxBackgroundColor};
		}

		&:checked::after {
			content: '';
			position: absolute;
			left: 50%;
			top: 45%;
			width: 30%;
			height: 55%;
			border: solid ${checkColor};
			border-width: 0 2.5px 2.5px 0;
			transform: translate(-50%, -50%) rotate(45deg);
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
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
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<label class="checkbox-wrapper {checkboxWrapperCss}" on:click|stopPropagation>
		<input
			type="checkbox"
			bind:checked={isChecked}
			disabled={!isEnabled}
			class="checkbox {checkboxInputCss}"
		/>
		{#if showLabel}
			<span class={checkboxLabelCss}>
				{label}
			</span>
		{/if}
	</label>
	<JDGInputHint {hint} justification={justifyContent} showHintIcon={false} />
</div>

<style>
	.checkbox-container {
		display: flex;
		flex-direction: column;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 0.35em;
		cursor: pointer;
		user-select: none;
	}

	input {
		margin: 0;
	}
</style>
