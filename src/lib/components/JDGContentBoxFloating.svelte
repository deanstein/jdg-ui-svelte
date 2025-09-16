<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { jdgSharedIdentifiers } from '$lib/jdg-shared-strings.js';
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';
	import { appFontFamily } from '$lib/stores/jdg-ui-store.js';
	import { addJumpToNavItem, removeJumpToNavItem } from '$lib/jdg-state-management.js';
	import { convertStringToAnchorTag, instantiateObject } from '$lib/jdg-utils.js';

	import {
		fadeInSettleBeforeLg,
		fadeInSettleAfter,
		jdgBreakpoints,
		jdgColors,
		jdgDurations,
		jdgSizes,
		jdgBoxShadowStandard
	} from '../jdg-shared-styles.js';
	import { JDGAnchorTag } from '$lib/index.js';

	export let title = undefined;
	export let titleFontFamily = $appFontFamily;
	export let titleColor = jdgColors.title;
	export let subtitle = undefined;
	export let subtitleFontFamily = $appFontFamily;
	export let subtitleColor = jdgColors.textLight;
	export let anchorTag = convertStringToAnchorTag(title, false);
	export let paddingTop = '2rem';
	export let paddingBottom = '2rem';
	export let includeInJumpTo = true;
	export let animateWhenVisible = true;
	export let animationThreshold = '5%';

	// fade the floating content box when visible
	let isVisible = false;
	let isVisibleRef;

	const floatingBoxTitleCss = css`
		font-family: ${titleFontFamily};
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${titleColor};
		margin-bottom: ${subtitle ? 0 : 'revert'};
	`;

	const floatingBoxSubtitleCss = css`
		font-family: ${subtitleFontFamily};
		font-size: ${jdgSizes.fontSizeFloatingContentBoxSubtitle};
		color: ${subtitleColor};
	`;

	const floatingBoxContentCss = css`
		gap: ${jdgSizes.contentBoxPaddingLg};
		margin-left: ${jdgSizes.contentBoxFloatingMarginLg};
		margin-right: ${jdgSizes.contentBoxFloatingMarginLg};
		background-color: ${jdgColors.contentBoxBackground};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${paddingTop} ${jdgSizes.contentBoxPaddingSm} ${paddingBottom}
				${jdgSizes.contentBoxPaddingSm};
			margin-left: ${jdgSizes.contentBoxFloatingMarginSm};
			margin-right: ${jdgSizes.contentBoxFloatingMarginSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${paddingTop} ${jdgSizes.contentBoxPaddingMd} ${paddingBottom}
				${jdgSizes.contentBoxPaddingMd};
			margin-left: ${jdgSizes.contentBoxFloatingMarginMd};
			margin-right: ${jdgSizes.contentBoxFloatingMarginMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${paddingTop} ${jdgSizes.contentBoxPaddingLg} ${paddingBottom}
				${jdgSizes.contentBoxPaddingLg};
			margin-left: ${jdgSizes.contentBoxFloatingMarginLg};
			margin-right: ${jdgSizes.contentBoxFloatingMarginLg};
		}
	`;

	onMount(() => {
		// add the jumpToNavItems if requested
		if (includeInJumpTo) {
			addJumpToNavItem(
				instantiateObject(jdgNavItem, {
					label: title,
					href: convertStringToAnchorTag(anchorTag)
				})
			);
		}

		// add the intersection observer if requested
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
				// how much of the element must be shown
				// at the bottom of the screen to be considered visible
				{ rootMargin: `0px 0px -${animationThreshold} 0px` }
			);

			observer.observe(isVisibleRef);
		}

		// ensure anchor tags are created for any h2 or h3 elements
		const h2Elements = isVisibleRef.querySelectorAll('h2');
		const h3Elements = isVisibleRef.querySelectorAll('h3');
		const allSubheaderElements = [...h2Elements, ...h3Elements];
		allSubheaderElements.forEach((subheaderElement) => {
			// skip h3 elements if they're already inside the JDGH3H4 component
			if (
				subheaderElement.tagName === 'H3' &&
				subheaderElement.closest(`.${jdgSharedIdentifiers.h3h4Container}`)
			) {
				return;
			}
			const anchorTagId = convertStringToAnchorTag(subheaderElement.textContent, false);
			// create a container that can be set to relative positioning
			const anchorTagContainerDiv = document.createElement('div');
			anchorTagContainerDiv.style.position = 'relative';
			new JDGAnchorTag({
				target: anchorTagContainerDiv,
				props: {
					anchorTagString: anchorTagId
				}
			});
			subheaderElement.parentNode.insertBefore(anchorTagContainerDiv, subheaderElement);
		});
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

<div class="jdg-content-box-floating-container">
	{#if title}
		<JDGAnchorTag anchorTagString={anchorTag} isForFloatingContentContainer />
	{/if}
	<div
		bind:this={isVisibleRef}
		transition:fade={{ duration: jdgDurations.fadeIn }}
		class="jdg-content-box-floating-content {floatingBoxContentCss} {jdgBoxShadowStandard} {animateWhenVisible
			? isVisible
				? fadeInSettleAfter
				: fadeInSettleBeforeLg
			: ''}"
	>
		{#if title || subtitle}
			<div class="content-box-title-and-subtitle-container">
				{#if title}
					<h1 class="content-box-title-and-subtitle {floatingBoxTitleCss}">
						{title}
					</h1>
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
</div>

<style>
	.jdg-content-box-floating-container {
		position: relative;
		min-height: 50px;
	}

	.jdg-content-box-floating-content {
		display: flex;
		flex-direction: column;
		align-items: center;
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
		text-wrap: balance;
	}

	.content-box-subtitle {
		margin-top: 0;
		font-weight: 100;
	}
</style>
