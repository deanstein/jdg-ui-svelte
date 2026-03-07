<script>
	import { get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { css } from '@emotion/css';
	import { fade } from 'svelte/transition';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { carouselNav, highestZIndex } from '$lib/stores/jdg-ui-store.js';
	import { getHighestZIndex } from '$lib/jdg-state-management.js';

	import JDGButton from '$lib/components/Input/JDGButton.svelte';
	import JDGCloseIcon from '$lib/assets/svg/JDGCloseIcon.svelte';
	import { jdgBreakpoints, jdgColors, jdgDurations, jdgSizes } from '$lib/jdg-shared-styles.js';

	const SWIPE_THRESHOLD_PX = 50;
	const WHEEL_SWIPE_THRESHOLD = 30;
	const WHEEL_NAV_COOLDOWN_MS = 400;

	let lastWheelNavTime = 0;

	/** Same as JDGOverlay – overlay shell (backdrop, close, etc.) plus carousel nav (buttons / mobile hint). */
	export let colorRgba = 'rgba(255, 255, 255, 1.0)';
	export let showTitleBar = true;
	export let onCloseFunction = () => {};
	export let closeOnOverlayClick = true;
	export let useBlur = true;

	let overlayRef;

	function isInsideScrollableElement(target) {
		let el = target;
		while (el && el !== overlayRef) {
			const style = window.getComputedStyle(el);
			const overflowY = style.overflowY;
			const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
			const hasOverflow = el.scrollHeight > el.clientHeight;
			if (isScrollable && hasOverflow) return true;
			el = el.parentElement;
		}
		return false;
	}

	function preventScroll(e) {
		if (!isInsideScrollableElement(e.target)) e.preventDefault();
	}

	function handleContentClick(e) {
		if (!closeOnOverlayClick || typeof onCloseFunction !== 'function') return;
		// Only close when clicking backdrop: not the modal (center) and not the nav buttons.
		if (e.target.closest('.jdg-overlay-carousel-center')) return;
		if (e.target.closest('.jdg-overlay-carousel-buttons')) return;
		onCloseFunction();
	}

	let keydownHandler;
	let wheelHandler;
	let touchStartX;
	let touchStartY;
	let touchEndHandler;
	let touchStartHandler;

	onMount(() => {
		highestZIndex.set(getHighestZIndex() + 1);

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

	const overlayCss = css`
		z-index: ${getHighestZIndex()};
		background-color: ${colorRgba};
		backdrop-filter: ${useBlur ? `blur(${jdgSizes.blurSizeMedium})` : ''};
	`;

	const closeButtonCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.navMobileIconHeightSm};
			height: ${jdgSizes.navMobileIconHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			width: ${jdgSizes.navMobileIconHeightMd};
			height: ${jdgSizes.navMobileIconHeightMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.navMobileIconHeightLg};
			height: ${jdgSizes.navMobileIconHeightLg};
		}
	`;

	const overlayTitleBarCss = css`
		padding-left: ${jdgSizes.headerSidePadding};
		padding-right: ${jdgSizes.headerSidePadding};
		padding-top: ${jdgSizes.headerTopBottomPadding};
		padding-bottom: ${jdgSizes.headerTopBottomPadding};
		background-color: ${jdgColors.headerBackground};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightLg};
		}
	`;

	const overlayContentCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: calc(100dvh - ${jdgSizes.headerHeightSm});
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: calc(100dvh - ${jdgSizes.headerHeightMd});
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: calc(100dvh - ${jdgSizes.headerHeightLg});
		}
	`;

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

<div
	bind:this={overlayRef}
	class="jdg-overlay {overlayCss}"
	on:click|self={onCloseFunction}
	on:keypress|self={() => {}}
	on:wheel={preventScroll}
	on:touchmove={preventScroll}
	role="button"
	tabindex="0"
	transition:fade={{ duration: jdgDurations.default }}
>
	{#if showTitleBar}
		<div
			class="jdg-overlay-title-bar {overlayTitleBarCss}"
			on:click|self={closeOnOverlayClick ? onCloseFunction : () => {}}
			on:keypress={() => {}}
			role="button"
			tabindex="0"
		>
			<div
				class="jdg-overlay-close-button {closeButtonCss}"
				role="button"
				tabindex="0"
				on:click={onCloseFunction}
				on:keypress={() => {}}
			>
				<div class="jdg-highlight-container">
					<span class="jdg-highlight no-initial-highlight" style="display: flex;">
						<JDGCloseIcon />
					</span>
				</div>
			</div>
		</div>
	{/if}
	<div
		class="jdg-overlay-content {overlayContentCss}"
		role="button"
		tabindex="0"
		on:click={handleContentClick}
		on:keypress={() => {}}
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
	</div>
</div>

<style>
	.jdg-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.jdg-overlay-content {
		display: flex;
		gap: 20px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		box-sizing: border-box;
		width: 100%;
	}

	.jdg-overlay-title-bar {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: end;
		width: 100%;
	}

	.jdg-overlay-close-button {
		cursor: pointer;
		z-index: 1;
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
