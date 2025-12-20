<script>
	import { css } from '@emotion/css';
	import { showImageGalleryModal } from '$lib/stores/jdg-ui-store.js';
	import { JDGModal, JDGCheckbox } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import JDGImageRegistryGallery from './JDGImageRegistryGallery.svelte';

	// Whether to show captions (with checkbox toggle)
	let showCaptions = true;

	const checkboxContainerCss = css`
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid ${jdgColors.border};
	`;
</script>

<JDGModal
	title="Image Meta Registry Gallery"
	subtitle="View all available images in the image meta registry"
	onClickCloseButton={() => {
		$showImageGalleryModal = false;
	}}
	backgroundColor={'rgba(235, 235, 235, 1)'}
	width="90vw"
	height="80dvh"
	overflow="hidden"
>
	<div slot="modal-content-slot" class="gallery-content-wrapper">
		<div class={checkboxContainerCss}>
			<JDGCheckbox label="Show captions" bind:isChecked={showCaptions} labelFontSize="14px" />
		</div>
		<div class="gallery-scroll-container">
			<JDGImageRegistryGallery imagesPerPage={48} {showCaptions} imageHeight="20svh" />
		</div>
	</div>
</JDGModal>

<style>
	.gallery-content-wrapper {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
	}

	.gallery-scroll-container {
		flex: 1;
		overflow-y: auto;
		min-height: 0; /* Required for flex child scrolling */
	}
</style>
