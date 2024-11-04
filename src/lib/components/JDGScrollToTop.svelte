<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { accentColors, windowScrollPosition } from '$lib/states/ui-state.js';
	import { JDGButton } from '$lib/index.js';
	import { jdgBreakpoints, jdgDurations, jdgSizes } from '$lib/jdg-shared-styles.js';

	let buttonPlacementRef;
	let calculatedButtonWidth;

	// defined once mounted
	let scrollToTopCss = css``;

	onMount(() => {
		calculatedButtonWidth = buttonPlacementRef.offsetWidth;
		scrollToTopCss = css`
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				bottom: ${jdgSizes.nContentBoxFloatingMarginSm.toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
				right: ${(3 * jdgSizes.nContentBoxFloatingMarginSm).toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				bottom: ${jdgSizes.nContentBoxFloatingMarginMd.toString() +
				jdgSizes.contentBoxFloatingMarginUnit};
				right: ${(3 * jdgSizes.nContentBoxFloatingMarginMd).toString() +
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
	});
</script>

{#if (typeof window !== 'undefined' && $windowScrollPosition > 0) || !calculatedButtonWidth}
	<div
		class="jdg-scroll-to-top-absolute-container"
		in:fade={{ duration: jdgDurations.fade }}
		out:fade={{ duration: jdgDurations.fade }}
	>
		<div class="scroll-to-top-relative">
			<div bind:this={buttonPlacementRef} class="scroll-to-top-button-placement {scrollToTopCss}">
				<JDGButton
					onClickFunction={() => {
						window.scrollTo({
							top: 0,
							behavior: 'smooth'
						});
					}}
					faIcon="fa-chevron-up"
					label={null}
					backgroundColor={$accentColors[0]}
					borderRadius="50%"
					doForceSquareRatio
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
	}

	.scroll-to-top-relative {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.scroll-to-top-button-placement {
		position: absolute;
		pointer-events: auto;
	}
</style>
