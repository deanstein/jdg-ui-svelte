<script>
	import { doShowDevOverlay } from '$lib/states/ui-state.js';

	import { JDGH3H4, JDGOverlay } from '$lib/index.js';

	// optionally output a string, like a snippet of uiState
	export let stringContent = undefined;
</script>

<JDGOverlay
	onCloseFunction={() => {
		doShowDevOverlay.set(false);
	}}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<!-- show the dev overlay content state at a minimum -->
	<JDGH3H4 h3String="DEV OVERLAY" />
	<div class="dev-overlay-content">
		{#if stringContent}
			{stringContent}
		{/if}
		<!-- consumers can also insert their own content -->
		<slot />
	</div>
</JDGOverlay>

<style>
	.dev-overlay-content {
		background-color: rgba(255, 255, 255, 1);
		font-size: 8px;
		justify-content: center;
		align-items: center;
		overflow-wrap: anywhere;
	}
</style>
