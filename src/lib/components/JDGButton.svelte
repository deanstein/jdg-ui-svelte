<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	import { jdgColors } from '../jdg-shared-styles.js';
	import { adjustColorForContrast, darkenColor, hexToRgb, rgbToHex } from '$lib/jdg-utils.js';

	const primaryButtonBackgroundColor = '#0B84CB';
	const secondaryButtonBackgroundColor = '#7a9eb3';
	const disabledButtonBackgroundColor = '#B5B5B5';

	const getDefaultBackgroundColor = () => {
		let bgColor;

		if (isPrimary && isEnabled) {
			bgColor = primaryButtonBackgroundColor;
		} else if (!isEnabled) {
			// disabled
			bgColor = disabledButtonBackgroundColor;
		} else {
			// secondary
			bgColor = secondaryButtonBackgroundColor;
		}

		// ensure the background color is adjusted
		return adjustColorForContrast(bgColor, textColor, 2.5);
	};

	const getDefaultBackgroundHoverColor = () => {
		let bgColorHover;

		if (backgroundColor === 'transparent') {
			bgColorHover = rgbToHex(darkenColor(hexToRgb(getDefaultBackgroundColor()), 0.2));
		} else if (!isEnabled) {
			bgColorHover = disabledButtonBackgroundColor;
		} else {
			bgColorHover = darkenColor(backgroundColor, 0.2);
		}

		return adjustColorForContrast(bgColorHover, textColor, 2.5);
	};

	export let label = 'This is a button'; // set null if no label is desired
	export let faClass = 'fa-solid';
	export let faIcon = 'fa-circle-info'; // set null if no icon is desired
	export let isEnabled = true;
	export let isPrimary = true;
	export let onClickFunction;
	export let textColor = jdgColors.textDm;
	export let textColorHover = jdgColors.textDm;
	export let backgroundColor = getDefaultBackgroundColor();
	// hover color by default is a slightly darker version of the background color
	export let backgroundColorHover = getDefaultBackgroundHoverColor();
	export let fontSize = '1rem';
	export let width = 'max-content';
	export let borderRadius = '1.5em';
	export let paddingTopBottom = '10px';
	export let paddingLeftRight = '20px';
	export let gap = '8px';
	export let tooltip = undefined;

	let buttonCss = css``; // redeefined in the reactive block

	$: {
		buttonCss = css`
			font-size: ${fontSize};
			width: ${
				width == 'max-content'
					? 'max-content'
					: $uiState.isMobileBreakpoint
						? '100%'
						: width /* button is 100% width on smallest breakpoint */
			};
			border-radius: ${borderRadius};
			padding: ${`${paddingTopBottom} ${paddingLeftRight} ${paddingTopBottom} ${paddingLeftRight}`};
			gap: ${gap};
			color: ${textColor};
			background-color: ${isEnabled ? backgroundColor : disabledButtonBackgroundColor};
			:hover {
				color: ${textColorHover};
				background-color: ${isEnabled ? backgroundColorHover : disabledButtonBackgroundColor};
			}
			cursor: ${isEnabled ? 'pointer' : 'default'};
		`;
	}
</script>

<button
	type="button"
	on:click={onClickFunction}
	disabled={!isEnabled}
	title={tooltip ?? ''}
	class="jdg-button {buttonCss}"
>
	{#if faIcon !== null}
		<i class="{faClass} {faIcon}" />
	{/if}
	{#if label !== null}
		{label}
	{/if}
</button>

<style>
	.jdg-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		outline: none;
		font-weight: bold;
	}
</style>
