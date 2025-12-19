<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { imageMetaRegistry } from '../../../routes/image-meta-registry.js';
	import { imagesLoading } from '$lib/stores/jdg-ui-store.js';
	import { JDGTextInput, JDGButton, JDGImageTile, JDGLoadingSpinner } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { showImageDetailModal } from '$lib/jdg-state-management.js';

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

	// Filter state
	let filterText = '';
	let previousFilterText = '';
	let visibleCount = imagesPerPage; // Start by showing one page worth
	let loadMoreIndicator; // Reference for IntersectionObserver
	let observer; // IntersectionObserver instance

	// Track if content is ready (prevents showing empty container during load/filter)
	let isContentReady = false;

	// Create a reactive set of selected image sources for fast lookup
	$: selectedImageSrcs = new Set(selectedImages.map((img) => img.src));

	// Check if an image is selected (pass selectedImageSrcs to ensure reactivity)
	const isImageSelected = (imageMeta, srcs) => srcs.has(imageMeta.src);

	// Toggle image selection
	const toggleImage = (imageMeta) => {
		if (!selectionEnabled) return;
		const selected = selectedImageSrcs.has(imageMeta.src);
		if (selected) {
			selectedImages = selectedImages.filter((img) => img.src !== imageMeta.src);
		} else {
			selectedImages = [...selectedImages, imageMeta];
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

	const allImages = flattenRegistry(imageMetaRegistry);

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
						{@const selected = selectionEnabled && isImageSelected(imageMeta, selectedImageSrcs)}
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
