<script>
	import { JDGDevToolbar, JDGH3H4 } from '$lib/index.js';
	import { devToolbarStickyContent } from '$lib/stores/jdg-ui-store.js';
</script>

<div class="jdg-dev-toolbar-placement-container">
	<div class="dev-toolbar-sticky-content">
		<JDGDevToolbar />
		<div class="state-output">
			<JDGH3H4 h3String="TOOLBAR CONTENT STATE" />
			{$devToolbarStickyContent}
		</div>
		<!-- consumers can also insert their own content -->
		<slot />
	</div>
</div>

<style>
	.jdg-dev-toolbar-placement-container {
		width: 100%;
		position: fixed;
		bottom: 0;
		z-index: 1;
	}

	.dev-toolbar-sticky-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
		background-color: rgba(200, 200, 200, 1);
	}

	.state-output {
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 10px;
	}
</style>
