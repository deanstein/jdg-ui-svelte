<script>
	import { css } from '@emotion/css';

	import { appFontFamily } from '$lib/stores/jdg-ui-store.js';

	import {
		jdgBoxShadowStandard,
		jdgBreakpoints,
		jdgColors,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';
	import {
		adjustColorForContrast,
		darkenColor,
		hexToRgb,
		lightenColor,
		rgbToHex,
		setHexColorSaturation
	} from '$lib/jdg-utils.js';

	const PADDING_LR_TB_RATIO = 2;

	export let label = 'This is a button'; // set null if no label is desired
	export let faClass = 'fa-solid fa-fw'; // fa-fw ensures consistent width for all icons
	export let faIcon = 'fa-circle-info'; // set null if no icon is desired
	export let iconSrc = null; // path to SVG/PNG image (takes priority over faIcon if set)
	export let isEnabled = true;
	export let isPrimary = true;
	export let onClickFunction;
	export let textColor = jdgColors.textDm;
	export let textColorHover = jdgColors.textDm;
	export let backgroundColor = undefined;
	export let doAdjustBackgroundColorForContrast = true;
	export let contrastRatio = 2;
	export let backgroundColorHover = undefined;
	/** When unset, uses `jdgSizes.inputFontSize*` with `jdgBreakpoints` in Emotion `@media` rules. */
	export let fontSize = undefined;
	export let width = 'fit-content';
	export let borderRadius = '1.5em';
	/** When unset, vertical padding uses `jdgSizes.inputPadding*`; horizontal follows `PADDING_LR_TO_TB_RATIO`. */
	export let paddingTopBottom = undefined;
	export let paddingLeftRight = undefined;
	export let doForceSquareAspect = false;
	export let gap = '8px';
	export let tooltip = undefined;
	export let shadow = false;

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

	function getDefaultBackgroundHoverColor(bgColor) {
		let bgColorHover;

		// Don't check isEnabled here - the CSS hover style already handles the disabled state
		if (bgColor === 'transparent') {
			bgColorHover = rgbToHex(darkenColor(hexToRgb(getDefaultBackgroundColor()), 0.2));
		} else {
			bgColorHover = darkenColor(bgColor, 0.2);
		}

		return adjustColorForContrast(bgColorHover, textColor, 2.5);
	}

	// Recompute effectiveBackgroundColor when isEnabled or isPrimary changes
	let effectiveBackgroundColor;
	$: {
		isEnabled;
		isPrimary;
		effectiveBackgroundColor =
			backgroundColor !== undefined ? backgroundColor : getDefaultBackgroundColor();
	}
	$: defaultHoverColor = getDefaultBackgroundHoverColor(effectiveBackgroundColor);
	$: effectiveBackgroundHover =
		backgroundColorHover !== undefined ? backgroundColorHover : defaultHoverColor;

	let buttonCss = css``; // redefined in the reactive block

	$: {
		const bp0 = jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit;
		const bp1 = jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit;
		const pMT = jdgSizes.inputPaddingMobileTablet;
		const pD = jdgSizes.inputPaddingDesktop;
		const padUnit = jdgSizes.inputPaddingUnit;
		const pLR_MT = jdgSizes.nInputPaddingMobileTablet * PADDING_LR_TB_RATIO + padUnit;
		const pLR_D = jdgSizes.nInputPaddingDesktop * PADDING_LR_TB_RATIO + padUnit;

		const hasCustomFont =
			fontSize !== undefined && fontSize !== null && String(fontSize).trim() !== '';
		const fontBlock = hasCustomFont
			? `font-size: ${fontSize};`
			: `
			@media (max-width: ${bp0}) { font-size: ${jdgSizes.inputFontSizeMobile}; }
			@media (min-width: ${bp0}) and (max-width: ${bp1}) { font-size: ${jdgSizes.inputFontSizeTablet}; }
			@media (min-width: ${bp1}) { font-size: ${jdgSizes.inputFontSizeDesktop}; }
		`;

		const hasPTB = paddingTopBottom !== undefined && paddingTopBottom !== null;
		const hasPLR = paddingLeftRight !== undefined && paddingLeftRight !== null;
		let paddingBlock;
		if (hasPTB && hasPLR) {
			paddingBlock = `padding: ${paddingTopBottom} ${paddingLeftRight} ${paddingTopBottom} ${paddingLeftRight};`;
		} else if (hasPTB && !hasPLR) {
			paddingBlock = `
				padding-top: ${paddingTopBottom};
				padding-bottom: ${paddingTopBottom};
				padding-left: calc(${PADDING_LR_TB_RATIO} * ${paddingTopBottom});
				padding-right: calc(${PADDING_LR_TB_RATIO} * ${paddingTopBottom});
			`;
		} else if (!hasPTB && hasPLR) {
			paddingBlock = `
				padding-left: ${paddingLeftRight};
				padding-right: ${paddingLeftRight};
				@media (max-width: ${bp0}) {
					padding-top: ${pMT};
					padding-bottom: ${pMT};
				}
				@media (min-width: ${bp0}) and (max-width: ${bp1}) {
					padding-top: ${pMT};
					padding-bottom: ${pMT};
				}
				@media (min-width: ${bp1}) {
					padding-top: ${pD};
					padding-bottom: ${pD};
				}
			`;
		} else {
			paddingBlock = `
				@media (max-width: ${bp0}) {
					padding: ${pMT} ${pLR_MT};
				}
				@media (min-width: ${bp0}) and (max-width: ${bp1}) {
					padding: ${pMT} ${pLR_MT};
				}
				@media (min-width: ${bp1}) {
					padding: ${pD} ${pLR_D};
				}
			`;
		}

		const widthBlock =
			width !== 'fit-content'
				? `width: ${width};`
				: `
			width: fit-content;
			@media (max-width: ${bp0}) { width: 100%; }
		`;

		buttonCss = css`
			${fontBlock}
			font-family: ${$appFontFamily};
			${widthBlock}
			border-radius: ${doForceSquareAspect ? '50%' : borderRadius};
			${paddingBlock}
			gap: ${gap};
			color: ${textColor};
			background-color: ${isEnabled
				? doAdjustBackgroundColorForContrast
					? adjustColorForContrast(effectiveBackgroundColor, textColor, contrastRatio)
					: effectiveBackgroundColor
				: jdgColors.disabled};
			:hover {
				color: ${textColorHover};
				background-color: ${isEnabled ? effectiveBackgroundHover : jdgColors.disabled};
			}
			aspect-ratio: ${doForceSquareAspect ? '1' : ''};
		`;
	}
</script>

<button
	type="button"
	on:click|stopPropagation={onClickFunction}
	disabled={!isEnabled}
	title={tooltip ?? ''}
	class="jdg-button {buttonCss} {shadow ? jdgBoxShadowStandard : ''}"
>
	{#if iconSrc}
		<img src={iconSrc} alt="" class="jdg-button-icon" />
	{:else if faIcon !== null}
		<i class="{faClass} {doForceSquareAspect ? 'fa-fw' : ''} {faIcon}" />
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

	.jdg-button:not(:disabled) {
		cursor: pointer;
	}

	.jdg-button:disabled {
		cursor: default;
	}

	.jdg-button-icon {
		height: 1.2em; /* scales with font-size, slightly larger to match FA icons */
		width: auto;
		object-fit: contain;
	}
</style>
