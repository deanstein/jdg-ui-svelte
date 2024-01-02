<script>
	import { JDGStripesHorizontal } from './index.js';

	let isHovering;
</script>

<div
	class="jdg-image-tile"
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
	role="banner"
>
	<img
		src="https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-image-placeholder.jpg"
		alt="Temporary"
	/>
	{#if isHovering}
		<JDGStripesHorizontal />
	{/if}
</div>

<style>
	.jdg-image-tile {
		display: flex;
		flex-direction: column;
		height: 300px;
	}

	img {
		height: -webkit-fill-available;
		height: -moz-available;
		width: -webkit-fill-available;
		width: -moz-available;
		flex-grow: 1;
		object-fit: cover;
	}
</style>
