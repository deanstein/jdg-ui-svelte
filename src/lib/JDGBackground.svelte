<script>
	import { onMount } from 'svelte';
	import { JDGSVGRandomDelaunay } from './index.js';

	let backgroundContainerDiv;

	onMount(() => {
		window?.addEventListener('scroll', () => {
			let offset = window.scrollY;
			backgroundContainerDiv.style.backgroundPositionY = offset * 0.7 + 'px';
		});
	});
</script>

<div class="jdg-background-container" bind:this={backgroundContainerDiv}>
	<JDGSVGRandomDelaunay />
</div>

<style>
	.jdg-background-container {
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-attachment: fixed;
		background-position: center;
	}
</style>
