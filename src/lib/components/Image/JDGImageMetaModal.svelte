<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { repoName, showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import {
		draftImageMeta,
		draftImageMetaRegistry,
		saveStatus
	} from '$lib/stores/jdg-temp-store.js';
	import {
		areObjectsEqual,
		extractCloudinaryAssetpath,
		getIsObjectInObject,
		instantiateObject,
		replaceCloudinaryAssetPath as replaceCloudinaryAssetPathInUrl,
		upgradeImageMeta
	} from '$lib/jdg-utils.js';
	import {
		deleteCloudinaryImage,
		getImageMetaSrcUsageInRepos,
		renameCloudinaryImage,
		replaceUrlAcrossRepos,
		writeImageMetaEntryToRepo
	} from '$lib/jdg-persistence-management.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGComposeToolbar,
		JDGImageTile,
		JDGInputContainer,
		JDGModal,
		JDGNotificationBanner,
		JDGSaveStateBanner,
		JDGTextInput
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import jdgSaveStatus from '$lib/schemas/jdg-save-status.js';

	const newImagePath = 'jdg-ui-svelte/image-testing/new-image.jpg';

	// Bind the hidden fileInput to a custom button for file picking
	let fileInput;
	// Container for ComposeToolbar
	let modalContainerRef;

	// Keep track of the original metal for comparison purposes
	let originalDraftMeta;

	// Registry key is separate from the id field (which is a UUID)
	// For new images, auto-derived from filename; for existing, extracted from registry
	let registryKey = '';
	// Store the original registry key so it doesn't change when filename changes
	let originalRegistryKey = '';

	// For new images, should registry key match Cloudinary folder nesting?
	let matchCloudinaryNesting = true;

	// Should Alt field sync with Caption field?
	let syncAltWithCaption = true;

	// Shows a banner when uploading
	let isUploading = false;

	// State for checking URL usage across repos
	let isCheckingUsage = false;

	// Track if this is a new image (no src with Cloudinary URL)
	$: isNewImage = !originalDraftMeta?.src || !originalDraftMeta.src.includes('cloudinary');

	// Extract asset path from src URL for both new and existing images
	// For brand new images without a Cloudinary URL yet, use the default path
	$: assetPath = extractCloudinaryAssetpath($draftImageMeta?.src) || newImagePath;

	// For new images, auto-generate registry key from filename (without extension)
	// For existing images, keep the original registry key
	$: {
		if (isNewImage && assetPath) {
			const pathParts = assetPath.split('/');

			if (matchCloudinaryNesting && pathParts.length > 2) {
				// Match Cloudinary nesting: use folder(s) + filename
				// Skip the root folder (e.g., 'jdg-ui-svelte')
				const registryKeyParts = pathParts.slice(1).map(
					(part) =>
						part
							.replace(/\.[^/.]+$/, '') // Remove extension
							.replace(/[^a-zA-Z0-9_]/g, '_') // Clean special chars
				);
				registryKey = registryKeyParts.join('.');
			} else {
				// Don't match nesting: only use filename
				const filename = pathParts[pathParts.length - 1];
				const filenameWithoutExt = filename.replace(/\.[^/.]+$/, ''); // Remove extension
				// Convert to valid identifier (replace spaces/special chars with underscores)
				registryKey = filenameWithoutExt.replace(/[^a-zA-Z0-9_]/g, '_');
			}
		} else if (originalRegistryKey) {
			// For existing images, use the original key (don't update if filename changes)
			registryKey = originalRegistryKey;
		}
	}

	// When the asset path is modified,
	// show a banner that the image must be deleted and reuploaded
	$: hasAssetPathChanged = $draftImageMeta?.src !== originalDraftMeta?.src;
	// If there are unsaved changes,
	// show a banner and show the cancel/done buttons
	$: hasUnsavedChanges = !areObjectsEqual($draftImageMeta, originalDraftMeta);

	// Sync Alt with Caption when locked
	$: {
		if (syncAltWithCaption && $draftImageMeta) {
			draftImageMeta.update((meta) => ({
				...meta,
				alt: meta.caption || meta.alt
			}));
		}
	}

	// When the asset path changes, update the cloudinary URL
	const onAssetPathChange = (e) => {
		const newPath = e.target.value;
		draftImageMeta.update((meta) => {
			// For new images, construct a Cloudinary URL from scratch
			if (isNewImage) {
				return {
					...meta,
					src: `https://res.cloudinary.com/jdg-main/image/upload/${newPath}`
				};
			}
			// For existing images, replace the path in the existing URL
			return {
				...meta,
				src: replaceCloudinaryAssetPathInUrl(meta.src, newPath)
			};
		});
	};

	const onClickFileUpload = async () => {
		// Trigger file picker if no file is selected yet
		if (!fileInput?.files?.length) {
			fileInput.click();
			return;
		}

		const file = fileInput.files[0];
		if (!file) {
			console.warn('No file selected.');
			return;
		}

		// For new images, check if registry key already exists
		// (Registry key is auto-generated from filename)
		if (isNewImage) {
			// Check for top-level key
			if (get(draftImageMetaRegistry)[registryKey]) {
				const confirmOverwrite = confirm(
					`A registry entry with key "${registryKey}" already exists. Do you want to overwrite it?`
				);
				if (!confirmOverwrite) {
					return;
				}
			}
		}

		// For new images, use the assetPath state; for existing, extract from src
		const fullAssetPath = isNewImage ? assetPath : extractCloudinaryAssetpath($draftImageMeta.src);

		if (!fullAssetPath) {
			alert('Missing asset path for upload. Please set an asset path.');
			return;
		}

		// Parse the full asset path into folder + filename
		// e.g., "jdg-ui-svelte/my-image.jpg" → folder: "jdg-ui-svelte", fileName: "my-image.jpg"
		const pathParts = fullAssetPath.split('/');
		let fileName = pathParts.pop();
		const folderPath = pathParts.join('/');

		if (!fileName) {
			alert('Asset path must include a filename (e.g., jdg-ui-svelte/my-image.jpg).');
			return;
		}

		// Strip ALL trailing image extensions from fileName - Cloudinary worker will add the correct one
		// This prevents/fixes double extensions like "image.jpg.jpg.jpg"
		const imageExtPattern = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff?|avif)$/i;
		while (imageExtPattern.test(fileName)) {
			fileName = fileName.replace(imageExtPattern, '');
		}
		console.log('📎 Cleaned fileName:', fileName);

		// Store original URL and path for later use
		const originalSrc = originalDraftMeta?.src;
		const originalFullPath = isNewImage ? null : extractCloudinaryAssetpath(originalSrc);
		const hasPathChanged = !isNewImage && originalFullPath && originalFullPath !== fullAssetPath;

		// Debug logging
		console.log('📋 Upload check:', {
			isNewImage,
			originalSrc,
			originalFullPath,
			fullAssetPath,
			hasPathChanged
		});

		// For existing images, check if URL is used in other repos
		// This applies even if path hasn't changed, because re-uploading changes the version/URL
		let reposWithUrl = [];
		const currentRepoName = get(repoName);

		if (!isNewImage && originalSrc) {
			console.log('🔍 Checking if URL is used in other repos before upload...');
			isCheckingUsage = true;
			try {
				const usageResults = await getImageMetaSrcUsageInRepos(originalSrc, currentRepoName);
				reposWithUrl = usageResults.filter((r) => r.found);

				console.log('📊 Usage results:', { reposWithUrl, total: usageResults.length });

				if (reposWithUrl.length > 0) {
					const repoList = reposWithUrl.map((r) => r.repoName).join('\n   • ');
					const confirmProceed = confirm(
						`⚠️ This URL is also used in ${reposWithUrl.length} other repo(s):\n\n   • ${repoList}\n\nRe-uploading will change the URL. All these repos will be updated with the new URL.\n\nContinue?`
					);
					if (!confirmProceed) {
						// Clear file input so user can try again
						fileInput.value = '';
						isCheckingUsage = false;
						return;
					}
				} else {
					console.log('ℹ️ URL not found in other repos, proceeding with upload');
				}
			} catch (err) {
				console.warn('⚠️ Could not check URL usage:', err.message);
				// Ask user if they want to continue anyway
				const continueAnyway = confirm(
					`⚠️ Could not check if URL is used in other repos:\n${err.message}\n\nDo you want to continue anyway? Other repos may not be updated.`
				);
				if (!continueAnyway) {
					fileInput.value = '';
					isCheckingUsage = false;
					return;
				}
			}
			isCheckingUsage = false;
		}

		console.log(`📤 Uploading "${file.name}" to "${fullAssetPath}"...`);
		saveStatus.set(jdgSaveStatus.uploading);

		try {
			// Step 1: Upload new image to Cloudinary
			const uploadRes = await fetch(
				`https://jdg-cloudinary.jdeangoldstein.workers.dev/upload-image?folder=${encodeURIComponent(
					folderPath
				)}&fileName=${encodeURIComponent(fileName)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': file.type
					},
					body: file
				}
			);

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok || !uploadData.success) {
				throw new Error(uploadData.error || 'Upload failed');
			}

			const newUrl = uploadData.url;
			console.log('✅ Upload complete:', newUrl);

			// Step 2: Delete old image if path changed
			if (hasPathChanged) {
				// Parse original path into folder and filename
				const origPathParts = originalFullPath.split('/');
				const origFileName = origPathParts.pop();
				const origFolderPath = origPathParts.join('/');

				console.log(`🗑️ Deleting old image at "${originalFullPath}" because path changed...`);
				try {
					await deleteCloudinaryImage(origFolderPath, origFileName);
				} catch (deleteErr) {
					console.warn(
						'⚠️ Failed to delete old image (may not exist or already deleted):',
						deleteErr.message
					);
					// Continue even if delete fails - the upload succeeded
				}
			}

			// Step 3: Update image src in draft meta
			draftImageMeta.update((meta) => ({ ...meta, src: newUrl }));

			// Step 4: Update the registry store with the new image meta
			// Use the registry key (not the UUID id) as the object key
			// Handle nested keys like "arch.atc_elevator"
			draftImageMetaRegistry.update((registry) =>
				setNestedRegistryValue(registry, registryKey, get(draftImageMeta))
			);

			// Step 5: Write to current repo
			if (!currentRepoName) {
				throw new Error('No repo name set. Cannot write registry to GitHub.');
			}

			console.log(`💾 Writing image entry "${registryKey}" to ${currentRepoName}...`);
			saveStatus.set(jdgSaveStatus.saving);

			const writeResult = await writeImageMetaEntryToRepo(
				currentRepoName,
				registryKey,
				get(draftImageMeta)
			);

			if (!writeResult) {
				throw new Error('Failed to write entry to GitHub');
			}

			console.log('✅ Registry saved to current repo');

			// Step 6: Update other repos if they contain the old URL
			// This applies for any re-upload since the URL changes (version number changes)
			if (reposWithUrl.length > 0 && originalSrc) {
				console.log(`🔄 Updating URL in ${reposWithUrl.length} other repo(s)...`);

				const { updated, failed } = await replaceUrlAcrossRepos(
					originalSrc,
					newUrl,
					currentRepoName
				);

				if (updated.length > 0) {
					console.log(`✅ Updated ${updated.length} repo(s): ${updated.join(', ')}`);
				}
				if (failed.length > 0) {
					console.warn(`⚠️ Failed to update ${failed.length} repo(s):`, failed);
					alert(
						`Warning: Failed to update some repos:\n${failed
							.map((f) => `${f.repoName}: ${f.error}`)
							.join('\n')}\n\nYou may need to update these manually.`
					);
				}
			}

			// Indicate the save was successful, and the site will be rebuilt
			saveStatus.set(jdgSaveStatus.saveSuccessRebuilding);

			// Update the original draft meta to reflect the new saved state
			originalDraftMeta = instantiateObject(get(draftImageMeta));

			// Clear file input so it can be reused
			fileInput.value = '';
		} catch (err) {
			console.error('❌ Upload/Save error:', err.message);
			saveStatus.set(jdgSaveStatus.saveFailed);
			saveStatus.set(undefined);
			alert(`Error: ${err.message}`);
		}
	};

	// Helper function to find registry key by src URL (handles nested structures)
	const findRegistryKeyBySrc = (registry, targetSrc, parentKey = '') => {
		for (const [key, value] of Object.entries(registry)) {
			const fullKey = parentKey ? `${parentKey}.${key}` : key;

			if (value && typeof value === 'object') {
				// Check if this entry has a src that matches
				if (value.src === targetSrc) {
					return fullKey;
				}
				// Recurse into nested objects (but not if it has a src - that means it's an image entry)
				if (!value.src) {
					const found = findRegistryKeyBySrc(value, targetSrc, fullKey);
					if (found) return found;
				}
			}
		}
		return null;
	};

	// Check if the current image URL is used in other repos
	const onCheckUrlUsage = async () => {
		const currentSrc = $draftImageMeta?.src;
		if (!currentSrc || !currentSrc.includes('cloudinary')) {
			alert('No valid Cloudinary URL to check.');
			return;
		}

		isCheckingUsage = true;

		try {
			const currentRepoName = get(repoName);
			const results = await getImageMetaSrcUsageInRepos(currentSrc, currentRepoName);

			// Find repos where the URL was found
			const reposWithUrl = results.filter((r) => r.found);
			const reposWithErrors = results.filter((r) => r.error);

			let message;

			if (reposWithUrl.length === 0) {
				message = '✅ This URL is not used in any other repos.';
			} else {
				message = `⚠️ This URL is referenced in ${reposWithUrl.length} other repo(s):\n\n`;

				for (const { repoName: repo } of reposWithUrl) {
					message += `   • ${repo}\n`;
				}

				message +=
					'\nIf you change this URL, you will need to update these references in other repos.';
			}

			// Always show repos that couldn't be checked
			if (reposWithErrors.length > 0) {
				message += `\n\n⚠️ Could not check ${reposWithErrors.length} repo(s): ${reposWithErrors
					.map((r) => r.repoName)
					.join(', ')}`;
			}

			alert(message);
		} catch (err) {
			console.error('❌ Error checking URL usage:', err);
			alert(`Error checking URL usage: ${err.message}`);
		} finally {
			isCheckingUsage = false;
		}
	};

	// Move an existing image to a new path in Cloudinary (rename operation)
	const onMoveImage = async () => {
		if (!hasAssetPathChanged || isNewImage) return;

		const originalPath = extractCloudinaryAssetpath(originalDraftMeta.src);
		const newPath = extractCloudinaryAssetpath($draftImageMeta.src);

		if (!originalPath || !newPath) {
			alert('Could not determine image paths');
			return;
		}

		// Check usage in other repos first
		const currentRepoName = get(repoName);
		let reposWithUrl = [];

		isCheckingUsage = true;
		try {
			const usageResults = await getImageMetaSrcUsageInRepos(
				originalDraftMeta.src,
				currentRepoName
			);
			reposWithUrl = usageResults.filter((r) => r.found);

			if (reposWithUrl.length > 0) {
				const repoList = reposWithUrl.map((r) => r.repoName).join('\n   • ');
				const confirmProceed = confirm(
					`⚠️ This image URL is used in ${reposWithUrl.length} other repo(s):\n\n   • ${repoList}\n\nMoving will update all references automatically.\n\nContinue?`
				);
				if (!confirmProceed) {
					isCheckingUsage = false;
					return;
				}
			}
		} catch (err) {
			console.warn('⚠️ Could not check URL usage:', err.message);
			const continueAnyway = confirm(
				`⚠️ Could not check if URL is used in other repos:\n${err.message}\n\nDo you want to continue anyway? Other repos may not be updated.`
			);
			if (!continueAnyway) {
				isCheckingUsage = false;
				return;
			}
		}
		isCheckingUsage = false;

		saveStatus.set(jdgSaveStatus.saving);

		try {
			// Step 1: Rename in Cloudinary
			console.log(`🔄 Moving image from "${originalPath}" to "${newPath}"...`);
			const renameResult = await renameCloudinaryImage(originalPath, newPath);

			// Step 2: Update the src with the new URL from Cloudinary
			const newUrl = renameResult.url;
			draftImageMeta.update((meta) => ({ ...meta, src: newUrl }));

			// Step 3: Update registry and save to current repo
			draftImageMetaRegistry.update((registry) =>
				setNestedRegistryValue(registry, registryKey, get(draftImageMeta))
			);

			console.log(`💾 Writing image entry "${registryKey}" to ${currentRepoName}...`);

			const writeResult = await writeImageMetaEntryToRepo(
				currentRepoName,
				registryKey,
				get(draftImageMeta)
			);

			if (!writeResult) {
				throw new Error('Failed to write entry to GitHub');
			}

			console.log('✅ Registry saved to current repo');

			// Step 4: Update other repos if they contain the old URL
			if (reposWithUrl.length > 0) {
				console.log(`🔄 Updating URL in ${reposWithUrl.length} other repo(s)...`);

				const { updated, failed } = await replaceUrlAcrossRepos(
					originalDraftMeta.src,
					newUrl,
					currentRepoName
				);

				if (updated.length > 0) {
					console.log(`✅ Updated ${updated.length} repo(s): ${updated.join(', ')}`);
				}
				if (failed.length > 0) {
					console.warn(`⚠️ Failed to update ${failed.length} repo(s):`, failed);
					alert(
						`Warning: Failed to update some repos:\n${failed
							.map((f) => `${f.repoName}: ${f.error}`)
							.join('\n')}\n\nYou may need to update these manually.`
					);
				}
			}

			saveStatus.set(jdgSaveStatus.saveSuccessRebuilding);

			// Update the original draft meta to reflect the new saved state
			originalDraftMeta = instantiateObject(get(draftImageMeta));
		} catch (err) {
			console.error('❌ Move error:', err.message);
			saveStatus.set(jdgSaveStatus.saveFailed);
			setTimeout(() => saveStatus.set(undefined), 3000);
			alert(`Error moving image: ${err.message}`);
		}
	};

	// Helper function to set a value at a nested path in the registry
	const setNestedRegistryValue = (registry, path, value) => {
		const keys = path.split('.');
		const newRegistry = { ...registry };

		// If it's a top-level key (no dots)
		if (keys.length === 1) {
			newRegistry[path] = value;
			return newRegistry;
		}

		// Navigate to the nested location
		let current = newRegistry;
		for (let i = 0; i < keys.length - 1; i++) {
			const key = keys[i];
			// Create nested object if it doesn't exist
			if (!current[key] || typeof current[key] !== 'object') {
				current[key] = {};
			} else {
				// Clone the nested object to avoid mutation
				current[key] = { ...current[key] };
			}
			current = current[key];
		}

		// Set the final value
		current[keys[keys.length - 1]] = value;
		return newRegistry;
	};

	onMount(() => {
		const currentMeta = get(draftImageMeta);

		// For existing images, find the registry key by looking up the src URL in the registry
		// Do this BEFORE upgrade, since we need to find the original entry
		if (currentMeta?.src && currentMeta.src.includes('cloudinary')) {
			const registry = get(draftImageMetaRegistry);
			const foundKey = findRegistryKeyBySrc(registry, currentMeta.src);
			if (foundKey) {
				registryKey = foundKey;
				originalRegistryKey = foundKey; // Store so it doesn't change if filename changes
				console.log(`📋 Found registry key: "${foundKey}"`);
			} else {
				console.warn(
					'⚠️ Could not find registry key for existing image with src:',
					currentMeta.src
				);
			}
		}

		// Always upgrade to ensure UUID id is present
		draftImageMeta.set(upgradeImageMeta(currentMeta));

		// Set initial sync state: if alt is undefined or matches caption, enable sync
		const upgradedMeta = get(draftImageMeta);
		syncAltWithCaption = !upgradedMeta.alt || upgradedMeta.alt === upgradedMeta.caption;

		// Store the image meta to compare before any changes
		originalDraftMeta = instantiateObject($draftImageMeta);
	});
</script>

<JDGModal
	title={getIsObjectInObject($draftImageMetaRegistry, 'id', $draftImageMeta?.id)
		? 'Edit Image Meta'
		: 'New Image Meta'}
	subtitle={null}
	onClickCloseButton={() => {
		showImageMetaModal.set(false);
		draftImageMeta.set(undefined);
	}}
	closeOnOverlayClick={false}
>
	<div bind:this={modalContainerRef} slot="modal-content-slot" class="image-meta-modal-scrollable">
		{#if $draftImageMeta}
			<!-- Banner when saving or uploading -->
			<JDGSaveStateBanner />
			<!-- Changes detected banner -->
			<JDGNotificationBanner
				showBanner={hasUnsavedChanges && !$saveStatus && !isNewImage}
				notificationType={jdgNotificationTypes.warning}
				message={'Changes detected. Next, click Done or Cancel below.'}
			/>
			<!-- No repo name set banner -->
			<JDGNotificationBanner
				showBanner={!get(repoName)}
				notificationType={jdgNotificationTypes.error}
				message={'No repo name set! +layout.svelte must set the repo name.'}
			/>
			<!-- Image preview -->
			<div class="image-preview-wrapper">
				<JDGImageTile imageMeta={$draftImageMeta} maxHeight="20svh" cropToFillContainer={false} />
			</div>

			<!-- Spacer-->
			<div style="height: 20px;" />

			<!-- Registry Key (auto-generated for new images) -->
			<JDGInputContainer label="Registry Key">
				<div style="display: flex; flex-direction: column; gap: 8px;">
					<div>{registryKey || '(derived from filename)'}</div>
					{#if isNewImage}
						<JDGCheckbox
							bind:isChecked={matchCloudinaryNesting}
							label="Match Cloudinary folder nesting"
						/>
					{/if}
				</div>
			</JDGInputContainer>

			<!-- ID (UUID for programmatic lookup) -->
			<JDGInputContainer label="ID">
				{$draftImageMeta.id || '(Will be auto-generated)'}
			</JDGInputContainer>
			<JDGInputContainer label="Version">
				{$draftImageMeta.version}
			</JDGInputContainer>
			<JDGInputContainer label="Source">
				<div class="image-src-string">
					{$draftImageMeta.src}
				</div>
			</JDGInputContainer>

			<!-- Editable values -->
			<!-- Show a banner when the asset path has changed -->
			<JDGNotificationBanner
				showBanner={hasAssetPathChanged && !isNewImage}
				notificationType={jdgNotificationTypes.warning}
				message={'The asset path has changed. Clicking Done will rename the image in Cloudinary.'}
			/>
			<!-- Show a banner when we can't determine other repo impacts due to asset path change -->
			<JDGNotificationBanner
				showBanner={hasAssetPathChanged && !isNewImage && $repoName === undefined}
				notificationType={jdgNotificationTypes.error}
				message={'No repo name set. \nImages in other repos may break as a result of this change.'}
			/>
			<JDGInputContainer label="Asset Path">
				<JDGTextInput inputValue={assetPath} onInputFunction={onAssetPathChange} />
			</JDGInputContainer>
			<!-- Check URL usage in other repos button -->
			{#if !isNewImage}
				<div class="check-usage-button-container">
					<JDGButton
						label={isCheckingUsage ? 'Checking...' : 'Check usage in other repos'}
						faIcon={isCheckingUsage ? 'fa-spinner fa-spin' : 'fa-search'}
						fontSize="0.7rem"
						onClickFunction={onCheckUrlUsage}
						paddingLeftRight="10px"
						paddingTopBottom="5px"
						isEnabled={!isCheckingUsage}
						backgroundColor={jdgColors.activeSecondary}
						textColor={jdgColors.textDm}
					/>
				</div>
			{/if}
			<div class="upload-button-container">
				<JDGButton
					label="Upload..."
					faIcon="fa-upload"
					onClickFunction={onClickFileUpload}
					paddingLeftRight="10px"
					paddingTopBottom="5px"
				/>
				<!-- Hidden file input for button to trigger upload -->
				<input
					type="file"
					style="display: none;"
					on:change={onClickFileUpload}
					bind:this={fileInput}
				/>
			</div>
			<JDGInputContainer label="Title">
				<JDGTextInput inputValue={$draftImageMeta.title} />
			</JDGInputContainer>
			<JDGInputContainer label="Caption">
				<JDGTextInput bind:inputValue={$draftImageMeta.caption} />
			</JDGInputContainer>
			<JDGInputContainer label="Alt">
				<div style="display: flex; flex-direction: column; gap: 8px;">
					<JDGTextInput bind:inputValue={$draftImageMeta.alt} isEnabled={!syncAltWithCaption} />
					<JDGCheckbox bind:isChecked={syncAltWithCaption} label="Sync Alt with Caption" />
				</div>
			</JDGInputContainer>
			<JDGInputContainer label="Attribution">
				<JDGTextInput bind:inputValue={$draftImageMeta.attribution} />
			</JDGInputContainer>
			<JDGInputContainer label="Show background blur?">
				<label>
					<input type="radio" bind:group={$draftImageMeta.showBackgroundBlur} value={true} />
					Yes
				</label>
				<label>
					<input type="radio" bind:group={$draftImageMeta.showBackgroundBlur} value={false} />
					No
				</label>
			</JDGInputContainer>
			<JDGInputContainer label="Toolbar alignment">
				<JDGTextInput bind:inputValue={$draftImageMeta.toolbarJustification} />
			</JDGInputContainer>
		{/if}
		<!-- Only show compose toolbar if unsaved changes and repo name is set -->
		{#if hasUnsavedChanges && get(repoName)}
			<JDGComposeToolbar
				parentRef={modalContainerRef}
				onClickCompose={() => {}}
				onClickDone={async () => {
					try {
						// If asset path changed on existing image, perform move operation instead
						if (hasAssetPathChanged && !isNewImage) {
							await onMoveImage();
							return;
						}

						// Set save status
						saveStatus.set(jdgSaveStatus.saving);

						// Update the registry store with the current draft meta
						// Use the registry key (not the UUID id) as the object key
						// Handle nested keys like "arch.atc_elevator"
						draftImageMetaRegistry.update((registry) =>
							setNestedRegistryValue(registry, registryKey, $draftImageMeta)
						);

						// Write only this entry back to GitHub
						const currentRepoName = $repoName;
						if (!currentRepoName) {
							throw new Error('No repo name set. Cannot write registry to GitHub.');
						}

						console.log(`💾 Writing image entry "${registryKey}" to ${currentRepoName}...`);

						const writeResult = await writeImageMetaEntryToRepo(
							currentRepoName,
							registryKey,
							$draftImageMeta
						);

						if (!writeResult) {
							throw new Error('Failed to write entry to GitHub');
						}

						console.log('✅ Registry saved successfully');
						saveStatus.set(jdgSaveStatus.saveSuccessRebuilding);

						// Update the original draft meta to reflect the new saved state
						// This prevents "unsaved changes" from showing after successful save
						originalDraftMeta = instantiateObject($draftImageMeta);
					} catch (err) {
						console.error('❌ Save error:', err.message);
						saveStatus.set(jdgSaveStatus.saveFailed);
						alert(`Error: ${err.message}`);
					}
				}}
				onClickCancel={() => {
					showImageMetaModal.set(false);
					draftImageMeta.set(undefined);
					saveStatus.set(null);
				}}
				isEditActive
			/>
		{/if}
	</div>
</JDGModal>

<style>
	.image-meta-modal-scrollable {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
	}

	.image-preview-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.image-src-string {
		max-width: 500px;
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.check-usage-button-container {
		margin-bottom: 10px;
	}

	.upload-button-container {
		margin-bottom: 20px;
	}
</style>
