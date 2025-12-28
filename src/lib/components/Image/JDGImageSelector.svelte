<script>
	import { css } from '@emotion/css';

	import { repoName } from '$lib/stores/jdg-ui-store.js';
	import { getImageMetaRegistryLabel } from '$lib/jdg-persistence-management.js';
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGImageRegistryGallery,
		JDGNotificationBanner
	} from '$lib/index.js';
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
	// Optional: override the registry repo name (for context-driven use like Timeline)
	// If not provided, falls back to the current website's repoName
	export let registryRepoName = undefined;
	// If true, require a registry to be defined (blocks selection when undefined)
	// Use this for Timeline to enforce that images come from the host's assigned registry
	export let requireRegistry = false;

	// The effective registry to use: prop overrides repoName
	$: effectiveRegistry = registryRepoName || $repoName;

	// Check if registry is missing when required
	$: isRegistryMissing = requireRegistry && !registryRepoName;

	// Get the display label for the effective registry
	$: registryLabel = getImageMetaRegistryLabel(effectiveRegistry);

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
	<!-- Error banner when registry is required but missing -->
	<JDGNotificationBanner
		showBanner={isRegistryMissing}
		notificationType={jdgNotificationTypes.error}
		message="No Image Meta Registry assigned to this Timeline Host. Set the registry in the host's settings to enable image selection."
	/>

	{#if !isRegistryMissing}
		<!-- Registry indicator -->
		<JDGNotificationBanner
			showBanner={!!effectiveRegistry}
			notificationType={jdgNotificationTypes.information}
			message={`Browsing: ${registryLabel}`}
		/>

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
	{/if}
</div>

<style>
	.jdg-image-selector {
		width: 100%;
	}
</style>
