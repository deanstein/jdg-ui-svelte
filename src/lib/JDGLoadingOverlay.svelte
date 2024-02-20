<script>
	import { JDGOverlay } from './index.js';

	export let isLoading = false;
	export let loadingIconSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-logo-ui.jpg';
</script>

{#if isLoading}
	<div class="jdg-loading-overlay-container">
		<JDGOverlay>
			<img src={loadingIconSrc} class="jdg-loading-overlay-icon" alt="Loading..." />
		</JDGOverlay>
	</div>
{/if}

<style>
	.jdg-loading-overlay-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.jdg-loading-overlay-icon {
		max-height: 50px;
		object-fit: fill;
	}
</style>
