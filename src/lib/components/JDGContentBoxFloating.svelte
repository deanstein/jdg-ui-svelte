<script>
	import { css } from '@emotion/css';

	import { convertRemToPixels } from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '../jdg-styling-constants.js';

	export let title = undefined;
	// @ts-expect-error
	export let anchorTag = title?.replace(/ /g, '-');

	const titleScrollMultiplier = 1.75; // when scrolling to this anchor tag, account for the height of the title and then some

	const floatingBoxTitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.contentBoxBackground};
	`;

	const floatingBoxContainerCss = css`
		gap: ${jdgSizes.contentBoxPaddingLg};
		margin-left: ${jdgSizes.contentBoxFloatingMarginLg};
		margin-right: ${jdgSizes.contentBoxFloatingMarginLg};
		background-color: ${jdgColors.contentBoxBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 2rem ${jdgSizes.contentBoxPaddingSm} 2rem ${jdgSizes.contentBoxPaddingSm};
			margin-left: ${jdgSizes.contentBoxFloatingMarginSm};
			margin-right: ${jdgSizes.contentBoxFloatingMarginSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 2rem ${jdgSizes.contentBoxPaddingMd} 2rem ${jdgSizes.contentBoxPaddingMd};
			margin-left: ${jdgSizes.contentBoxFloatingMarginMd};
			margin-right: ${jdgSizes.contentBoxFloatingMarginMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 2rem ${jdgSizes.contentBoxPaddingLg} 2rem ${jdgSizes.contentBoxPaddingLg};
			margin-left: ${jdgSizes.contentBoxFloatingMarginLg};
			margin-right: ${jdgSizes.contentBoxFloatingMarginLg};
		}
	`;

	const floatingBoxAnchorTagCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightSm + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightMd + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightLg + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0)}px;
		}
	`;
</script>

<div class="jdg-content-box-floating-container {floatingBoxContainerCss}">
	{#if title}
		<div class="jdg-content-box-floating-title {floatingBoxTitleCss}">
			{title}
		</div>
		<div id={anchorTag} class="jdg-content-box-anchor-tag {floatingBoxAnchorTagCss}" />
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
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
	}

	.jdg-content-box-anchor-tag {
		position: absolute;
	}
</style>
