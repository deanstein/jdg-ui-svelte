<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '../jdg-styling-constants.js';

	export let backgroundColor = jdgColors.accentColorsJDG[0];

	const accentBlockCss = css`
		background-color: ${backgroundColor};
	`;
</script>

<div class="jdg-accent-block-container {accentBlockCss}">
	<slot />
</div>

<style>
	.jdg-accent-block-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
		padding: 25px;
	}
</style>
