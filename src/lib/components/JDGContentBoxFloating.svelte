<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';
	import { addJumpToNavItem, removeJumpToNavItem } from '$lib/jdg-state-management.js';
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';

	import { convertStringToAnchorTag, instantiateObject } from '$lib/jdg-utils.js';

	import {
		fadeInSettle,
		fadeInSettleLoaded,
		jdgBreakpoints,
		jdgColors,
		jdgDurations,
		jdgFonts,
		jdgSizes
	} from '../jdg-shared-styles.js';

	export let title = undefined;
	export let titleFontFamily = jdgFonts.body;
	export let subtitle = undefined;
	export let subtitleFontFamily = jdgFonts.body;
	export let anchorTag = convertStringToAnchorTag(title, false);
	export let includeInJumpTo = true;
	export let animateWhenVisible = true;
	export let animationThreshold = '5%';

	// fade the floating content box
	let isVisible = false;
	let isVisibleRef;

	const floatingBoxTitleCss = css`
		font-family: ${titleFontFamily};
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.title};
		margin-bottom: ${subtitle ? 0 : 'revert'};
	`;

	const floatingBoxSubtitleCss = css`
		font-family: ${subtitleFontFamily};
		font-size: ${jdgSizes.fontSizeFloatingContentBoxSubtitle};
		color: ${jdgColors.textLight};
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
			top: -${jdgSizes.nHeaderHeightSm + jdgSizes.nContentContainerGapSm + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightMd + jdgSizes.nContentContainerGapMd + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightLg + jdgSizes.nContentContainerGapLg + ($uiState.showHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0)}px;
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

		if (animateWhenVisible) {
			// set up the intersection observer
			// so we know when the container is visible and we update the class
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							isVisible = true;
							observer.disconnect();
						}
					});
				},
				{ rootMargin: `0px 0px -${animationThreshold} 0px` }
			); // Trigger when the top edge of the element is within 25% of the viewport height from the bottom

			observer.observe(isVisibleRef);
		}
	});

	onDestroy(() => {
		if (includeInJumpTo) {
			removeJumpToNavItem(
				instantiateObject(jdgNavItem, {
					label: title,
					href: convertStringToAnchorTag(anchorTag)
				})
			);
		}
	});
</script>

<div
	bind:this={isVisibleRef}
	transition:fade={{ duration: jdgDurations.fadeIn }}
	class="jdg-content-box-floating-container {floatingBoxContainerCss} {animateWhenVisible
		? isVisible
			? fadeInSettleLoaded
			: fadeInSettle
		: ''}"
>
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
		letter-spacing: 3px;
	}

	.content-box-title-and-subtitle {
		text-align: center;
	}

	.content-box-subtitle {
		margin-top: 0;
		font-weight: 100;
	}

	.content-box-anchor-tag {
		position: absolute;
	}
</style>
