<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

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

	const applyType = (node) => {
		node.type = type;
	};

	$: radius =
		borderRadius !== undefined && borderRadius !== null && String(borderRadius).trim() !== ''
			? borderRadius
			: '0';

	/** Border, uniform padding, and min-height on the shell so icon/clear do not need extra input padding. */
	$: fieldShellCss = css`
		border-radius: ${radius};
		border: 2px solid ${isEnabled ? jdgColors.activeSecondary : 'gainsboro'};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.inputPaddingMobileTablet};
			min-height: ${jdgSizes.inputMinHeightMobile};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${jdgSizes.inputPaddingMobileTablet};
			min-height: ${jdgSizes.inputMinHeightDesktop};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.inputPaddingDesktop};
			min-height: ${jdgSizes.inputMinHeightDesktop};
		}
		${isEnabled
			? `
			&:hover {
				border-color: ${jdgColors.active};
			}
			&:focus-within {
				border-color: ${jdgColors.active};
			}
		`
			: ''}
	`;

	$: innerInputCss = css`
		color: ${fontColorOverride ? fontColorOverride : jdgColors.text};
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
		${fontSizeOverride
			? `font-size: ${fontSizeOverride};`
			: `
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				font-size: ${jdgSizes.inputFontSizeMobile};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				font-size: ${jdgSizes.inputFontSizeTablet};
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				font-size: ${jdgSizes.inputFontSizeDesktop};
			}
		`}
	`;

	$: showClear = showClearButton && isEnabled && inputValue.length > 0;
	$: hasLeading = !!leadingFaIcon;

	function clearInput() {
		inputValue = '';
	}
</script>

<div
	class="text-input-shell input-container {fieldShellCss}"
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
		class="text-input-field {innerInputCss}"
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
	.text-input-shell {
		display: flex;
		flex-direction: row;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		min-width: 0;
		gap: 0.35rem;
		background-color: white;
	}

	.text-input-field {
		flex: 1 1 auto;
		min-width: 0;
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		outline: none;
		background: transparent;
		line-height: 1.25;
	}

	.text-input-field:disabled {
		background-color: transparent;
		-webkit-text-fill-color: inherit;
		-webkit-opacity: 1;
		opacity: 1;
	}

	.input-leading-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		color: var(--jdg-text-input-adornment, #323232);
		opacity: 0.55;
		font-size: 0.9em;
		pointer-events: none;
	}

	.input-clear {
		flex-shrink: 0;
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
</style>
