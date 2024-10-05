<script>
	import { css } from '@emotion/css';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { doShowHeaderStripes } from '$lib/states/ui-state.js';
	import { onMount, onDestroy } from 'svelte';
	import { scrollToAnchorOnLoad } from '$lib/jdg-utils.js';

	export let anchorTag;

	let anchorTagRef;
	let currentPosition;
	let observer;

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

	function handleHashChange() {
		const hash = window.location.hash;
		if (hash && hash.substring(1) === anchorTag) {
			// Call the user-defined function to scroll to the anchor tag
			scrollToAnchorOnLoad();
			console.log('Hash change detected. Initial scroll attempt.');

			const targetPosition = 100; // Set your desired vertical position here

			observer = new IntersectionObserver(
				() => {
					currentPosition = anchorTagRef.getBoundingClientRect().top;
					console.log(
						'Anchor tag position changed: ' + anchorTag,
						'Current position: ' + currentPosition,
						'Target position: ' + targetPosition
					);

					// Re-scroll if necessary
					scrollToAnchorOnLoad();
					console.log('Attempting to re-scroll due to movement.');

					// Stop observing if the anchor tag reaches the target position
					if (currentPosition <= targetPosition) {
						observer.disconnect();
						console.log('Anchor tag reached the target position. Stopped observing.');
					}
				},
				{
					threshold: [0.1, 0.5, 1.0] // Increased thresholds to detect changes more frequently
				}
			);

			observer.observe(anchorTagRef);
		}
	}

	onMount(() => {
		window.addEventListener('hashchange', handleHashChange);
		handleHashChange(); // Initial check on mount

		return () => {
			window.removeEventListener('hashchange', handleHashChange);
			if (observer) observer.disconnect();
		};
	});
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
