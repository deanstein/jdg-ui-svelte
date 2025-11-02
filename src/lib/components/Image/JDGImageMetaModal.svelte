<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	import { showImageMetaModal } from '$lib/stores/jdg-ui-store.js';
	import { draftImageMeta } from '$lib/stores/jdg-temp-store.js';
	import { upgradeImageMeta } from '$lib/jdg-utils.js';

	import {
		JDGButton,
		JDGImageTile,
		JDGInputContainer,
		JDGModal,
		JDGTextInput
	} from '$lib/index.js';

	// Bind the hidden fileInput to a custom button for file picking
	let fileInput;

	const onClickFileUpload = () => {};

	onMount(() => {
		// Upgrade the image meta
		draftImageMeta.set(upgradeImageMeta(get(draftImageMeta)));
		console.log($draftImageMeta);
	});
</script>

<JDGModal
	title={'Image Meta'}
	subtitle={null}
	onClickCloseButton={() => {
		showImageMetaModal.set(false);
	}}
>
	<div slot="modal-content-slot">
		<JDGImageTile imageMeta={$draftImageMeta} maxHeight="20svh" />
		<!-- Read-only values -->
		<JDGInputContainer label="ID">
			{$draftImageMeta.id}
		</JDGInputContainer>
		<JDGInputContainer label="Version">
			{$draftImageMeta.version}
		</JDGInputContainer>
		<!-- Editable values -->
		<JDGInputContainer label="Source">
			<JDGTextInput inputValue={$draftImageMeta.src} />
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
		</JDGInputContainer>
		<JDGInputContainer label="Title">
			<JDGTextInput inputValue={$draftImageMeta.title} />
		</JDGInputContainer>
		<JDGInputContainer label="Alt">
			<JDGTextInput inputValue={$draftImageMeta.alt} />
		</JDGInputContainer>
		<JDGInputContainer label="Caption">
			<JDGTextInput inputValue={$draftImageMeta.caption} />
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
