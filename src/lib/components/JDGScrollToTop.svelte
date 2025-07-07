<script>
	import { onMount, afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import {
		appAccentColors,
		isMobileBreakpoint,
		windowScrollPosition
	} from '$lib/states/ui-state.js';
	import { JDGButton } from '$lib/index.js';
	import {
		jdgBoxShadowStandard,
		jdgBreakpoints,
		jdgDurations,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';
	import { incrementHighestZIndex } from '$lib/jdg-state-management.js';

	let buttonPlacementRef;
	let calculatedButtonWidth;

	onMount(() => {
		incrementHighestZIndex();
	});

	afterUpdate(() => {
		// only calculate the button width once:
		// if the placement ref is defined and the calculated width isn't known yet
		if (buttonPlacementRef && !isFinite(calculatedButtonWidth)) {
			calculatedButtonWidth = buttonPlacementRef.offsetWidth;
		}
	});

	// defined once calculatedButtonWidth is known
	let scrollToTopCss = css``;
	$: {
		scrollToTopCss = css`
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				bottom: ${jdgSizes.nContentBoxFloatingMarginSm.toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
				right: ${(2 * jdgSizes.nContentBoxFloatingMarginSm).toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				bottom: ${jdgSizes.nContentBoxFloatingMarginMd.toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
				right: ${(2 * jdgSizes.nContentBoxFloatingMarginMd).toString() +
					jdgSizes.contentBoxFloatingMarginUnit} - ${calculatedButtonWidth / 2};
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				bottom: calc(
					${(jdgSizes.nContentBoxFloatingMarginLg / 2).toString() +
						jdgSizes.contentBoxFloatingMarginUnit} - ${calculatedButtonWidth / 2}px
				);
				right: calc(
					${(jdgSizes.nContentBoxFloatingMarginLg / 2).toString() +
						jdgSizes.contentBoxFloatingMarginUnit} - ${calculatedButtonWidth / 2}px
				);
			}
		`;
	}
</script>

{#if typeof window !== 'undefined' && $windowScrollPosition > 0}
	<div
		class="jdg-scroll-to-top-absolute-container"
		in:fade={{ duration: jdgDurations.fade }}
		out:fade={{ duration: jdgDurations.fade }}
		style={$windowScrollPosition > 0 ? 'opacity: 1' : 'opacity: 0'}
	>
		<div class="scroll-to-top-relative">
			<div
				bind:this={buttonPlacementRef}
				class="scroll-to-top-button-placement {scrollToTopCss} {jdgBoxShadowStandard}"
			>
				<JDGButton
					onClickFunction={() => {
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});
					}}
					faIcon="fa-chevron-up"
					label={null}
					tooltip="Scroll to Top"
					backgroundColor={$appAccentColors[0]}
					borderRadius="50%"
					doForceSquareAspect
					paddingTopBottom={$isMobileBreakpoint ? '8px' : '12px'}
					paddingLeftRight={$isMobileBreakpoint ? '8px' : '12px'}
				/>
			</div>
		</div>
	</div>
{/if}

<style>
	.jdg-scroll-to-top-absolute-container {
		position: fixed;
		height: 100%;
		width: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.scroll-to-top-relative {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.scroll-to-top-button-placement {
		position: absolute;
		pointer-events: auto;
		border-radius: 50%;
	}
</style>
