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
	title="Image Gallery"
	subtitle="View all available images"
	onClickCloseButton={() => {
		$showImageGalleryModal = false;
	}}
	backgroundColor={'rgba(235, 235, 235, 1)'}
	minWidth="50vw"
	maxWidth="90vw"
	overflow="auto"
>
	<div slot="modal-content-slot" class="gallery-content-wrapper">
		<div class={checkboxContainerCss}>
			<JDGCheckbox label="Show captions" bind:isChecked={showCaptions} labelFontSize="14px" />
		</div>
		<JDGImageRegistryGallery imagesPerPage={48} {showCaptions} imageHeight="20svh" />
	</div>
</JDGModal>

<style>
	.gallery-content-wrapper {
		width: 100%;
		box-sizing: border-box;
	}
</style>
