<script>
	import { css } from '@emotion/css';
	import { showImageGalleryModal, repoName } from '$lib/stores/jdg-ui-store.js';
	import {
		imageMetaRegistryOptions,
		jdgUiSvelteRepoName
	} from '$lib/jdg-persistence-management.js';
	import { JDGModal, JDGCheckbox, JDGSelect } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import JDGImageRegistryGallery from './JDGImageRegistryGallery.svelte';

	// Whether to show captions (with checkbox toggle)
	let showCaptions = true;

	// Registry to show: default to current app repo (uiSvelte)
	let selectedRepoName;
	$: defaultRepo = $repoName ?? jdgUiSvelteRepoName;
	$: if (selectedRepoName == null && defaultRepo) {
		selectedRepoName = defaultRepo;
	}

	const controlsContainerCss = css`
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid ${jdgColors.border};
	`;

	const selectLabelCss = css`
		font-size: 14px;
		color: ${jdgColors.text};
	`;

	const selectWrapperCss = css`
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 200px;
	`;
</script>

<JDGModal
	title="Image Meta Registry Gallery"
	subtitle="View available images in a given registry"
	onClickCloseButton={() => {
		$showImageGalleryModal = false;
	}}
	backgroundColor={'rgba(235, 235, 235, 1)'}
	width="90vw"
	height="80dvh"
	overflow="hidden"
>
	<div slot="modal-content-slot" class="gallery-content-wrapper">
		<div class={controlsContainerCss}>
			<div class={selectWrapperCss}>
				<span class={selectLabelCss}>Registry:</span>
				<JDGSelect optionsGroup={imageMetaRegistryOptions} bind:inputValue={selectedRepoName} />
			</div>
			<JDGCheckbox label="Show captions" bind:isChecked={showCaptions} labelFontSize="14px" />
		</div>
		<div class="gallery-scroll-container">
			<JDGImageRegistryGallery
				imagesPerPage={48}
				{showCaptions}
				imageHeight="20svh"
				registryRepoName={selectedRepoName}
			/>
		</div>
	</div>
</JDGModal>

<style>
	.gallery-content-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
		width: 100%;
	}

	.gallery-scroll-container {
		flex: 1;
		overflow-y: auto;
		min-height: 0; /* Required for flex child scrolling */
	}
</style>
