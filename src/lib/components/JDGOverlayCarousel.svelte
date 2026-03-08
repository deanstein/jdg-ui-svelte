<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav, carouselHintHeightPx } from '$lib/stores/jdg-ui-store.js';

	import JDGOverlay from '$lib/components/JDGOverlay.svelte';
	import JDGButton from '$lib/components/Input/JDGButton.svelte';

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
	let hintRef;
	let resizeObserver;
	let observedHintEl = null;

	onMount(() => {
		resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry?.target) {
				const height = entry.target.getBoundingClientRect().height;
				carouselHintHeightPx.set(Math.ceil(height));
			}
		});

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

	$: if (showMobileHint && hintRef && resizeObserver && observedHintEl !== hintRef) {
		if (observedHintEl) resizeObserver.unobserve(observedHintEl);
		observedHintEl = hintRef;
		resizeObserver.observe(hintRef);
	}
	$: if (!showMobileHint) {
		if (observedHintEl && resizeObserver) {
			resizeObserver.unobserve(observedHintEl);
			observedHintEl = null;
		}
		carouselHintHeightPx.set(0);
	}

	onDestroy(() => {
		if (resizeObserver && observedHintEl) resizeObserver.unobserve(observedHintEl);
		if (wheelHandler) window.removeEventListener('wheel', wheelHandler, { capture: true });
		if (keydownHandler) window.removeEventListener('keydown', keydownHandler, true);
		if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler);
		if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler);
	});

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
		<div bind:this={hintRef} class="jdg-overlay-carousel-hint" aria-hidden="true">
			{hintText}
		</div>
	{/if}
	<div class="jdg-overlay-carousel-row">
		{#if !$isMobileBreakpoint && $carouselNav}
			<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-left">
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
		<div class="jdg-overlay-carousel-center">
			<slot />
		</div>
		{#if !$isMobileBreakpoint && $carouselNav}
			<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-right">
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
	/* hint: color/font/breakpoint match jdgColors.textLight, jdgSizes.fontSizeBodyXSm, jdgBreakpoints.width[0] */
	.jdg-overlay-carousel-hint {
		flex-shrink: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		color: #737373;
		font-size: 0.75rem;
		box-sizing: border-box;
	}
	@media (min-width: 768px) {
		.jdg-overlay-carousel-hint {
			display: none;
		}
	}
	.jdg-overlay-carousel-row {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
	}
	/* matches jdgBreakpoints.width[0] */
	@media (max-width: 768px) {
		.jdg-overlay-carousel-row {
			justify-content: center;
		}
	}
	.jdg-overlay-carousel-center {
		flex: 0 0 auto;
		justify-content: center;
		max-height: 100%;
	}
	.jdg-overlay-carousel-edge {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
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
