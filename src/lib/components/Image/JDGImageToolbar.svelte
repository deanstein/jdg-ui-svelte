<script>
	import { css } from '@emotion/css';

	export let imageMeta;
	export let toolbarAligment = 'bottom';

	let imageToolbarOverlayCss = css``;
	$: {
		imageToolbarOverlayCss = css`
			justify-content: ${imageMeta?.toolbarJustification};
			align-items: ${toolbarAligment};
		`;
	}
</script>

<div class="image-toolbar-overlay {imageToolbarOverlayCss}">
	<div class="image-toolbar-container">
		<slot />
	</div>
</div>

<style>
	.image-toolbar-overlay {
		position: absolute;
		display: flex;
		height: 100%;
		box-sizing: border-box;
		right: 0;
		bottom: 0;
		padding: 10px;
		z-index: 1;
	}

	.image-toolbar-container {
		height: 5svh;
		gap: 10px;
	}
</style>
