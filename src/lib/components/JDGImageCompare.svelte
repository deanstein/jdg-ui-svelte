<script>
	import { writable } from 'svelte/store';
	import imageAttributesCollection from '../../routes/image-attributes-collection.js';
	import { JDGImage } from '$lib/index.js';

	export let imageAttributes1 = imageAttributesCollection.ccp_blue_mall_60s70s_1;
	export let imageAttributes2 = imageAttributesCollection.ccp_blue_mall_80s90s_1;

	let imageCompareContainerRef;
	let isUserInteracting = false;
	let animateSlider = true; // for screen recording only

	let sliderPositionStore = writable(50);
	let direction = 1;
	let animationId;

	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	let time = 0;
	let speed = 0.01;

	sliderPositionStore.subscribe((value) => {
		if (!isUserInteracting && animateSlider) {
			animationId = requestAnimationFrame(() => {
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
				time += speed * direction;
			});
		}
	});

	function handleMouseEnter() {
		isUserInteracting = true;
		cancelAnimationFrame(animationId);
	}

    
	function handleMouseLeave() {
		isUserInteracting = false;
	}

	function handleMouseMove(event) {
		const rect = imageCompareContainerRef.getBoundingClientRect();
		const x = event.clientX - rect.left; //x position within the element.
		sliderPositionStore.set((x / rect.width) * 100);
	}
</script>

<div
	class="jdg-image-compare-container"
	bind:this={imageCompareContainerRef}
	on:mouseenter={handleMouseEnter}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	role="slider"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={$sliderPositionStore}
	tabindex="0"
>
	<div class="compare-image" style="width: 100%;">
		<JDGImage imageAttributes={imageAttributes2} maxHeight="500px" />
	</div>
	<div
		class="compare-image"
		style="clip-path: inset(0 {100 - $sliderPositionStore}% 0 0); width: 100%;"
	>
		<JDGImage imageAttributes={imageAttributes1} maxHeight="500px" />
	</div>
	<div class="slider" style="left: {$sliderPositionStore}%;"></div>
</div>

<style>
	.jdg-image-compare-container {
		position: relative;
		width: 100%;
		height: 500px;
	}

	.compare-image {
		position: absolute;
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
