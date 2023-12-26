<script>
	import { css } from '@emotion/css';

	import { jdgColors } from './jdg-styling-constants.js';

	export let text;
	export let isEnabled = true;
	export let onClickFunction;
	export let color = undefined;
	export let colorHover = undefined;
	export let backgroundColor = undefined;
	export let backgroundColorHover = undefined;
	export let fontSize = undefined;
	export let padding = undefined;

	let buttonDynamicClass;

	$: {
		buttonDynamicClass = css`
			font-size: ${fontSize ? fontSize : '1.5vh'};
			padding: ${padding ? padding : '1vh'};
			color: ${color ? color : 'white'};
			background-color: ${backgroundColor ? backgroundColor : jdgColors.buttonColorPrimary};
			:hover {
				color: ${colorHover ? colorHover : 'white'};
				background-color: ${backgroundColorHover ? backgroundColorHover : jdgColors.hoverColor};
			}
			:disabled {
				background-color: ${jdgColors.buttonColorDisabled};
			}
			:disabled:hover {
				background-color: ${jdgColors.buttonColorDisabled};
			}
		`;
	}
</script>

<button disabled={!isEnabled} on:click={onClickFunction} class={buttonDynamicClass}>
	{text}
</button>

<style>
	button {
		border: none;
		font-weight: bold;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
