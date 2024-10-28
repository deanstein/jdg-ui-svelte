<script>
	import { JDGDevToolbar, JDGH3H4 } from '$lib/index.js';

	// optionally output a string, like a snippet of uiState
	export let stringContent = undefined;
</script>

<div class="jdg-dev-toolbar-placement-container">
	<div class="dev-toolbar-sticky-content">
		<JDGDevToolbar />
		{#if stringContent}
			<div class="custom-output-container">
				<JDGH3H4 h3String="CUSTOM OUTPUT" />
				{stringContent}
			</div>
		{/if}
		<!-- consumers can also insert their own content -->
		<slot />
	</div>
</div>

<style>
	.jdg-dev-toolbar-placement-container {
		width: 100%;
		position: fixed;
		bottom: 0;
	}

	.dev-toolbar-sticky-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
		background-color: rgba(200, 200, 200, 1);
	}

	.custom-output-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 10px;
	}
</style>
