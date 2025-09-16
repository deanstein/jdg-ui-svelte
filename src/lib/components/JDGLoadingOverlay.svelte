<script>
	import { appAccentColors } from '$lib/stores/jdg-ui-store.js';
	import { JDGLoadingSpinner, JDGOverlay } from '../index.js';

	export let isLoading = false;
	export let loadingIconSrc =
		'https://res.cloudinary.com/jdg-main/image/upload/v1718070772/jdg-ui-svelte/jdg-ui-logo_cs4ji5.jpg';
	export let loadingSpinnerColor = $appAccentColors[0];
</script>

{#if isLoading}
	<div class="jdg-loading-overlay-container">
		<JDGOverlay showTitleBar={false} closeOnOverlayClick={false}>
			<img src={loadingIconSrc} class="jdg-loading-overlay-icon" alt="Loading..." />
			<JDGLoadingSpinner strokeColor={loadingSpinnerColor} spinnerHeightPx={25} strokeWidthPx={3} />
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
