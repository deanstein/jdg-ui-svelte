<script>
	import { onMount, getContext } from 'svelte';
	import { css } from '@emotion/css';

	import { JDG_CONTEXTS } from '$lib/jdg-contexts.js';
	
	import { draftImageMetaRegistry } from '$lib/stores/jdg-temp-store.js';
	import { imagesLoading } from '$lib/stores/jdg-ui-store.js';

	import { showImageDetailModal } from '$lib/jdg-state-management.js';

	import { JDGTextInput, JDGButton, JDGImageTile, JDGLoadingSpinner } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Get registry from context as fallback if draft store is empty
	const contextImageMetaRegistry = getContext(JDG_CONTEXTS.IMAGE_META_REGISTRY);

	// Number of images per page
	export let imagesPerPage = 24;
	// Whether to show the filter input
	export let showFilter = true;
	// Whether to show captions on images
	export let showCaptions = false;
	// Image height for uniform sizing
	export let imageHeight = '20svh';
	// Custom click handler (default: open in viewer)
	/** @type {((imageMeta: any) => void) | undefined} */
	export let onClickImage = undefined;

	// Selection mode props
	export let selectionEnabled = false;
	export let selectedImages = [];
	// If true, only one image can be selected at a time (selecting replaces)
	export let singleSelect = false;
	// Optional callback when selection changes
	/** @type {((selection: string[]) => void) | undefined} */
	export let onSelectionChange = undefined;

	// Filter state
	let filterText = '';
	let previousFilterText = '';
	let visibleCount = imagesPerPage; // Start by showing one page worth
	let loadMoreIndicator; // Reference for IntersectionObserver
	let observer; // IntersectionObserver instance

	// Track if content is ready (prevents showing empty container during load/filter)
	let isContentReady = false;

	// Create a reactive set of selected image keys for fast lookup
	// selectedImages is now an array of registry key strings
	$: selectedImageKeys = new Set(selectedImages);

	// Check if an image is selected by its registry key
	const isImageSelected = (imageMeta, keys) => keys.has(imageMeta.key);

	// Toggle image selection
	// When in selection mode, store registry keys (strings) instead of full imageMeta objects
	const toggleImage = (imageMeta) => {
		if (!selectionEnabled) return;
		const selected = selectedImageKeys.has(imageMeta.key);

		if (singleSelect) {
			// Single select mode: clicking selected image deselects, otherwise replace selection
			selectedImages = selected ? [] : [imageMeta.key];
		} else {
			// Multi select mode: toggle the clicked image
			if (selected) {
				selectedImages = selectedImages.filter((key) => key !== imageMeta.key);
			} else {
				selectedImages = [...selectedImages, imageMeta.key];
			}
		}

		// Call the selection change callback if provided
		console.log(
			'JDGImageRegistryGallery selection changed:',
			selectedImages,
			'has callback:',
			!!onSelectionChange
		);
		if (onSelectionChange) {
			onSelectionChange(selectedImages);
		}
	};

	// Handle image click
	const handleImageClick = (imageMeta) => {
		if (selectionEnabled) {
			toggleImage(imageMeta);
		} else if (onClickImage) {
			onClickImage(imageMeta);
		} else {
			showImageDetailModal(imageMeta);
		}
	};

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

	// Use draft registry if available, otherwise fall back to context registry
	$: registryToUse =
		Object.keys($draftImageMetaRegistry || {}).length > 0
			? $draftImageMetaRegistry
			: contextImageMetaRegistry;
	$: allImages = flattenRegistry(registryToUse || {});

	// Filter images based on search text
	$: filteredImages = allImages.filter((img) => {
		if (!filterText) return true;
		const searchLower = filterText.toLowerCase();
		const keyMatch = img.key.toLowerCase().includes(searchLower);
		const captionMatch = img.caption?.toLowerCase().includes(searchLower);
		return keyMatch || captionMatch;
	});

	// Reset visible count and content ready state when filter actually changes
	$: if (filterText !== previousFilterText) {
		previousFilterText = filterText;
		visibleCount = imagesPerPage;
		isContentReady = false;
		// Wait a moment for images to start rendering before showing UI elements
		setTimeout(() => {
			isContentReady = true;
		}, 500);
	}

	// Show images up to visibleCount
	$: visibleImages = filteredImages.slice(0, visibleCount);
	$: hasMore = visibleCount < filteredImages.length;

	const clearFilter = () => {
		filterText = '';
		visibleCount = imagesPerPage;
	};

	// Load more images
	const loadMore = () => {
		if (hasMore) {
			visibleCount = Math.min(visibleCount + imagesPerPage, filteredImages.length);
		}
	};

	// Set up IntersectionObserver to detect when load more indicator is visible
	onMount(() => {
		// Mark content as ready after images have had time to start rendering
		setTimeout(() => {
			isContentReady = true;
		}, 500);

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && hasMore) {
						loadMore();
					}
				});
			},
			{ threshold: 0.1 }
		);

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	// Observe/unobserve the load more indicator when it changes
	$: if (loadMoreIndicator && observer) {
		observer.observe(loadMoreIndicator);
	}

	const galleryContainerCss = css`
		overflow-y: auto;
		overflow-x: hidden;
		padding: 12px;
		background-color: ${jdgColors.backgroundSubtle};
		scroll-behavior: smooth;
	`;

	const imageGridCss = css`
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
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

	const imageTileWrapperCss = css`
		position: relative;
		cursor: pointer;
		border-radius: 8px;
		transition: transform 0.2s ease;
		display: flex;
		flex-direction: column;
		width: fit-content;
		&:hover {
			transform: scale(1.02);
		}
	`;

	const selectedBadgeCss = css`
		position: absolute;
		top: 10px;
		left: 10px;
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
		z-index: 3;
	`;
</script>

<div class="jdg-image-gallery">
	{#if showFilter}
		<div class={filterContainerCss}>
			<div style="flex: 1;">
				<JDGTextInput bind:inputValue={filterText} placeholder="Filter by name or caption..." />
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
	{/if}

	<div
		class={galleryContainerCss}
		style="border: 1px solid {isContentReady ? jdgColors.border : 'transparent'};"
	>
		{#if !isContentReady && visibleImages.length > 0}
			<div class="loading-container">
				<JDGLoadingSpinner spinnerHeightPx={60} />
			</div>
		{:else if visibleImages.length === 0}
			<div class={noResultsCss}>
				{filterText ? 'No images match your filter' : 'No images available'}
			</div>
		{:else}
			{#key filterText}
				<div class={imageGridCss}>
					{#each visibleImages as imageMeta (imageMeta.key)}
						{@const selected = selectionEnabled && isImageSelected(imageMeta, selectedImageKeys)}
						<div
							class={imageTileWrapperCss}
							role="button"
							tabindex="0"
							on:click={() => handleImageClick(imageMeta)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleImageClick(imageMeta);
								}
							}}
						>
							<div class="image-container" style="--selection-color: {jdgColors.active}">
								{#if selected}
									<div class={selectedBadgeCss}>
										<i class="fa-solid fa-check" />
									</div>
									<div class="selection-border"></div>
								{/if}
								<JDGImageTile
									{imageMeta}
									onClickFunction={() => handleImageClick(imageMeta)}
									maxHeight={imageHeight}
									maxWidth="none"
									useAutoHeightOnMobile={false}
									cropToFillContainer={false}
									showCaption={showCaptions}
									showAttribution={false}
									showHorizontalStripesOnHover={!selectionEnabled}
								/>
							</div>
						</div>
					{/each}
				</div>
			{/key}

			{#if hasMore}
				<div bind:this={loadMoreIndicator} class={loadMoreIndicatorCss}>
					{#if isContentReady && $imagesLoading.length === 0}
						<i class="fa-solid fa-arrow-down" />
						Scroll down to load more images...
					{/if}
				</div>
			{:else if filteredImages.length > imagesPerPage && isContentReady && $imagesLoading.length === 0}
				<div class={showingInfoCss}>
					Showing all {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.jdg-image-gallery {
		width: 100%;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		min-height: 200px;
	}

	.image-container {
		width: auto;
		overflow: hidden;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.image-container :global(.jdg-image-tile-container) {
		height: 100%;
		width: auto;
	}

	.image-container :global(.image-tile) {
		height: 100%;
		width: auto;
	}

	.selection-border {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: 4px solid var(--selection-color, #2196f3);
		border-radius: 8px;
		pointer-events: none;
		z-index: 2;
	}
</style>
