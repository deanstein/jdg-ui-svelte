<script>
	import { css } from '@emotion/css';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

	export let title = undefined;
	// @ts-expect-error
	export let anchorTag = title?.replace(/ /g, '-');

	const floatingBoxTitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.contentBoxBackground};
	`;

	const floatingBoxContainerCss = css`
		margin-left: ${jdgSizes.contentBoxFloatingMargin};
		margin-right: ${jdgSizes.contentBoxFloatingMargin};
		padding: ${jdgSizes.contentBoxPadding};
		background-color: ${jdgColors.contentBoxBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
	`;
</script>

<div id={anchorTag} class="jdg-content-box-floating-container {floatingBoxContainerCss}">
	{#if title}
		<div class="jdg-content-box-floating-title {floatingBoxTitleCss}">
			{title}
		</div>
	{/if}
	<slot />
</div>

<style>
	.jdg-content-box-floating-title {
		position: absolute;
		bottom: 100%;
		left: 0;
		font-weight: bold;
		line-height: 0.68;
	}

	.jdg-content-box-floating-container {
		display: flex;
		flex-direction: column;
		position: relative;
		gap: 15px;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
	}
</style>
