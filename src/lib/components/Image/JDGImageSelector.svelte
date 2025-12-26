<script>
	import { css } from '@emotion/css';

	import { JDGButton, JDGCheckbox, JDGImageRegistryGallery } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// The selected images array - bind to this from parent
	export let selectedImages = [];
	// Whether the selector is enabled for editing
	export let isEnabled = true;
	// Number of images per page
	export let imagesPerPage = 24;
	// Image height for tiles
	export let imageHeight = '120px';
	// If true, only one image can be selected at a time
	export let singleSelect = false;
	// Optional callback when selection changes (useful to avoid bidirectional binding issues)
	/** @type {((selection: string[]) => void) | undefined} */
	export let onSelectionChange = undefined;

	// Whether to show captions (with checkbox toggle)
	let showCaptions = false;

	// Clear all selections
	const clearAll = () => {
		if (!isEnabled) return;
		selectedImages = [];
		if (onSelectionChange) {
			onSelectionChange(selectedImages);
		}
	};

	// Handle selection changes from gallery
	const handleGallerySelection = (newSelection) => {
		console.log(
			'JDGImageSelector handleGallerySelection:',
			newSelection,
			'has callback:',
			!!onSelectionChange
		);
		selectedImages = newSelection;
		if (onSelectionChange) {
			onSelectionChange(selectedImages);
		}
	};

	const headerCss = css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid ${jdgColors.border};
	`;

	const infoCss = css`
		font-size: 14px;
		color: ${jdgColors.textLight};
	`;
</script>

<div class="jdg-image-selector">
	<div class={headerCss}>
		<div style="display: flex; align-items: center; gap: 12px;">
			<JDGCheckbox label="Show captions" bind:isChecked={showCaptions} labelFontSize="14px" />
			{#if !singleSelect}
				<div class={infoCss}>
					{selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
				</div>
			{/if}
		</div>
		{#if selectedImages.length > 0 && isEnabled}
			<JDGButton
				label={singleSelect ? 'Clear' : 'Clear Selection'}
				onClickFunction={clearAll}
				fontSize="12px"
				paddingLeftRight="12px"
				paddingTopBottom="4px"
				backgroundColor={jdgColors.backgroundSubtle}
			/>
		{/if}
	</div>

	<JDGImageRegistryGallery
		{imagesPerPage}
		{showCaptions}
		{imageHeight}
		{singleSelect}
		selectionEnabled={isEnabled}
		bind:selectedImages
		onSelectionChange={handleGallerySelection}
	/>
</div>

<style>
	.jdg-image-selector {
		width: 100%;
	}
</style>
