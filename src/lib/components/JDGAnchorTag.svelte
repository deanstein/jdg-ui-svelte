<script>
	import { css } from '@emotion/css';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { doShowHeaderStripes } from '$lib/states/ui-state.js';
	import { onDestroy, onMount } from 'svelte';
	import { scrollToAnchor } from '$lib/jdg-utils.js';

	export let anchorTag;

	// for this amount of time after a hash change,
	// attempt to re-scroll if the element moves
	const observerTimeout = 1500;
	let anchorTagRef;
	let anchorTagObserver;

	// is this anchor tag in the URL bar?
	const doesAnchorTagMatch = () => {
		const hash = window.location.hash;
		return hash && hash.substring(1) === anchorTag;
	};

	const handleHashChange = () => {
		if (doesAnchorTagMatch()) {
			startAnchorTagMoveObserver();
		}
	};

	// if the anchor tag detects it's been moved,
	// get the latest position and try to scroll to it
	const startAnchorTagMoveObserver = () => {
		if (anchorTagObserver) return;

		anchorTagObserver = new ResizeObserver(() => {
			console.log('Element moved, updating position');
			setTimeout(() => {
				scrollToAnchor(anchorTag, false);
			}, observerTimeout);
		});

		anchorTagObserver.observe(anchorTagRef);

		// Ensure observer disconnects after a second no matter what
		setTimeout(() => {
			if (anchorTagObserver) {
				anchorTagObserver.disconnect();
				console.log('Observer disconnected after timeout');
				anchorTagObserver = null;
			}
		}, observerTimeout);

		console.log('Observer started');
	};

	onMount(() => {
		window.addEventListener('hashchange', handleHashChange);
		if (doesAnchorTagMatch()) {
			startAnchorTagMoveObserver();
		}
	});

	onDestroy(() => {
		window.removeEventListener('hashchange', handleHashChange);
		if (anchorTagObserver) {
			anchorTagObserver.disconnect();
			anchorTagObserver = null;
		}
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
