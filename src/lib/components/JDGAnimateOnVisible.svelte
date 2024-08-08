<script>
	import { fadeInSettleAfter, fadeInSettleBeforeLg, jdgDurations } from '$lib/jdg-shared-styles.js';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let animationCssBefore = fadeInSettleBeforeLg; // emotion css for before element is visible
	export let animationCssAfter = fadeInSettleAfter; // emotion css for after element is visible
	export let animationThreshold = '5%';

	let element;
	let elementType = 'span';
	let observer;
	let isVisible = false;

	onMount(() => {
		const rootMargin = `0px 0px -${animationThreshold} 0px`;
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						isVisible = true;
						observer.disconnect();
					}
				});
			},
			{ rootMargin }
		);

		observer.observe(element);
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<svelte:element
	this={elementType}
	bind:this={element}
	transition:fade={{ duration: jdgDurations.fadeIn }}
	class="jdg-intersection-observer {isVisible ? animationCssAfter : animationCssBefore}"
>
	<slot {isVisible} />
</svelte:element>

<style>
	.jdg-intersection-observer {
		width: 100%;
		height: 100%;
	}
</style>
