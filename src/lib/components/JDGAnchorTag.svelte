<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import {
		doShowHeaderStripes,
		isScrollingToAnchorTag,
		imagesLoading,
		isScrolling
	} from '$lib/stores/jdg-ui-store.js';
	import {
		convertStringToAnchorTag,
		getIsWindowScrolledToBottom,
		removeAnchorTagFromHistory,
		scrollToAnchor
	} from '$lib/jdg-utils.js';

	export let anchorTagString; // string can be anything - it will get converted to a proper anchor tag
	export let isForFloatingContentContainer = false; // adjusts pos for header based on ContentContainer gap
	export let adjustPosForHeader = true; // ensure content starts below header
	export let adjustPosForPadding = true && !isForFloatingContentContainer; // additional padding below the top edge for visual buffer
	export let doRemoveAnchorTagFromHistory = false; // removes anchor tag from URL bar
	export let doShowDebugMessagesInConsole = false;

	let anchorTagRef;
	let lastKnownAnchorTagYPos = 0;

	// is this anchor tag in the URL bar?
	const getIsAnchorTagInURL = () => {
		const hash = window.location.hash;
		return hash && hash.substring(1) === anchorTagString;
	};

	const getCurrentAnchorTagYPos = () => {
		return anchorTagRef.getBoundingClientRect().top + document.documentElement.scrollTop;
	};

	const getHasArrived = () => {
		if (
			(!$isScrolling &&
				$isScrollingToAnchorTag &&
				lastKnownAnchorTagYPos > 0 &&
				window.scrollY > 0 &&
				Math.abs(lastKnownAnchorTagYPos - window.scrollY) < 10) ||
			getIsWindowScrolledToBottom()
		) {
			if (doShowDebugMessagesInConsole) {
				console.log('Reached destination!', anchorTagString);
			}
			return true;
		}
	};

	// runs whenever the page loads with an anchor tag,
	// or when anchor tag changes
	const onHashChange = () => {
		if (getIsAnchorTagInURL() && !$isScrollingToAnchorTag) {
			// start scrolling initially
			scrollToAnchor(anchorTagString, false);
			// set the flag so we can keep trying to scroll to this anchor tag
			isScrollingToAnchorTag.set(true);

			if (doShowDebugMessagesInConsole) {
				console.log(
					'Hash changed, checking for arrival and re-scrolling for anchor tag: ' + anchorTagString
				);
			}
		}
	};

	onMount(() => {
		anchorTagString = convertStringToAnchorTag(anchorTagString, false);
		window.addEventListener('hashchange', onHashChange);
		if (getIsAnchorTagInURL()) {
			lastKnownAnchorTagYPos = getCurrentAnchorTagYPos();
			onHashChange();
		}
	});

	onDestroy(() => {
		window.removeEventListener('hashchange', onHashChange);
	});

	const floatingBoxAnchorTagCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			top: -${(adjustPosForHeader ? jdgSizes.nHeaderHeightSm : 0) + (isForFloatingContentContainer ? jdgSizes.nContentContainerGapSm : 0) + (adjustPosForPadding ? 10 : 0) + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightSm : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			top: -${(adjustPosForHeader ? jdgSizes.nHeaderHeightMd : 0) + (isForFloatingContentContainer ? jdgSizes.nContentContainerGapMd : 0) + (adjustPosForPadding ? 15 : 0) + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightMd : 0)}px;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			top: -${(adjustPosForHeader ? jdgSizes.nHeaderHeightLg : 0) + (isForFloatingContentContainer ? jdgSizes.nContentContainerGapLg : 0) + (adjustPosForPadding ? 20 : 0) + ($doShowHeaderStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0)}px;
		}
	`;

	// if the isScrolling flag is set,
	// check the last known Y-position for changes
	// and attempt to scroll to the anchor again if it moved
	$: {
		if (getIsAnchorTagInURL() && anchorTagRef && $isScrollingToAnchorTag) {
			// no more images loading
			if ($imagesLoading.length === 0) {
				const currentYPos = getCurrentAnchorTagYPos();
				// anchor tag position changed since last time
				if (lastKnownAnchorTagYPos !== currentYPos) {
					if (doShowDebugMessagesInConsole) {
						console.log('Anchor tag moved, attempting to scroll to anchor again!', anchorTagString);
					}
					lastKnownAnchorTagYPos = currentYPos;
					scrollToAnchor(anchorTagString, false);
				}
			}
		}
	}

	// if we've reached the destination
	// or if window is scrolled to bottom
	// set the isScrollingToAnchorTag to false
	$: {
		lastKnownAnchorTagYPos;
		if (getIsAnchorTagInURL() && !$isScrolling && $imagesLoading.length === 0) {
			if (getHasArrived()) {
				isScrollingToAnchorTag.set(false);
				if (doRemoveAnchorTagFromHistory) {
					removeAnchorTagFromHistory();
				}
				if (doShowDebugMessagesInConsole) {
					console.log('Arrived, no longer checking for arrival.', anchorTagString);
				}
			}
		}
	}
</script>

<div
	bind:this={anchorTagRef}
	class="jdg-anchor-tag {floatingBoxAnchorTagCss}"
	id={anchorTagString}
/>

<style>
	.jdg-anchor-tag {
		position: absolute;
	}
</style>
