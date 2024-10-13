<script>
	import { doShowDevOverlay } from '$lib/states/ui-state.js';
	import { JDGOverlay } from '$lib/index.js';

	import { devOverlayContent } from '$lib/states/ui-state.js';
</script>

<JDGOverlay
	onCloseFunction={() => {
		doShowDevOverlay.set(false);
	}}
	closeOnOverlayClick={false}
>
	<div class="dev-overlay-content">
		{JSON.stringify(devOverlayContent)}
	</div>
</JDGOverlay>

<style>
	.dev-overlay-content {
		background-color: rgba(255, 255, 255, 0.5);
		font-size: 8px;
		justify-content: center;
		align-items: center;
	}
</style>
