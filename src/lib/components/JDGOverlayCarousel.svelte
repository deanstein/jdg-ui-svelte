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
	export let colorRgba = 'rgba(255, 255, 255, 0.8)';
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

	// Content-change animation: direction-aware slide (next = in from right, prev = in from left)
	let slotAnimating = ''; // '' | 'next' | 'prev'
	let slotAnimationTimeout = null;
	const SLIDE_OFFSET_PX = 36;
	const SLIDE_DURATION_MS = 280;

	async function runSlotAnimation(direction) {
		if (slotAnimationTimeout) clearTimeout(slotAnimationTimeout);
		slotAnimating = '';
		await tick();
		slotAnimating = direction;
		slotAnimationTimeout = setTimeout(() => {
			slotAnimating = '';
			slotAnimationTimeout = null;
		}, SLIDE_DURATION_MS + 40);
	}

	function handleGoPrev() {
		if ($carouselNav?.canGoPrev) {
			$carouselNav.goPrev();
			runSlotAnimation('prev');
		}
	}
	function handleGoNext() {
		if ($carouselNav?.canGoNext) {
			$carouselNav.goNext();
			runSlotAnimation('next');
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
			if (!nav || Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < WHEEL_SWIPE_THRESHOLD)
				return;
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
				runSlotAnimation('next');
			} else if (deltaX < 0 && nav.canGoPrev) {
				nav.goPrev();
				runSlotAnimation('prev');
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
				runSlotAnimation('prev');
			} else if (e.key === 'ArrowRight' && nav.canGoNext) {
				e.preventDefault();
				e.stopPropagation();
				nav.goNext();
				runSlotAnimation('next');
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
					runSlotAnimation('prev');
				} else if (deltaX < 0 && nav.canGoNext) {
					nav.goNext();
					runSlotAnimation('next');
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
		const slotWrapper = center?.querySelector('.jdg-overlay-carousel-slot-wrapper');
		if (slotWrapper?.contains(e.target)) return;
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

	// Count above slot: same on mobile and desktop
	$: showCountHint =
		$carouselNav && $carouselNav.currentIndex != null && $carouselNav.totalCount != null;
</script>

<JDGOverlay {colorRgba} {showTitleBar} {onCloseFunction} {closeOnOverlayClick} {useBlur}>
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
				{#if showCountHint}
					<div
						bind:this={hintRef}
						class="jdg-overlay-carousel-hint jdg-overlay-carousel-hint-above-slot"
						aria-hidden="true"
					>
						{#if $isMobileBreakpoint}
							<i class="fa-solid fa-angle-left"></i>
						{/if}
						<span>{$carouselNav.currentIndex} of {$carouselNav.totalCount}</span>
						{#if $isMobileBreakpoint}
							<i class="fa-solid fa-angle-right"></i>
						{/if}
					</div>
				{/if}
				<div
					class="jdg-overlay-carousel-slot-wrapper"
					class:jdg-overlay-carousel-slot-slide-next={slotAnimating === 'next'}
					class:jdg-overlay-carousel-slot-slide-prev={slotAnimating === 'prev'}
					style="--jdg-carousel-slide-offset: {SLIDE_OFFSET_PX}px"
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
	/* Hide only the top-of-overlay hint on desktop; keep the above-slot hint visible */
	@media (min-width: 768px) {
		.jdg-overlay-carousel-hint:not(.jdg-overlay-carousel-hint-above-slot) {
			display: none;
		}
	}
	/* Desktop: count only, no gap needed; mobile keeps base gap for arrows */
	@media (min-width: 768px) {
		.jdg-overlay-carousel-hint-above-slot {
			gap: 0;
		}
	}
	.jdg-overlay-carousel-row {
		display: flex;
		flex-direction: row;
		justify-content: stretch;
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		margin-bottom: 10px;
	}
	/* matches jdgBreakpoints.width[0] */
	@media (max-width: 768px) {
		.jdg-overlay-carousel-row {
			justify-content: center;
		}
	}
	.jdg-overlay-carousel-center {
		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
		align-items: center;
		max-height: 100%;
	}
	.jdg-overlay-carousel-slot-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		min-height: 0;
		align-items: center;
		justify-content: flex-start;
		max-height: 100%;
	}
	/* Desktop/tablet: slot wrapper content-sized; center column vertically centers hint + modal */
	@media (min-width: 768px) {
		.jdg-overlay-carousel-center {
			justify-content: center;
		}
		.jdg-overlay-carousel-slot-wrapper {
			flex: 0 0 auto;
		}
	}
	/* Mobile only: slot content (e.g. modal) at top and grows to fill — no gap above or below */
	@media (max-width: 768px) {
		.jdg-overlay-carousel-slot-wrapper > :global(*) {
			flex: 1 1 auto;
			min-height: 0;
			align-self: stretch;
			align-items: stretch;
			justify-content: center;
		}
		.jdg-overlay-carousel-slot-wrapper > :global(*) > :global(*) {
			flex: 1 1 auto;
			min-height: 0;
			align-items: stretch;
			justify-content: center;
		}
		.jdg-overlay-carousel-slot-wrapper > :global(*) > :global(*) > :global(*) {
			flex: 1 1 auto;
			min-height: 0;
			align-self: stretch;
			max-height: 100%;
		}
	}
	.jdg-overlay-carousel-slot-wrapper.jdg-overlay-carousel-slot-slide-next {
		animation: jdg-overlay-carousel-slide-from-right 0.28s ease-out forwards;
		will-change: transform, opacity;
	}
	.jdg-overlay-carousel-slot-wrapper.jdg-overlay-carousel-slot-slide-prev {
		animation: jdg-overlay-carousel-slide-from-left 0.28s ease-out forwards;
		will-change: transform, opacity;
	}
	@keyframes jdg-overlay-carousel-slide-from-right {
		from {
			opacity: 0.7;
			transform: translateX(var(--jdg-carousel-slide-offset, 36px));
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	@keyframes jdg-overlay-carousel-slide-from-left {
		from {
			opacity: 0.7;
			transform: translateX(calc(-1 * var(--jdg-carousel-slide-offset, 36px)));
		}
		to {
			opacity: 1;
			transform: translateX(0);
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
