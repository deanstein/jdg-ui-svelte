<script>
	import { css } from '@emotion/css';

	import { convertRemToPixels } from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '../jdg-styling-constants.js';

	export let title = undefined;
	// @ts-expect-error
	export let anchorTag = title?.replace(/ /g, '-');
	export let isForBodyCopy = false; // if true, padding is adjusted to compress content width

	const titleScrollMultiplier = 1.75; // when scrolling to this anchor tag, account for the height of the title and then some

	const floatingBoxTitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.contentBoxBackground};
	`;

	const floatingBoxContainerCss = css`
		margin-left: ${jdgSizes.contentBoxFloatingMargin};
		margin-right: ${jdgSizes.contentBoxFloatingMargin};
		background-color: ${jdgColors.contentBoxBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeSmall});

		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.contentBoxPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${jdgSizes.contentBoxPaddingSm}
				${isForBodyCopy ? jdgSizes.contentBoxVerticalPaddingLg : jdgSizes.contentBoxPaddingSm}
				${jdgSizes.contentBoxPaddingSm}
				${isForBodyCopy ? jdgSizes.contentBoxVerticalPaddingLg : jdgSizes.contentBoxPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.contentBoxPaddingSm}
				${isForBodyCopy ? jdgSizes.contentBoxVerticalPaddingMax : jdgSizes.contentBoxPaddingSm}
				${jdgSizes.contentBoxPaddingSm}
				${isForBodyCopy ? jdgSizes.contentBoxVerticalPaddingMax : jdgSizes.contentBoxPaddingSm};
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
		gap: 15px;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
	}

	.jdg-content-box-anchor-tag {
		position: absolute;
	}
</style>
