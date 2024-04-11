<script>
    	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import imageAttributesCollection from '../../routes/image-attributes-collection.js';
	import { JDGImage } from '$lib/index.js';

	export let imageAttributes1 = imageAttributesCollection.ccp_blue_mall_60s70s_1;
	export let imageAttributes2 = imageAttributesCollection.ccp_blue_mall_80s90s_1;
	export let animateSlider = false;
	export let useFullWidthAnimation = true; // used for screen recording

	let imageCompareContainerRef;

	let isUserInteracting = false; // if user interacts, animation is canceled
	let observer; // observe whether container is in view
	let isInView = writable(false); // animation only happens if compare container is in view
	let sliderPositionStore = writable(50);
	let animationId;

	/*** animation ***/

	// moves the slider from edge to edge with easing
	const animateFullWidthSpeed = 0.005;
	let time = 0;
	let direction = -1;
	const animateFullWidth = () => {
		// Calculate the eased value based on the time
		let easedValue = easeInOutQuad(time) * 100;

		// Update the slider position based on the eased value
		sliderPositionStore.set(easedValue);

		// Reverse the direction and adjust the time when reaching either end
		if (easedValue >= 100 || easedValue <= 0) {
			direction *= -1;
			time = direction > 0 ? 0 : 1; // Adjust the time based on the direction
		}

		// Increment the time based on the direction and speed
		time += animateFullWidthSpeed * direction;

		// Request the next animation frame
		animationId = requestAnimationFrame(animateFullWidth);
	};
	const easeInOutQuad = (t) => {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	};

	// moves the slider from center to left, center, right, center
	let start = null;
	const animateMiddleDurationMs = 4000;
	const moveFactor = 20; // % of total slider to move to
	const animateMiddle = (timestamp) => {
		if (!start) start = timestamp;
		const elapsed = timestamp - start;

		// Calculate the eased value based on the elapsed time
		let t = elapsed / animateMiddleDurationMs;
		let easedValue;
		if (t < 1 / 3) {
			// First third of the animation: move from center to 20% left
			easedValue = 50 - moveFactor * easeInOutQuad(3 * t);
		} else if (t < 2 / 3) {
			// Second third of the animation: move from 20% left to 20% right
			easedValue = 50 - moveFactor + 2 * moveFactor * easeInOutQuad(3 * t - 1);
		} else {
			// Final third of the animation: move from 20% right back to center
			easedValue = 50 + moveFactor - moveFactor * easeInOutQuad(3 * t - 2);
		}

		// Update the slider position based on the eased value
		sliderPositionStore.set(easedValue);

		// Request the next animation frame if the animation is not finished
		if (elapsed < animateMiddleDurationMs) {
			animationId = requestAnimationFrame(useFullWidthAnimation ? animateFullWidth : animateMiddle);
		}
	};

	/*** events ***/

	const handleMouseEnter = () => {
		isUserInteracting = true;
		cancelAnimationFrame(animationId);
		observer.unobserve(imageCompareContainerRef); // Stop observing when the user interacts
	};
	const handleMouseLeave = () => {
		isUserInteracting = false;
	};

	const handleMouseMove = (event) => {
		const rect = imageCompareContainerRef.getBoundingClientRect();
		const x = event.clientX - rect.left;
		sliderPositionStore.set((x / rect.width) * 100);
	};
	const handleTouchMove = (event) => {
		const rect = imageCompareContainerRef.getBoundingClientRect();
		const x = event.touches[0].clientX - rect.left;
		sliderPositionStore.set((x / rect.width) * 100);
	};

	const handleTouchStart = () => {
		isUserInteracting = true;
		cancelAnimationFrame(animationId);
	};
	const handleTouchEnd = () => {
		isUserInteracting = false;
	};

	/*** mounts + subscriptions ***/

	onMount(() => {
		observer = new IntersectionObserver(
			([entry]) => {
				// Check if the element is visible
				if (entry.isIntersecting) {
					isInView.set(true);
				} else {
					// Stop the animation
					isInView.set(false);
				}
			},
			{ threshold: 1 }
		);

		observer.observe(imageCompareContainerRef);
	});

	// animation only happens if compare container is in view
	isInView.subscribe((isVisibleValue) => {
		if (!isUserInteracting && animateSlider) {
			if (isVisibleValue) {
				animationId = requestAnimationFrame(animateFullWidth);
			} else {
				cancelAnimationFrame(animationId);
			}
		}
	});
</script>

<div
	class="jdg-image-compare-container"
	bind:this={imageCompareContainerRef}
	on:mouseenter={handleMouseEnter}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	on:touchstart={handleTouchStart}
	on:touchmove|passive={handleTouchMove}
	on:touchend={handleTouchEnd}
	role="slider"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={$sliderPositionStore}
	tabindex="0"
>
	<div class="compare-image-absolute">
		<JDGImage imageAttributes={imageAttributes2} fillContainer={false} maxHeight="auto" />
	</div>
	<div class="compare-image-relative"
		style="clip-path: inset(0 {100 - $sliderPositionStore}% 0 0);"
	>
		<JDGImage imageAttributes={imageAttributes1} fillContainer={false} maxHeight="auto" />
	</div>
	<div class="slider" style="left: {$sliderPositionStore}%;"></div>
</div>

<style>
	.jdg-image-compare-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.compare-image-absolute {
		position: absolute;
        width: 100%;
		top: 0;
		bottom: 0;
	}

	.slider {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: #fff;
	}
</style>
