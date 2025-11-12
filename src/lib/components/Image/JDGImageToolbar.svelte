<script>
	import { css } from '@emotion/css';

	export let imageMeta;

	let imageToolbarOverlayCss = css``;
	$: {
		imageToolbarOverlayCss = css`
			width: 100%;
			justify-content: ${imageMeta?.toolbarAlignment};
			padding: 10px;
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
		box-sizing: border-box;
		right: 0;
		bottom: 0;
	}

	.image-toolbar-container {
		height: 5svh;
		gap: 10px;
	}
</style>
