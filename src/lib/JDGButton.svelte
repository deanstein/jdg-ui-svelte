<script>
	import { css } from '@emotion/css';

	import { jdgColors } from './jdg-styling-constants.js';

	export let label = 'This is a button'; // set null if no label is desired
	export let faClass = 'fa-regular';
	export let faIcon = 'fa-circle-info'; // set null if no icon is desired
	export let isEnabled = true;
	export let onClickFunction;
	export let color = undefined;
	export let colorHover = undefined;
	export let backgroundColor = undefined;
	export let backgroundColorHover = undefined;
	export let fontSize = undefined;
	export let padding = undefined;
	export let tooltip = 'This is a button tooltip.';

	let buttonCss = css`
		font-size: ${fontSize ? fontSize : 'auto'};
		padding: ${padding ? padding : '5px'};
		gap: ${padding ? padding : '5px'};
		color: ${color ? color : 'white'};
		background-color: ${backgroundColor ? backgroundColor : jdgColors.buttonPrimary};
		:hover {
			color: ${colorHover ? colorHover : 'white'};
			background-color: ${backgroundColorHover ? backgroundColorHover : jdgColors.hoverBackground};
		}
		:disabled {
			background-color: ${jdgColors.buttonDisabled};
		}
		:disabled:hover {
			background-color: ${jdgColors.buttonDisabled};
		}
	`;
</script>

<button
	disabled={!isEnabled}
	on:click={onClickFunction}
	title={tooltip}
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
		border-radius: 5px;
		cursor: pointer;
	}
</style>
