<script>
	import { devOverlayContent, doShowDevOverlay } from '$lib/states/ui-state.js';

	import { JDGH3H4, JDGOverlay } from '$lib/index.js';
</script>

<JDGOverlay
	onCloseFunction={() => {
		doShowDevOverlay.set(false);
	}}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<!-- show the dev overlay content state at a minimum -->
	<JDGH3H4 h3String="DEV OVERLAY" />
	<JDGH3H4 h4String="OVERLAY CONTENT STATE" />
	<div class="state-output">
		{$devOverlayContent}
		<!-- consumers can also insert their own content -->
		<slot />
	</div>
</JDGOverlay>

<style>
	.state-output {
		background-color: rgba(255, 255, 255, 1);
		font-size: 8px;
		justify-content: center;
		align-items: center;
		overflow-wrap: anywhere;
	}
</style>
