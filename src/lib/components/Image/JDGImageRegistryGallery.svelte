<script>
	import { onMount, getContext } from 'svelte';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';

	import { imagesLoading, repoName as currentRepoName } from '$lib/stores/jdg-ui-store.js';
	import {
		draftTimelineImageMetaRegistry,
		draftTimelineImageRegistryRepo
	} from '$lib/stores/jdg-temp-store.js';
	import { fetchImageMetaRegistry } from '$lib/jdg-persistence-management.js';

	import { showImageDetailModal } from '$lib/jdg-state-management.js';

	import {
		JDGTextInput,
		JDGButton,
		JDGImageTile,
		JDGLoadingSpinner,
		JDGFlyout,
		JDGCheckbox,
		JDGSelect
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Sort options for JDGSelect
	const sortOptionsGroup = {
		sort: {
			label: 'Sort order',
			'json-asc': { value: 'json-asc', label: 'By JSON (ascending)' },
			'json-desc': { value: 'json-desc', label: 'By JSON (descending)' },
			'date-asc': { value: 'date-asc', label: 'By date (oldest first)' },
			'date-desc': { value: 'date-desc', label: 'By date (newest first)' }
		}
	};

	// Get registry from context as fallback
	const contextImageMetaRegistry = getContext(JDG_CONTEXTS.IMAGE_META_REGISTRY);

	// Optional: pass a specific registry object (e.g., for Timeline with different registry)
	// If not provided, falls back to context
	export let imageMetaRegistry = undefined;

	// Optional: pass a repo name to fetch a remote registry
	// This takes precedence over imageMetaRegistry prop if provided and different from current repo
	export let registryRepoName = undefined;

	// Track the fetched registry from a remote repo
	let fetchedRegistry = undefined;
	let isFetchingRegistry = false;
	let fetchError = null;
	let lastFetchedRepoName = undefined;

	// Function to fetch registry - called reactively
	async function loadRemoteRegistry(repoName) {
		if (repoName === lastFetchedRepoName && fetchedRegistry) {
			// Already have this registry loaded
			return;
		}

		lastFetchedRepoName = repoName;
		isFetchingRegistry = true;
		fetchError = null;
		fetchedRegistry = undefined;

		try {
			const registry = await fetchImageMetaRegistry(repoName);
			// Only update if this is still the repo we want
			if (repoName === lastFetchedRepoName) {
				fetchedRegistry = registry;
				console.log(
					'✅ Loaded registry:',
					typeof registry,
					'| Sample keys:',
					Object.keys(registry || {}).slice(0, 5)
				);
			}
		} catch (err) {
			console.error('Failed to fetch registry from', repoName, err);
			if (repoName === lastFetchedRepoName) {
				fetchError = err.message;
				fetchedRegistry = undefined;
			}
		} finally {
			if (repoName === lastFetchedRepoName) {
				isFetchingRegistry = false;
			}
		}
	}

	// Trigger fetch when registryRepoName changes and is different from current repo
	$: if (registryRepoName && registryRepoName !== $currentRepoName) {
		loadRemoteRegistry(registryRepoName);
	} else if (!registryRepoName || registryRepoName === $currentRepoName) {
		// Reset fetched registry when using local/context registry
		fetchedRegistry = undefined;
		fetchError = null;
		lastFetchedRepoName = undefined;
	}

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

	// Sort mode: 'json-asc' | 'json-desc' | 'date-asc' | 'date-desc' (can be controlled by parent e.g. modal)
	export let sortMode = 'json-desc';
	let previousSortMode = sortMode;

	// When false, Options flyout is hidden (parent provides it, e.g. in modal's header row)
	export let showOptionsFlyout = true;

	// Track if content is ready (prevents showing empty container during load/filter)
	let isContentReady = false;

	// Extract Cloudinary version (Unix timestamp) from src URL for date sorting
	const getCloudinaryVersion = (img) => {
		const match = img.src?.match(/\/v(\d+)\//);
		return match ? parseInt(match[1], 10) : 0;
	};

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
			// When viewing a different registry, set the registry context so ImageMetaModal
			// can resolve the correct registry key and show "Edit" instead of "New"
			if (fetchedRegistry && registryRepoName) {
				draftTimelineImageMetaRegistry.set(fetchedRegistry);
				draftTimelineImageRegistryRepo.set(registryRepoName);
			}
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

	// Priority: fetchedRegistry (from remote repo) > imageMetaRegistry prop > context
	$: registryToUse = fetchedRegistry || imageMetaRegistry || contextImageMetaRegistry;
	$: allImages = flattenRegistry(registryToUse || {});

	// Sort images based on sortMode
	$: sortedImages = (() => {
		const arr = [...allImages];
		if (sortMode === 'json-asc') return arr;
		if (sortMode === 'json-desc') return arr.reverse();
		if (sortMode === 'date-asc') {
			return arr.sort((a, b) => getCloudinaryVersion(a) - getCloudinaryVersion(b));
		}
		if (sortMode === 'date-desc') {
			return arr.sort((a, b) => getCloudinaryVersion(b) - getCloudinaryVersion(a));
		}
		return arr;
	})();

	$: console.log(
		'📷 Gallery using registry:',
		fetchedRegistry ? 'fetched' : imageMetaRegistry ? 'prop' : 'context',
		'| Images found:',
		allImages.length
	);

	// Filter images based on search text
	$: filteredImages = sortedImages.filter((img) => {
		if (!filterText) return true;
		const searchLower = filterText.toLowerCase();
		const keyMatch = img.key.toLowerCase().includes(searchLower);
		const captionMatch = img.caption?.toLowerCase().includes(searchLower);
		return keyMatch || captionMatch;
	});

	// Reset visible count and content ready state when filter or sort changes
	$: if (filterText !== previousFilterText || sortMode !== previousSortMode) {
		previousFilterText = filterText;
		previousSortMode = sortMode;
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

	const galleryOptionsControlsCss = css`
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 8px 0;
		min-width: 200px;
	`;

	const sortSectionCss = css`
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 8px;
		border-top: 1px solid rgba(200, 200, 200, 0.5);
	`;

	const sortSectionTitleCss = css`
		font-weight: bold;
		font-size: 1.05rem;
		margin-bottom: 4px;
	`;
</script>

<div class="jdg-image-gallery">
	<div class={filterContainerCss}>
		{#if showFilter}
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
		{:else}
			<div style="flex: 1;"></div>
		{/if}
		{#if showOptionsFlyout}
			<JDGFlyout
				tooltip="Gallery options"
				flyoutTitle="Gallery Options"
				flyoutPosition="bottom-left"
			>
				<div class={galleryOptionsControlsCss}>
					<JDGCheckbox
						isEnabled={true}
						showLabel={true}
						label="Show captions"
						isChecked={showCaptions}
						onCheckAction={() => (showCaptions = true)}
						onUncheckAction={() => (showCaptions = false)}
						labelFontSize="14px"
					/>
					<div class={sortSectionCss}>
						<div class={sortSectionTitleCss}>Sort</div>
						<JDGSelect
							optionsGroup={sortOptionsGroup}
							bind:inputValue={sortMode}
							optionValueKey="value"
							optionLabelKey="label"
						/>
					</div>
				</div>
			</JDGFlyout>
		{/if}
	</div>

	<div
		class={galleryContainerCss}
		style="border: 1px solid {isContentReady && !isFetchingRegistry
			? jdgColors.border
			: 'transparent'};"
	>
		{#if isFetchingRegistry}
			<div class="loading-container">
				<JDGLoadingSpinner spinnerHeightPx={60} />
				<div style="margin-top: 12px; color: {jdgColors.textLight};">
					Loading images from {registryRepoName}...
				</div>
			</div>
		{:else if fetchError}
			<div class={noResultsCss}>
				Failed to load images: {fetchError}
			</div>
		{:else if !isContentReady && visibleImages.length > 0}
			<div class="loading-container">
				<JDGLoadingSpinner spinnerHeightPx={60} />
			</div>
		{:else if visibleImages.length === 0}
			<div class={noResultsCss}>
				{filterText ? 'No images match your filter' : 'No images available'}
			</div>
		{:else}
			{#key `${filterText}-${sortMode}`}
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
