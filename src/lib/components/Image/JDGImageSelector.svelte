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
	let visibleCount = imagesPerPage; // Start by showing one page worth
	let scrollContainer; // Reference to scrollable container

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

	// Reset visible count when filter changes
	$: if (filterText !== undefined) {
		visibleCount = imagesPerPage;
	}

	// Show images up to visibleCount
	$: visibleImages = filteredImages.slice(0, visibleCount);
	$: hasMore = visibleCount < filteredImages.length;

	const clearFilter = () => {
		filterText = '';
		visibleCount = imagesPerPage;
	};

	// Load more images when scrolling near the bottom
	const handleScroll = (e) => {
		if (!hasMore) return;

		const container = e.target;
		const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

		// Load more when within 200px of the bottom
		if (scrollBottom < 200) {
			loadMore();
		}
	};

	// Load more images
	const loadMore = () => {
		if (hasMore) {
			visibleCount = Math.min(visibleCount + imagesPerPage, filteredImages.length);
		}
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
		scroll-behavior: smooth;
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

	const noResultsCss = css`
		text-align: center;
		padding: 40px 20px;
		color: ${jdgColors.textLight};
		font-style: italic;
	`;

	const loadMoreIndicatorCss = css`
		text-align: center;
		padding: 16px;
		color: ${jdgColors.textLight};
		font-size: 12px;
	`;

	const showingInfoCss = css`
		text-align: center;
		padding: 12px;
		margin-top: 8px;
		font-size: 12px;
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

	<div class={selectorContainerCss} bind:this={scrollContainer} on:scroll={handleScroll}>
		{#if visibleImages.length === 0}
			<div class={noResultsCss}>
				{filterText ? 'No images match your filter' : 'No images available'}
			</div>
		{:else}
			<div class={imageGridCss}>
				{#each visibleImages as imageMeta (imageMeta.key)}
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
							onClickFunction={() => {}}
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

			{#if hasMore}
				<div class={loadMoreIndicatorCss}>
					<i class="fa-solid fa-arrow-down" />
					Scroll down to load more images...
				</div>
			{:else if filteredImages.length > imagesPerPage}
				<div class={showingInfoCss}>
					Showing all {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.jdg-image-meta-selector {
		width: 100%;
	}
</style>
