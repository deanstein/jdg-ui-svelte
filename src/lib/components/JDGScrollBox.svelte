<script>
	import { css } from '@emotion/css';

	export let minHeight = '';
	export let maxHeight = '50svh';

	const scrollBoxContainer = css`
		min-height: ${minHeight};
		max-height: ${maxHeight};
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
