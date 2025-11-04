<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { draftImageMeta, draftImageMetaFolder } from '$lib/stores/jdg-temp-store.js';
	import { getCloudinaryAssetPath, upgradeImageMeta } from '$lib/jdg-utils.js';

	import {
		JDGButton,
		JDGImageTile,
		JDGInputContainer,
		JDGModal,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';

	// Bind the hidden fileInput to a custom button for file picking
	let fileInput;

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

		const folder = get(draftImageMetaFolder);
		const fileName = get(draftImageMeta)?.id;

		if (!folder || !fileName) {
			console.error('Missing folder or fileName for upload.');
			return;
		}

		console.log(`📤 Uploading "${file.name}" to "${folder}/${fileName}"...`);

		try {
			const res = await fetch(
				`https://jdg-cloudinary.jdeangoldstein.workers.dev/upload-image?folder=${encodeURIComponent(
					folder
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
		// Set a folder destination to write to
		draftImageMetaFolder.set('jdg-ui-svelte');
	});
</script>

<JDGModal
	title={'Image Meta'}
	subtitle={null}
	onClickCloseButton={() => {
		showImageMetaModal.set(false);
	}}
	closeOnOverlayClick={false}
>
	<div slot="modal-content-slot" class="image-meta-modal-scrollable">
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
		<JDGInputContainer label="Path">
			<JDGTextInput inputValue={getCloudinaryAssetPath($draftImageMeta.src)} />
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
			<JDGTextInput inputValue={$draftImageMeta.caption} />
		</JDGInputContainer>
		<JDGInputContainer label="Alt">
			<JDGTextInput inputValue={$draftImageMeta.alt} />
		</JDGInputContainer>
		<JDGInputContainer label="Attribution">
			<JDGTextInput inputValue={$draftImageMeta.attribution} />
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
			<JDGTextInput inputValue={$draftImageMeta.toolbarAlignment} />
		</JDGInputContainer>
	</div>
</JDGModal>

<style>
	.image-meta-modal-scrollable {
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
