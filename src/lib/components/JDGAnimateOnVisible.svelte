<script>
	import { fadeInSettleAfter, fadeInSettleBeforeLg, jdgDurations } from '$lib/jdg-shared-styles.js';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	export let animationCssBefore = fadeInSettleBeforeLg;
	export let animationCssAfter = fadeInSettleAfter;
	export let animationThreshold = '5%';

	let element;
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

<div
	bind:this={element}
	transition:fade={{ duration: jdgDurations.fadeIn }}
	class="jdg-intersection-observer {isVisible ? animationCssAfter : animationCssBefore}"
>
	<slot {isVisible} />
</div>
