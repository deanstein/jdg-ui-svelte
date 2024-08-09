<script>
	import { fadeInSettleAfter, fadeInSettleBeforeLg, jdgDurations } from '$lib/jdg-shared-styles.js';
	import { onDestroy, tick } from 'svelte';

	export let animatableElement;
	export let animationCssBefore = fadeInSettleBeforeLg; // emotion css for before element is visible
	export let animationCssAfter = fadeInSettleAfter; // emotion css for after element is visible
	export let animationThreshold = '5%';

	let observer;
	let isVisible = false;

	$: if (animatableElement) {
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

		observer.observe(animatableElement);
	}

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});

	$: if (isVisible) {
		tick().then(() => {
			animatableElement.classList.add(animationCssAfter);
			animatableElement.classList.remove(animationCssBefore);
		});
	}
</script>
