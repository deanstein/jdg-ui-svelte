<script>
	import { get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';

	import JDGButton from '$lib/components/Input/JDGButton.svelte';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	const SWIPE_THRESHOLD_PX = 50;

	let keydownHandler;
	let touchStartX;
	let touchStartY;
	let touchEndHandler;
	let touchStartHandler;

	onMount(() => {
		keydownHandler = (e) => {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			const nav = get(carouselNav);
			if (!nav) return;
			if (e.key === 'ArrowLeft' && nav.canGoPrev) {
				e.preventDefault();
				e.stopPropagation();
				nav.goPrev();
			} else if (e.key === 'ArrowRight' && nav.canGoNext) {
				e.preventDefault();
				e.stopPropagation();
				nav.goNext();
			}
		};
		window.addEventListener('keydown', keydownHandler, true);

		touchStartHandler = (e) => {
			if (e.changedTouches?.length) {
				touchStartX = e.changedTouches[0].clientX;
				touchStartY = e.changedTouches[0].clientY;
			}
		};
		touchEndHandler = (e) => {
			if (!e.changedTouches?.length || touchStartX == null) return;
			const nav = get(carouselNav);
			if (!nav) return;
			const endX = e.changedTouches[0].clientX;
			const endY = e.changedTouches[0].clientY;
			const deltaX = endX - touchStartX;
			const deltaY = endY - touchStartY;
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
				if (deltaX > 0 && nav.canGoPrev) nav.goPrev();
				else if (deltaX < 0 && nav.canGoNext) nav.goNext();
			}
		};
		document.addEventListener('touchstart', touchStartHandler);
		document.addEventListener('touchend', touchEndHandler);
	});

	onDestroy(() => {
		if (keydownHandler) window.removeEventListener('keydown', keydownHandler, true);
		if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler);
		if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler);
	});

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

<style>
	.jdg-overlay-carousel-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.jdg-overlay-carousel-buttons :global(button:focus),
	.jdg-overlay-carousel-buttons :global(button:focus-visible) {
		outline: none;
	}
</style>

{#if showMobileHint}
	<div class="jdg-overlay-carousel-hint {carouselHintCss}" aria-hidden="true">
		{hintText}
	</div>
{/if}
<div class="jdg-overlay-carousel-row {overlayContentRowCss}">
	{#if !$isMobileBreakpoint && $carouselNav}
		<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-left {overlayCarouselEdgeCss}">
			<div class="jdg-overlay-carousel-buttons">
				<JDGButton
					label={null}
					faIcon="fa-chevron-left"
					onClickFunction={$carouselNav.goPrev}
					isEnabled={$carouselNav.canGoPrev}
					isPrimary={false}
					doForceSquareAspect={true}
					tooltip="Previous"
					paddingLeftRight="10px"
					paddingTopBottom="10px"
				/>
			</div>
		</div>
	{/if}
	<div class="jdg-overlay-carousel-center {overlayCarouselCenterCss}">
		<slot />
	</div>
	{#if !$isMobileBreakpoint && $carouselNav}
		<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-right {overlayCarouselEdgeCss}">
			<div class="jdg-overlay-carousel-buttons">
				<JDGButton
					label={null}
					faIcon="fa-chevron-right"
					onClickFunction={$carouselNav.goNext}
					isEnabled={$carouselNav.canGoNext}
					isPrimary={false}
					doForceSquareAspect={true}
					tooltip="Next"
					paddingLeftRight="10px"
					paddingTopBottom="10px"
				/>
			</div>
		</div>
	{/if}
</div>
