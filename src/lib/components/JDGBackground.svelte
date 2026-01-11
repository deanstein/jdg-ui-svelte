<script>
	import { onDestroy, onMount } from 'svelte';
	import { JDGRandomDelaunay, JDGRandomGradient } from '$lib/index.js';

	export let isParallax = false; // parallax could affect performance, use with caution

	const setBackgroundPositionYOnScroll = () => {
		let offset = window.scrollY;
		backgroundContainerDiv.style.transform = `translateY(${offset * -0.2}px)`;
	};

	let backgroundContainerDiv;

	onMount(() => {
		if (isParallax) {
			window?.addEventListener('scroll', setBackgroundPositionYOnScroll);
		}
	});

	onDestroy(() => {
		if (isParallax && typeof window !== 'undefined') {
			window?.removeEventListener('scroll', setBackgroundPositionYOnScroll);
		}
	});
</script>

<div class="jdg-background-container" bind:this={backgroundContainerDiv}>
	<JDGRandomGradient />
</div>

<style>
	.jdg-background-container {
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-position: center;
	}
</style>
