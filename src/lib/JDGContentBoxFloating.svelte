<script>
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	const floatingBoxContainerCss = css`
		margin-left: ${jdgSizes.contentBoxFloatingMargin};
		margin-right: ${jdgSizes.contentBoxFloatingMargin};
		background-color: ${jdgColors.contentBox};
		backdrop-filter: blur(${jdgSizes.blurSizeMedium});
	`;
</script>

<div class="jdg-content-box-floating-container {floatingBoxContainerCss}">
	<slot />
</div>

<style>
	.jdg-content-box-floating-container {
		width: -webkit-fill-available;
		width: -moz-available;
		height: 200px;
	}
</style>
