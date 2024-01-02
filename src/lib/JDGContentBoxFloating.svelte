<script>
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	const floatingBoxContainerCss = css`
		margin-left: ${jdgSizes.contentBoxFloatingMargin};
		margin-right: ${jdgSizes.contentBoxFloatingMargin};
		padding: ${jdgSizes.contentBoxPadding};
		background-color: ${jdgColors.contentBoxBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;
</script>

<div class="jdg-content-box-floating-container {floatingBoxContainerCss}">
	<slot />
</div>

<style>
	.jdg-content-box-floating-container {
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
	}
</style>
