<script>
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/states/ui-state.js';

	import { jdgColors } from '../jdg-shared-styles.js';
	import {
		adjustColorForContrast,
		darkenColor,
		hexToRgb,
		lightenColor,
		rgbToHex,
		setHexColorSaturation
	} from '$lib/jdg-utils.js';

	const getDefaultBackgroundColor = () => {
		let bgColor;

		if (isPrimary && isEnabled) {
			bgColor = jdgColors.active;
		} else if (!isEnabled) {
			// disabled
			bgColor = jdgColors.disabled;
		} else {
			// secondary
			bgColor = setHexColorSaturation(lightenColor(jdgColors.active, 0.4), 20);
		}

		// ensure the background color is adjusted
		return adjustColorForContrast(bgColor, textColor, 2.5);
	};

	const getDefaultBackgroundHoverColor = () => {
		let bgColorHover;

		if (backgroundColor === 'transparent') {
			bgColorHover = rgbToHex(darkenColor(hexToRgb(getDefaultBackgroundColor()), 0.2));
		} else if (!isEnabled) {
			bgColorHover = jdgColors.disabled;
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
	export let doAdjustBackgroundColorForContrast = true;
	export let contrastRatio = 2;
	// hover color by default is a slightly darker version of the background color
	export let backgroundColorHover = getDefaultBackgroundHoverColor();
	export let fontSize = '1rem';
	export let width = 'fit-content';
	export let borderRadius = '1.5em';
	export let paddingTopBottom = '10px';
	export let paddingLeftRight = '20px';
	export let doForceSquareRatio = false;
	export let gap = '8px';
	export let tooltip = undefined;

	let buttonCss = css``; // redeefined in the reactive block

	$: {
		buttonCss = css`
			font-size: ${fontSize};
			width: ${
				width == 'fit-content'
					? 'fit-content'
					: $isMobileBreakpoint
						? '100%'
						: width /* button is 100% width on smallest breakpoint */
			};
			border-radius: ${doForceSquareRatio ? '50%' : borderRadius};
			padding: ${`${paddingTopBottom} ${paddingLeftRight} ${paddingTopBottom} ${paddingLeftRight}`};
			gap: ${gap};
			color: ${textColor};
			background-color: ${isEnabled
				? doAdjustBackgroundColorForContrast
					? adjustColorForContrast(backgroundColor, textColor, contrastRatio)
					: backgroundColor
				: jdgColors.disabled};
			:hover {
				color: ${textColorHover};
				background-color: ${isEnabled ? backgroundColorHover : jdgColors.disabled};
			}
			cursor: ${isEnabled ? 'pointer' : 'default'};
			aspect-ratio: ${doForceSquareRatio ? '1' : ''};
		`;
	}
</script>

<button
	type="button"
	on:click|stopPropagation={onClickFunction}
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
		text-wrap: balance;
	}
</style>
