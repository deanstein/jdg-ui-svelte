<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import {
		draftImageMeta,
		draftImageMetaRegistry,
		saveFunction,
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
		JDGButton,
		JDGComposeToolbar,
		JDGImageTile,
		JDGInputContainer,
		JDGModal,
		JDGNotificationBanner,
		JDGTextInput
	} from '$lib/index.js';
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import jdgSaveStatus from '$lib/schemas/jdg-save-status.js';

	// Bind the hidden fileInput to a custom button for file picking
	let fileInput;
	// Container for ComposeToolbar
	let modalContainerRef;

	// Keep track of the original metal for comparison purposes
	let originalDraftMeta;

	// The asset path is extracted from the image src
	// so create a reactive derived variable:
	$: assetPath = extractCloudinaryAssetpath($draftImageMeta?.src);
	// When the asset path is modified,
	// show a banner that the image must be deleted and reuploaded
	$: hasAssetPathChanged = $draftImageMeta?.src !== originalDraftMeta?.src;
	// If there are unsaved changes,
	// show a banner and show the cancel/done buttons
	$: hasUnsavedChanges = !areObjectsEqual($draftImageMeta, originalDraftMeta);

	// When the asset path changes, update the cloudinary URL
	const onAssetPathChange = (e) => {
		const newPath = e.target.value;
		draftImageMeta.update((meta) => ({
			...meta,
			src: replaceCloudinaryAssetPathInUrl(meta.src, newPath)
		}));
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

		const assetPath = extractCloudinaryAssetpath($draftImageMeta.src);
		const fileName = get(draftImageMeta)?.id;

		if (!assetPath || !fileName) {
			console.error('Missing folder or fileName for upload.');
			return;
		}

		console.log(`📤 Uploading "${file.name}" to "${assetPath}/${fileName}"...`);

		try {
			const res = await fetch(
				`https://jdg-cloudinary.jdeangoldstein.workers.dev/upload-image?folder=${encodeURIComponent(
					assetPath
				)}&fileName=${encodeURIComponent(fileName)}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': file.type
					},
					body: file
				}
			);

			const data = await res.json();
			if (!res.ok || !data.success) {
				throw new Error(data.error || 'Upload failed');
			}

			console.log('✅ Upload complete:', data.url);

			// Update image src in draft meta
			draftImageMeta.update((meta) => ({ ...meta, src: data.url }));
		} catch (err) {
			console.error('❌ Upload error:', err.message);
		} finally {
			// Clear file input so it can be reused
			fileInput.value = '';
		}
	};

	onMount(() => {
		// Upgrade the image meta
		draftImageMeta.set(upgradeImageMeta(get(draftImageMeta)));

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
			<JDGNotificationBanner
				showBanner={hasUnsavedChanges}
				notificationType={jdgNotificationTypes.warning}
				message={'Changes detected. Next, click Done or Cancel below.'}
			/>
			<!-- Image preview -->
			<div class="image-preview-wrapper">
				<JDGImageTile imageMeta={$draftImageMeta} maxHeight="20svh" cropToFillContainer={false} />
			</div>

			<!-- Read-only values -->
			<JDGInputContainer label="ID">
				{$draftImageMeta.id}
			</JDGInputContainer>
			<JDGInputContainer label="Version">
				{$draftImageMeta.version}
			</JDGInputContainer>
			<JDGInputContainer label="Source">
				<div class="image-src-string">
					${$draftImageMeta.src}
				</div>
			</JDGInputContainer>

			<!-- Editable values -->
			<JDGNotificationBanner
				showBanner={hasAssetPathChanged}
				notificationType={jdgNotificationTypes.warning}
				message={'The asset path or name has changed. This will require deletion and reupload.'}
			/>
			<JDGInputContainer label="Asset Path">
				<JDGTextInput inputValue={assetPath} onInputFunction={onAssetPathChange} />
			</JDGInputContainer>
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
				<JDGTextInput bind:inputValue={$draftImageMeta.alt} />
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
		{#if hasUnsavedChanges}
			<JDGComposeToolbar
				parentRef={modalContainerRef}
				onClickCompose={() => {}}
				onClickDone={() => {
					showImageMetaModal.set(false);
				}}
				onClickCancel={() => {
					showImageMetaModal.set(false);
				}}
				isEditActive
			/>
		{/if}
	</div>
</JDGModal>

<style>
	.image-meta-modal-scrollable {
		position: relative;
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

	.upload-button-container {
		margin-bottom: 20px;
	}
</style>
