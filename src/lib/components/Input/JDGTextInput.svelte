<script>
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { css } from '@emotion/css';

	export let type = 'text';
	export let isEnabled = true;
	export let inputValue = '';
	export let placeholder = undefined;
	export let fontColorOverride = undefined;
	export let fontSizeOverride = undefined;
	export let textAlignOverride = undefined;
	export let onInputFunction = (event) => {};
	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};
	export let onKeyUpFunction = (event) => {};
	/** CSS length for `border-radius` (e.g. `9999px` / `1.5rem` for a pill). Omit for square corners. */
	export let borderRadius = undefined;
	/** Font Awesome icon class suffix, e.g. `fa-magnifying-glass` (shown inside the field on the left). */
	export let leadingFaIcon = undefined;
	export let leadingFaClass = 'fa-solid fa-fw';
	/** Renders a clear control when the value is non-empty. */
	export let showClearButton = false;
	export let ariaLabel = undefined;
	/** CSS `padding` shorthand for the `<input>` (default `4px`). */
	export let inputPadding = undefined;

	const applyType = (node) => {
		node.type = type;
	};

	$: radius =
		borderRadius !== undefined && borderRadius !== null && String(borderRadius).trim() !== ''
			? borderRadius
			: '0';

	$: pad =
		inputPadding !== undefined && inputPadding !== null && String(inputPadding).trim() !== ''
			? inputPadding
			: '4px';

	$: textInputCss = css`
		min-height: 1rem;
		padding: ${pad};
		color: ${fontColorOverride ? fontColorOverride : jdgColors.text};
		font-size: ${fontSizeOverride ? fontSizeOverride : '1rem'};
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
		border-radius: ${radius};
		border: 2px solid ${jdgColors.activeSecondary};
		:hover {
			border: 2px solid ${jdgColors.active};
		}
		:focus {
			border: 2px solid ${jdgColors.active};
		}
	`;

	$: showClear = showClearButton && isEnabled && inputValue.length > 0;
	$: hasLeading = !!leadingFaIcon;

	function clearInput() {
		inputValue = '';
	}
</script>

<div
	class="input-container"
	class:has-leading-icon={hasLeading}
	class:has-clear-button={showClear}
	style="--jdg-text-input-adornment: {jdgColors.text}; --jdg-text-input-focus: {jdgColors.active};"
>
	{#if hasLeading}
		<span class="input-leading-icon" aria-hidden="true">
			<i class="{leadingFaClass} {leadingFaIcon}"></i>
		</span>
	{/if}
	<input
		type="text"
		bind:value={inputValue}
		on:input={onInputFunction}
		on:keyup={onKeyUpFunction}
		use:applyType
		use:useFunction
		class={textInputCss}
		disabled={!isEnabled}
		placeholder={placeholder ?? undefined}
		aria-label={ariaLabel}
	/>
	{#if showClear}
		<button type="button" class="input-clear" on:click={clearInput} aria-label="Clear text">
			<i class="fa-solid fa-fw fa-xmark"></i>
		</button>
	{/if}
</div>

<style>
	.input-container {
		display: flex;
		position: relative;
		align-items: center;
		width: 100%;
	}

	input {
		width: 100%;
		min-width: -webkit-fill-available;
		min-width: -moz-available;
		outline: none;
		box-sizing: border-box;
	}

	.input-container.has-leading-icon input {
		padding-left: 2rem;
	}

	.input-container.has-clear-button input {
		padding-right: 2rem;
	}

	.input-leading-icon {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		display: flex;
		align-items: center;
		color: var(--jdg-text-input-adornment, #323232);
		opacity: 0.55;
		font-size: 0.9em;
	}

	.input-clear {
		position: absolute;
		right: 0.35rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem;
		margin: 0;
		border: none;
		border-radius: 9999px;
		background: transparent;
		color: var(--jdg-text-input-adornment, #323232);
		opacity: 0.55;
		cursor: pointer;
		line-height: 1;
	}

	.input-clear:hover,
	.input-clear:focus-visible {
		opacity: 0.95;
		background: rgba(0, 0, 0, 0.06);
	}

	.input-clear:focus-visible {
		outline: 2px solid var(--jdg-text-input-focus, #0b84cb);
		outline-offset: 1px;
	}

	input:disabled {
		background-color: white;
		border: 2px solid gainsboro;
		/* Prevent iOS Safari from overriding color on disabled inputs */
		-webkit-text-fill-color: inherit;
		-webkit-opacity: 1;
		opacity: 1;
	}
</style>
