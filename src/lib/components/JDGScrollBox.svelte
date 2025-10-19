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
	}
</style>
