<script>
	import { getAvailableWidth } from '$lib/jdg-utils.js';
	import { windowWidth } from '$lib/states/ui-state.js';

	export let title;
	export let src;

	let availableWidth = 0;

	let containerRef;

	const onIFrameLoad = () => {
		availableWidth = getAvailableWidth(containerRef);
	};

	$: {
		// ensure the available width updates when the window width changes
		$windowWidth;
		if (containerRef) {
			availableWidth = getAvailableWidth(containerRef);
		}
	}
</script>

<div bind:this={containerRef} class="jdg-iframe-wrapper">
	<iframe
		on:load={onIFrameLoad}
		{title}
		{src}
		width={availableWidth}
		height="900px"
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
