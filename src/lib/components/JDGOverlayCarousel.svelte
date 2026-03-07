<script>
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';

	import JDGCarouselNavButtons from '$lib/components/JDGCarouselNavButtons.svelte';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	/** Use inside an existing JDGOverlay (or similar). Adds carousel nav: buttons on tablet/desktop, swipe hint on mobile. */

	const overlayContentRowCss = css`
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: center;
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		/* On mobile (no edge buttons) center the single column so modal keeps left/right gaps */
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			justify-content: center;
		}
	`;

	const overlayCarouselCenterCss = css`
		flex: 0 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		max-height: 100%;
	`;

	/* Edge columns: space between screen and content; buttons centered in that space */
	const overlayCarouselEdgeCss = css`
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	`;

	const carouselHintCss = css`
		flex-shrink: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 12px;
		color: ${jdgColors.textLight};
		font-size: ${jdgSizes.fontSizeBodyXSm};
		box-sizing: border-box;
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			display: none;
		}
	`;

	$: showMobileHint =
		$isMobileBreakpoint &&
		$carouselNav &&
		$carouselNav.currentIndex != null &&
		$carouselNav.totalCount != null;
	$: hintText = showMobileHint
		? `< ${$carouselNav.currentIndex} of ${$carouselNav.totalCount} >`
		: '';
</script>

{#if showMobileHint}
	<div class="jdg-overlay-carousel-hint {carouselHintCss}" aria-hidden="true">
		{hintText}
	</div>
{/if}
<div class="jdg-overlay-carousel-row {overlayContentRowCss}">
	{#if !$isMobileBreakpoint}
		<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-left {overlayCarouselEdgeCss}">
			<JDGCarouselNavButtons side="prev" />
		</div>
	{/if}
	<div class="jdg-overlay-carousel-center {overlayCarouselCenterCss}">
		<slot />
	</div>
	{#if !$isMobileBreakpoint}
		<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-right {overlayCarouselEdgeCss}">
			<JDGCarouselNavButtons side="next" />
		</div>
	{/if}
</div>
