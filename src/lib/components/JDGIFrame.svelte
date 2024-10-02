<script>
	import { getAvailableWidth, getRequiredHeightFromIFrame } from '$lib/jdg-utils.js';

	export let title;
	export let src;

	let availableWidth = 0;
	let requiredHeight = 0;

	let containerRef;
	let iframeRef;

	const onIFrameLoad = () => {
		availableWidth = getAvailableWidth(containerRef);
		requiredHeight = getRequiredHeightFromIFrame(iframeRef);
	};
</script>

<div bind:this={containerRef} class="jdg-iframe-wrapper">
	<iframe
		bind:this={iframeRef}
		on:load={onIFrameLoad}
		{title}
		{src}
		width={availableWidth}
		height="800px"
		frameborder="0"
		marginheight="0"
		>Loading...
	</iframe>
</div>

<style>
	.jdg-iframe-wrapper {
		font-family: sans-serif;
	}
</style>
