<script>
	import { getMaxElementWidthPx } from '$lib/jdg-utils.js';
	import { windowWidth } from '$lib/states/ui-state.js';

	export let title;
	export let src;
	export let maxHeightPx = undefined;
	export let aspectRatio = undefined;

	let availableWidthPx = 0;
	let preferredHeightPx = 0;
	let isIframeLoaded = false;
	const defaultPreferredHeightPx = 600;

	let getPreferredHeight = () => {
		let preferredHeight = 0;
		// if maxHeightPx is provided, use it
		if (isFinite(maxHeightPx)) {
			preferredHeight = maxHeightPx;
		}
		// if aspectRatio is provided, but not maxHeight, use the max width to determine preferred height
		else if (isFinite(aspectRatio) && !isFinite(maxHeightPx)) {
			// @ts-expect-error
			preferredHeight = getMaxElementWidthPx(containerRef) / aspectRatio;
		}
		// if both maxHeightPx and aspectRatio are provided, change availableWidth as required
		else if (isFinite(aspectRatio) && isFinite(maxHeightPx)) {
			// @ts-expect-error
			availableWidthPx = maxHeightPx * aspectRatio;
			preferredHeight = maxHeightPx;
		} else {
			preferredHeight = defaultPreferredHeightPx;
		}
		return preferredHeight;
	};

	let containerRef;

	$: {
		// ensure the available width updates when the window width changes
		$windowWidth;
		if (containerRef) {
			availableWidthPx = getMaxElementWidthPx(containerRef);
			preferredHeightPx = getPreferredHeight();
		}
	}
</script>

<div bind:this={containerRef} class="jdg-iframe-wrapper">
	<!-- special case: YouTube -->
	{#if src.includes('youtube.com')}
		<iframe
			{title}
			{src}
			width={availableWidthPx}
			height={preferredHeightPx}
			frameborder="0"
			marginheight="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerpolicy="strict-origin-when-cross-origin"
			allowfullscreen
			>Loading...
		</iframe>
		<!-- typical iframe -->
	{:else}
		<iframe
			{title}
			{src}
			width={availableWidthPx}
			height={preferredHeightPx}
			frameborder="0"
			marginheight="0"
			>Loading...
		</iframe>
	{/if}
</div>

<style>
	.jdg-iframe-wrapper {
		font-family: sans-serif;
	}
</style>
