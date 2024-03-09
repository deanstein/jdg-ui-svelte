<script>
	import { css } from '@emotion/css';

	import { setShowImageDetailModal } from '$lib/jdg-ui-management.js';

	import { JDGCloseIcon, JDGImageTile, JDGOverlay } from '$lib/index.js';
	import { jdgSizes } from '$lib/jdg-styling-constants.js';

	const onClickCloseButton = () => {
		setShowImageDetailModal(false);
	};

	const modalTitleBarCss = css`
		height: ${jdgSizes.headerHeightLg};
	`;
</script>

<JDGOverlay colorRgba="rgba(255, 255, 255, 0.6)">
	<div class="image-modal-content">
		<div class="image-modal-title-bar {modalTitleBarCss}">
			<div
				class="image-modal-close-button"
				role="button"
				tabindex="0"
				on:click={onClickCloseButton}
				on:keydown={onClickCloseButton}
			>
				<JDGCloseIcon />
			</div>
		</div>
		<div class="image-container">
			<JDGImageTile />
		</div>
	</div>
</JDGOverlay>

<style>
	.image-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
	}

	.image-modal-title-bar {
		display: flex;
		align-items: center;
		justify-content: end;
		width: 100%;
		padding: 15px;
	}

	.image-modal-close-button {
		cursor: pointer;
		z-index: 1;
	}

	.image-container {
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
	}
</style>
