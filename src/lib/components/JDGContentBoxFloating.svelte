<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';
	import { addJumpToNavItem } from '$lib/jdg-state-management.js';
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';

	import {
		convertRemToPixels,
		convertStringToAnchorTag,
		instantiateObject
	} from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgSizes } from '../jdg-styling-constants.js';

	export let title = undefined;
	export let subtitle = undefined;
	export let anchorTag = convertStringToAnchorTag(title, false);
	export let includeInJumpTo = true;

	// when scrolling to this anchor tag,
	// account for the height of the title and then some
	const titleScrollMultiplier = 1.75;

	const floatingBoxTitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.title};
		margin-bottom: ${subtitle ? 0 : 'revert'};
	`;

	const floatingBoxSubtitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxSubtitle};
		color: ${jdgColors.title};
	`;

	const floatingBoxContainerCss = css`
		gap: ${jdgSizes.contentBoxPaddingLg};
		margin-left: ${jdgSizes.contentBoxFloatingMarginLg};
		margin-right: ${jdgSizes.contentBoxFloatingMarginLg};
		background-color: ${jdgColors.contentBoxBackground};
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
			top: -${jdgSizes.nHeaderHeightSm + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0) + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightMd + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0) + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightLg + (title ? convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle) * titleScrollMultiplier : 0) + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0)}px;
		}
	`;

	onMount(() => {
		if (includeInJumpTo) {
			addJumpToNavItem(
				instantiateObject(jdgNavItem, {
					label: title,
					href: convertStringToAnchorTag(anchorTag)
				})
			);
		}
	});
</script>

<div class="jdg-content-box-floating-container {floatingBoxContainerCss}">
	{#if title || subtitle}
		<div class="content-box-title-and-subtitle-container">
			{#if title}
				<h1 class="content-box-title-and-subtitle {floatingBoxTitleCss}">
					{title}
				</h1>
				<div id={anchorTag} class="content-box-anchor-tag {floatingBoxAnchorTagCss}" />
			{/if}
			{#if subtitle}
				<h2 class="content-box-title-and-subtitle content-box-subtitle {floatingBoxSubtitleCss}">
					{subtitle}
				</h2>
			{/if}
		</div>
	{/if}
	<slot />
</div>

<style>
	.jdg-content-box-floating-container {
		display: flex;
		flex-direction: column;
		position: relative;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 50px;
		z-index: 0;
	}

	.content-box-title-and-subtitle-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.content-box-title-and-subtitle {
		text-align: center;
	}

	.content-box-subtitle {
		margin-top: 0;
	}

	.content-box-anchor-tag {
		position: absolute;
	}
</style>
