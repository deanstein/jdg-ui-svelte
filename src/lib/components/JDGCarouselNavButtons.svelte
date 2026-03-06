<script>
	import { get } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';
	import { JDGButton } from '$lib/index.js';

	/** Which button(s) to show: 'prev' | 'next' | 'both' (default). For modal edges use 'prev' in left slot and 'next' in right. */
	export let side = 'both';

	// Shared ref count so multiple instances (e.g. prev + next in modal) register global listeners only once
	let listenerRefCount = 0;
	const SWIPE_THRESHOLD_PX = 50;

	let keydownHandler;
	let touchStartX;
	let touchStartY;
	let touchEndHandler;
	let touchStartHandler;

	onMount(() => {
		listenerRefCount += 1;
		if (listenerRefCount !== 1) return;

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
		// Capture phase so we run before the focused element (e.g. input/button) consumes the key
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
			// Prefer horizontal swipe: only navigate if horizontal movement dominates
			if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
				if (deltaX > 0 && nav.canGoPrev) nav.goPrev();
				else if (deltaX < 0 && nav.canGoNext) nav.goNext();
			}
		};
		document.addEventListener('touchstart', touchStartHandler);
		document.addEventListener('touchend', touchEndHandler);
	});

	onDestroy(() => {
		listenerRefCount -= 1;
		if (listenerRefCount !== 0) return;
		if (keydownHandler) window.removeEventListener('keydown', keydownHandler, true);
		if (touchStartHandler) document.removeEventListener('touchstart', touchStartHandler);
		if (touchEndHandler) document.removeEventListener('touchend', touchEndHandler);
	});
</script>

{#if $carouselNav}
	<div class="carousel-nav-buttons" data-side={side}>
		{#if side === 'prev' || side === 'both'}
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
		{/if}
		{#if side === 'next' || side === 'both'}
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
		{/if}
	</div>
{/if}

<style>
	.carousel-nav-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.carousel-nav-buttons[data-side='both'] {
		justify-content: space-between;
		width: 100%;
	}
	.carousel-nav-buttons :global(button:focus),
	.carousel-nav-buttons :global(button:focus-visible) {
		outline: none;
	}
</style>
