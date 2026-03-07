<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';

	import JDGOverlay from '$lib/components/JDGOverlay.svelte';
	import JDGButton from '$lib/components/Input/JDGButton.svelte';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	/** Wrapper around JDGOverlay that adds carousel nav (prev/next buttons, wheel/key/touch). Pass-through props match JDGOverlay. */
	export let colorRgba = 'rgba(255, 255, 255, 1.0)';
	export let showTitleBar = true;
	export let onCloseFunction = () => {};
	export let closeOnOverlayClick = true;
	export let useBlur = true;

	const SWIPE_THRESHOLD_PX = 50;
	const WHEEL_SWIPE_THRESHOLD = 30;
	const WHEEL_NAV_COOLDOWN_MS = 400;

	let lastWheelNavTime = 0;

	let keydownHandler;
	let wheelHandler;
	let touchStartX;
	let touchStartY;
	let touchEndHandler;
	let touchStartHandler;

	onMount(() => {
		wheelHandler = (e) => {
			const nav = get(carouselNav);
			const deltaX = e.deltaX ?? 0;
			const deltaY = e.deltaY ?? 0;
			if (!nav || Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < WHEEL_SWIPE_THRESHOLD) return;
			const now = Date.now();
			if (now - lastWheelNavTime < WHEEL_NAV_COOLDOWN_MS) {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			lastWheelNavTime = now;
			if (deltaX > 0 && nav.canGoNext) nav.goNext();
			else if (deltaX < 0 && nav.canGoPrev) nav.goPrev();
		};
		window.addEventListener('wheel', wheelHandler, { capture: true, passive: false });

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
		if (wheelHandler) window.removeEventListener('wheel', wheelHandler, { capture: true });
		if (keydownHandler) window.removeEventListener('keydown', keydownHandler, true);
		if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler);
		if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler);
	});

	const overlayContentRowCss = css`
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		align-items: center;
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
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

<JDGOverlay
	{colorRgba}
	{showTitleBar}
	{onCloseFunction}
	{closeOnOverlayClick}
	{useBlur}
>
	{#if showMobileHint}
		<div class="jdg-overlay-carousel-hint {carouselHintCss}" aria-hidden="true">
			{hintText}
		</div>
	{/if}
	<div class="jdg-overlay-carousel-row {overlayContentRowCss}">
		{#if !$isMobileBreakpoint && $carouselNav}
			<div
				class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-left {overlayCarouselEdgeCss}"
			>
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
			<div
				class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-right {overlayCarouselEdgeCss}"
			>
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
</JDGOverlay>

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
