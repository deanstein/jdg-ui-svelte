<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import {
		doShowHeaderStripes,
		isScrollingToAnchorTag,
		imagesLoading,
		isScrolling
	} from '$lib/states/ui-state.js';
	import { getIsWindowScrolledToBottom, scrollToAnchor } from '$lib/jdg-utils.js';

	export let anchorTag;

	let anchorTagRef;
	let lastKnownAnchorTagYPos = 0;
	const doShowDebugMessagesInConsole = false;

	// is this anchor tag in the URL bar?
	const getIsAnchorTagInURL = () => {
		const hash = window.location.hash;
		return hash && hash.substring(1) === anchorTag;
	};

	const getCurrentAnchorTagYPos = () => {
		return anchorTagRef.getBoundingClientRect().top + document.documentElement.scrollTop;
	};

	// runs whenever the page loads with an anchor tag,
	// or when anchor tag changes
	const onHashChange = () => {
		if (getIsAnchorTagInURL()) {
			if (doShowDebugMessagesInConsole) {
				console.log('Hash changed, attempting to scroll to anchor tag: ' + anchorTag);
			}
			isScrollingToAnchorTag.set(true);
		}
	};

	onMount(() => {
		window.addEventListener('hashchange', onHashChange);
		lastKnownAnchorTagYPos = getCurrentAnchorTagYPos();
		onHashChange();
	});

	onDestroy(() => {
		window.removeEventListener('hashchange', onHashChange);
	});

	const floatingBoxAnchorTagCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightSm + jdgSizes.nContentContainerGapSm + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightMd + jdgSizes.nContentContainerGapMd + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			top: -${jdgSizes.nHeaderHeightLg + jdgSizes.nContentContainerGapLg + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0)}px;
		}
	`;

	// to ensure scrolling to anchor tag works as dynamic content loads,
	// we attempt to scroll again if anchor tag position changed after previous image loaded
	$: {
		if (getIsAnchorTagInURL() && anchorTagRef && $isScrollingToAnchorTag) {
			// no more images loading
			if ($imagesLoading.length === 0) {
				const currentYPos = getCurrentAnchorTagYPos();
				// anchor tag position changed since last time
				if (lastKnownAnchorTagYPos !== currentYPos) {
					if (doShowDebugMessagesInConsole) {
						console.log('Anchor tag moved, attempting to scroll to anchor again!', anchorTag);
					}
					lastKnownAnchorTagYPos = currentYPos;
					scrollToAnchor(anchorTag, false);
				}
			}
		}
	}

	// if we've reached the destination
	// or if window is scrolled to bottom
	// set the isScrollingToAnchorTag to false
	$: {
		if (getIsAnchorTagInURL()) {
			if (
				(!$isScrolling &&
					$isScrollingToAnchorTag &&
					Math.abs(lastKnownAnchorTagYPos - window.scrollY) < 10) ||
				getIsWindowScrolledToBottom()
			) {
				if (doShowDebugMessagesInConsole) {
					console.log('Reached destination!', anchorTag);
				}
				isScrollingToAnchorTag.set(false);
			}
		}
	}
</script>

<div
	bind:this={anchorTagRef}
	class="content-box-anchor-tag {floatingBoxAnchorTagCss}"
	id={anchorTag}
/>

<style>
	.content-box-anchor-tag {
		position: absolute;
	}
</style>
