<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { convertVhToPixels } from '$lib/jdg-utils.js';

	export let minHeight = '';
	export let maxHeight = '50svh';

	let appliedMinHeight = minHeight;
	let appliedMaxHeight = maxHeight;

	onMount(() => {
		appliedMaxHeight = convertVhToPixels(maxHeight, true);
		appliedMinHeight = convertVhToPixels(minHeight, true);
	});

	$: scrollBoxContainer = css`
		min-height: ${appliedMinHeight};
		max-height: ${appliedMaxHeight};
	`;
</script>

<div class="jdg-scrollbox-container {scrollBoxContainer}">
	<slot />
</div>

<style>
	.jdg-scrollbox-container {
		overflow-y: auto;
		/* Prevent scroll chaining to parent on iOS */
		overscroll-behavior: contain;
		/* Optimize touch scrolling on iOS */
		-webkit-overflow-scrolling: touch;
	}
</style>
