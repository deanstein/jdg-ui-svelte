<script>
	import { css } from '@emotion/css';

	import { clientWidth } from '$lib/states/ui-state.js';

	let fullWidthContainerDynamicCss = css``;

	$: {
		fullWidthContainerDynamicCss = css`
			width: ${$clientWidth}px;
			margin-left: -${$clientWidth / 2}px;
			margin-right: -${$clientWidth / 2}px;
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
