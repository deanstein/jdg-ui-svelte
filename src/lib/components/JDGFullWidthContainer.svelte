<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	let fullWidthContainerDynamicCss = css``;

	$: {
		fullWidthContainerDynamicCss = css`
			width: ${$uiState.clientWidth}px;
			margin-left: -${$uiState.clientWidth / 2}px;
			margin-right: -${$uiState.clientWidth / 2}px;
		`;
	}
</script>

<div class="jdg-full-width-container {fullWidthContainerDynamicCss}">
	<slot />
</div>

<style>
	.jdg-full-width-container {
		position: relative;
		left: 50%;
		right: 50%;
	}
</style>
