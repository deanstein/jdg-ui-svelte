<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

	import { JDGImage, JDGImageCaptionAttribution } from '$lib/index.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	export let imageAttributes1;
	export let imageAttributes2;
	export let caption = undefined; // combined caption for both images
	export let attribution = undefined; // combined attribution for both images
	export let animateSlider = false; // when in view, slider will dance a bit to show interactivity
	export let useFullWidthAnimation = false; // used for screen recording
	export let showBlurInUnfilledSpace = true;
	export let maxHeight = 'auto';

	let imageCompareWrapperRef;
	let imageCompareContainerRef;

	// create a temp imageAttributes for combined caption/attribution
	let newImageAttributes = instantiateObject(jdgImageAttributes);
	newImageAttributes.imgCaption = caption;
	newImageAttributes.imgAttribution = attribution;

	let isUserInteracting = false; // if user interacts, animation is canceled
	let observer; // observe whether container is in view
	let isInView = writable(false); // animation only happens if compare container is in view
	let sliderPositionStore = writable(50);
	let animationId;

	/*** animation ***/

	// easing function used for both animation types
	const easeInOutQuad = (t) => {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	};

	// moves the slider from edge to edge with easing
	const animateFullWidthSpeed = 0.002;
	let time = 0;
	let direction = -1;
	const animateFullWidth = () => {
		// calculate the eased value based on the time
		let easedValue = easeInOutQuad(time) * 100;

		// update the slider position based on the eased value
		sliderPositionStore.set(easedValue);

		// reverse the direction and adjust the time when reaching either end
		if (easedValue >= 100 || easedValue <= 0) {
			direction *= -1;
			time = direction > 0 ? 0 : 1; // Adjust the time based on the direction
		}

		// increment the time based on the direction and speed
		time += animateFullWidthSpeed * direction;

		// request the next animation frame
		animationId = requestAnimationFrame(animateFullWidth);
	};

	// moves the slider from center to left, center, right, center
	let start = null;
	const animateMiddleDurationMs = 4000;
	const moveFactor = 20; // % of total slider to move to
	const animateMiddle = (timestamp) => {
		if (!start) start = timestamp;
		const elapsed = timestamp - start;

		// calculate the eased value based on the elapsed time
		let t = elapsed / animateMiddleDurationMs;
		let easedValue;
		if (t < 1 / 3) {
			// first third of the animation: move from center to left
			easedValue = 50 - moveFactor * easeInOutQuad(3 * t);
		} else if (t < 2 / 3) {
			// second third of the animation: move from left past center to right
			easedValue = 50 - moveFactor + 2 * moveFactor * easeInOutQuad(3 * t - 1);
		} else {
			// final third of the animation: move from right back to center
			easedValue = 50 + moveFactor - moveFactor * easeInOutQuad(3 * t - 2);
		}

		// update the slider position based on the eased value
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

	/*** emotion css ***/
	const compareContainerCss = css`
		width: ${showBlurInUnfilledSpace ? '100%' : 'max-content'};
	`;

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

<div class="jdg-image-compare-wrapper" bind:this={imageCompareWrapperRef}>
	<div
		class="jdg-image-compare-container {compareContainerCss}"
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
			<JDGImage
				imageAttributes={imageAttributes2}
				fillContainer={false}
				{maxHeight}
				{showBlurInUnfilledSpace}
				alternateFitRef={imageCompareWrapperRef}
				compactModeOnMobile={true}
			/>
		</div>
		<div
			class="compare-image-relative"
			style="clip-path: inset(0 {100 - $sliderPositionStore}% 0 0);"
		>
			<JDGImage
				imageAttributes={imageAttributes1}
				fillContainer={false}
				{maxHeight}
				{showBlurInUnfilledSpace}
				alternateFitRef={imageCompareWrapperRef}
				compactModeOnMobile={true}
			/>
		</div>
		<div class="slider" style="left: {$sliderPositionStore}%;"></div>
		{#if caption}
			<div style="width: 100%;">
				<JDGImageCaptionAttribution imageAttributes={newImageAttributes} />
			</div>
		{/if}
	</div>
</div>

<style>
	.jdg-image-compare-wrapper {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.jdg-image-compare-container {
		position: relative;
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
