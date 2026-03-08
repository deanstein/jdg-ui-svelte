<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav, carouselHintHeightPx } from '$lib/stores/jdg-ui-store.js';
	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';

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

	// Content-change animation: trigger from nav action so it runs when arrows/key/wheel/touch change slide
	let slotAnimating = false;
	let slotAnimationTimeout = null;

	async function runSlotAnimation() {
		if (slotAnimationTimeout) clearTimeout(slotAnimationTimeout);
		slotAnimating = false;
		await tick();
		slotAnimating = true;
		slotAnimationTimeout = setTimeout(() => {
			slotAnimating = false;
			slotAnimationTimeout = null;
		}, 320);
	}

	function handleGoPrev() {
		if ($carouselNav?.canGoPrev) {
			$carouselNav.goPrev();
			runSlotAnimation();
		}
	}
	function handleGoNext() {
		if ($carouselNav?.canGoNext) {
			$carouselNav.goNext();
			runSlotAnimation();
		}
	}

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
			if (deltaX > 0 && nav.canGoNext) {
				nav.goNext();
				runSlotAnimation();
			} else if (deltaX < 0 && nav.canGoPrev) {
				nav.goPrev();
				runSlotAnimation();
			}
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
				runSlotAnimation();
			} else if (e.key === 'ArrowRight' && nav.canGoNext) {
				e.preventDefault();
				e.stopPropagation();
				nav.goNext();
				runSlotAnimation();
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
				if (deltaX > 0 && nav.canGoPrev) {
					nav.goPrev();
					runSlotAnimation();
				} else if (deltaX < 0 && nav.canGoNext) {
					nav.goNext();
					runSlotAnimation();
				}
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

	const overlayCarouselCenterAlignCss = css`
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
		display: flex;	
		align-items: center;
		}
	`;

	function handleContentClick(e) {
		if (!closeOnOverlayClick || typeof onCloseFunction !== 'function') return;
		if (e.target.closest('.jdg-overlay-carousel-buttons')) return;
		const center = e.target.closest('.jdg-overlay-carousel-center');
		// Only skip close when click is on the actual slot content (modal), not the center’s empty area above/beside it
		if (center?.firstElementChild && center.firstElementChild.contains(e.target)) return;
		onCloseFunction();
	}

	onDestroy(() => {
		if (slotAnimationTimeout) clearTimeout(slotAnimationTimeout);
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
</script>

<JDGOverlay
	{colorRgba}
	{showTitleBar}
	{onCloseFunction}
	{closeOnOverlayClick}
	{useBlur}
>
	<div
		class="jdg-overlay-carousel-content"
		role="button"
		tabindex="0"
		on:click={handleContentClick}
		on:keydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleContentClick(e);
			}
		}}
	>
		{#if showMobileHint}
			<div bind:this={hintRef} class="jdg-overlay-carousel-hint" aria-hidden="true">
				<i class="fa-solid fa-angle-left"></i>
				<span>{$carouselNav.currentIndex} of {$carouselNav.totalCount}</span>
				<i class="fa-solid fa-angle-right"></i>
			</div>
		{/if}
		<div class="jdg-overlay-carousel-row">
		{#if !$isMobileBreakpoint && $carouselNav}
			<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-left">
				<div class="jdg-overlay-carousel-buttons">
					<JDGButton
						label={null}
						faIcon="fa-chevron-left"
						onClickFunction={handleGoPrev}
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
		<div class="jdg-overlay-carousel-center {overlayCarouselCenterAlignCss}">
			<div
				class="jdg-overlay-carousel-slot-wrapper"
				class:jdg-overlay-carousel-slot-animate={slotAnimating}
			>
				<slot />
			</div>
		</div>
		{#if !$isMobileBreakpoint && $carouselNav}
			<div class="jdg-overlay-carousel-edge jdg-overlay-carousel-edge-right">
				<div class="jdg-overlay-carousel-buttons">
					<JDGButton
						label={null}
						faIcon="fa-chevron-right"
						onClickFunction={handleGoNext}
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
	</div>
</JDGOverlay>

<style>
	.jdg-overlay-carousel-content {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
	}
	/* hint: color/font/breakpoint match jdgColors.textLight, jdgSizes.fontSizeBodyXSm, jdgBreakpoints.width[0] */
	.jdg-overlay-carousel-hint {
		flex-shrink: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
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
	.jdg-overlay-carousel-slot-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		max-height: 100%;
	}
	.jdg-overlay-carousel-slot-wrapper.jdg-overlay-carousel-slot-animate {
		animation: jdg-overlay-carousel-slot-in 0.3s ease-out forwards;
		will-change: opacity, transform;
	}
	@keyframes jdg-overlay-carousel-slot-in {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
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
