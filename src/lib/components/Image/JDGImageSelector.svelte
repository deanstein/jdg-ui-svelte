<script>
	import { css } from '@emotion/css';
	import { imageMetaRegistry } from '../../../routes/image-meta-registry.js';
	import { JDGImageTile, JDGButton, JDGTextInput } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// The selected images array - bind to this from parent
	export let selectedImages = [];
	// Whether the selector is enabled for editing
	export let isEnabled = true;
	// Maximum height for the selector
	export let maxHeight = '400px';
	// Number of images per page
	export let imagesPerPage = 24;

	// Filter state
	let filterText = '';
	let currentPage = 0;

	// Flatten the registry to get all images (handles nested structure like arch.*, exp.*, etc.)
	const flattenRegistry = (obj, prefix = '') => {
		let flat = [];
		for (const [key, value] of Object.entries(obj)) {
			const fullKey = prefix ? `${prefix}.${key}` : key;
			// Check if value has an 'src' property (it's an image)
			if (value?.src) {
				flat.push({
					key: fullKey,
					...value
				});
			}
			// If it's an object without src, it's a nested category
			else if (typeof value === 'object' && value !== null) {
				flat = flat.concat(flattenRegistry(value, fullKey));
			}
		}
		return flat;
	};

	const allImages = flattenRegistry(imageMetaRegistry);

	// Filter images based on search text
	$: filteredImages = allImages.filter((img) => {
		if (!filterText) return true;
		const searchLower = filterText.toLowerCase();
		const keyMatch = img.key.toLowerCase().includes(searchLower);
		const captionMatch = img.caption?.toLowerCase().includes(searchLower);
		return keyMatch || captionMatch;
	});

	// Reset to first page when filter changes
	$: if (filterText) {
		currentPage = 0;
	}

	// Paginate filtered images
	$: totalPages = Math.ceil(filteredImages.length / imagesPerPage);
	$: paginatedImages = filteredImages.slice(
		currentPage * imagesPerPage,
		(currentPage + 1) * imagesPerPage
	);

	// Pagination controls
	const goToNextPage = () => {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	};

	const goToPreviousPage = () => {
		if (currentPage > 0) {
			currentPage--;
		}
	};

	const clearFilter = () => {
		filterText = '';
		currentPage = 0;
	};

	// Create a reactive set of selected image sources for fast lookup
	// This ensures the UI updates immediately when selections change
	$: selectedImageSrcs = new Set(selectedImages.map((img) => img.src));

	// Check if an image is selected
	const isImageSelected = (imageMeta, selectedSrcs) => {
		return selectedSrcs.has(imageMeta.src);
	};

	// Toggle image selection
	const toggleImage = (imageMeta) => {
		if (!isEnabled) return;

		const selected = selectedImageSrcs.has(imageMeta.src);
		if (selected) {
			// Remove from selection - filter by src for consistency
			selectedImages = selectedImages.filter((img) => img.src !== imageMeta.src);
		} else {
			// Add to selection
			selectedImages = [...selectedImages, imageMeta];
		}
	};

	// Clear all selections
	const clearAll = () => {
		if (!isEnabled) return;
		selectedImages = [];
	};

	const selectorContainerCss = css`
		max-height: ${maxHeight};
		overflow-y: auto;
		overflow-x: hidden;
		border: 1px solid ${jdgColors.border};
		border-radius: 8px;
		padding: 12px;
		background-color: ${jdgColors.backgroundSubtle};
	`;

	const imageGridCss = css`
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 12px;
	`;

	const imageTileWrapperCss = css`
		position: relative;
		cursor: ${isEnabled ? 'pointer' : 'default'};
		border-radius: 8px;
		transition: transform 0.2s ease;
		&:hover {
			transform: ${isEnabled ? 'scale(1.05)' : 'none'};
		}
	`;

	const selectedBadgeCss = css`
		position: absolute;
		top: 4px;
		right: 4px;
		background-color: ${jdgColors.active};
		color: white;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		z-index: 1;
	`;

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

	const filterContainerCss = css`
		display: flex;
		gap: 8px;
		align-items: center;
		margin-bottom: 12px;
	`;

	const paginationCss = css`
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid ${jdgColors.border};
	`;

	const pageInfoCss = css`
		font-size: 14px;
		color: ${jdgColors.textLight};
		min-width: 120px;
		text-align: center;
	`;

	const noResultsCss = css`
		text-align: center;
		padding: 40px 20px;
		color: ${jdgColors.textLight};
		font-style: italic;
	`;
</script>

<div class="jdg-image-meta-selector">
	<div class={headerCss}>
		<div class={infoCss}>
			{selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
		</div>
		{#if selectedImages.length > 0 && isEnabled}
			<JDGButton
				label="Clear Selection"
				onClickFunction={clearAll}
				fontSize="12px"
				paddingLeftRight="12px"
				paddingTopBottom="4px"
				backgroundColor={jdgColors.backgroundSubtle}
			/>
		{/if}
	</div>

	<div class={filterContainerCss}>
		<div style="flex: 1;">
			<JDGTextInput
				bind:inputValue={filterText}
				{isEnabled}
				placeholder="Filter by name or caption..."
			/>
		</div>
		{#if filterText}
			<JDGButton
				label="Clear Filter"
				onClickFunction={clearFilter}
				fontSize="12px"
				paddingLeftRight="12px"
				paddingTopBottom="6px"
				backgroundColor={jdgColors.backgroundSubtle}
			/>
		{/if}
	</div>

	<div class={selectorContainerCss}>
		{#if paginatedImages.length === 0}
			<div class={noResultsCss}>
				{filterText ? 'No images match your filter' : 'No images available'}
			</div>
		{:else}
			<div class={imageGridCss}>
				{#each paginatedImages as imageMeta (imageMeta.key)}
					{@const selected = isImageSelected(imageMeta, selectedImageSrcs)}
					<div
						class={imageTileWrapperCss}
						role="button"
						tabindex={isEnabled ? 0 : -1}
						on:click={() => toggleImage(imageMeta)}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								toggleImage(imageMeta);
							}
						}}
						style={selected ? `outline: 4px solid ${jdgColors.active}; outline-offset: -4px;` : ''}
					>
						{#if selected}
							<div class={selectedBadgeCss}>
								<i class="fa-solid fa-check" />
							</div>
						{/if}
						<JDGImageTile
							{imageMeta}
							maxHeight="120px"
							maxWidth="120px"
							useAutoHeightOnMobile={false}
							cropToFillContainer={true}
							showCaption={false}
							showAttribution={false}
						/>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if totalPages > 1}
		<div class={paginationCss}>
			<JDGButton
				label="Previous"
				faIcon="fa-chevron-left"
				onClickFunction={goToPreviousPage}
				isEnabled={currentPage > 0}
				fontSize="12px"
				paddingLeftRight="12px"
				paddingTopBottom="6px"
				backgroundColor={jdgColors.backgroundSubtle}
			/>
			<div class={pageInfoCss}>
				Page {currentPage + 1} of {totalPages}
				<br />
				<span style="font-size: 12px;">
					({filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''})
				</span>
			</div>
			<JDGButton
				label="Next"
				faIcon="fa-chevron-right"
				onClickFunction={goToNextPage}
				isEnabled={currentPage < totalPages - 1}
				fontSize="12px"
				paddingLeftRight="12px"
				paddingTopBottom="6px"
				backgroundColor={jdgColors.backgroundSubtle}
			/>
		</div>
	{/if}
</div>

<style>
	.jdg-image-meta-selector {
		width: 100%;
	}
</style>
