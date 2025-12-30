<script>
	import { css } from '@emotion/css';

	import { JDGImage, JDGButton, JDGImageSelector } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// The image meta object to display - parent is responsible for resolving this
	export let imageMeta;
	// The current image key (for initializing the selector when editing)
	export let imageKey = '';
	// Size of the avatar (width and height)
	export let size = '30px';
	// Whether to show hover effect on avatar
	export let showHoverEffect = true;
	// Border color on hover
	export let hoverBorderColor = jdgColors.accentColorsJDG[1];
	// Click handler for the avatar itself
	export let onClickFunction = undefined;
	// Whether to show the edit button and allow editing
	export let allowEditing = false;
	// Callback when user selects a new image (passes the new key)
	/** @type {((newKey: string) => void) | undefined} */
	export let onImageSelect = undefined;
	// Override the registry repo name
	// (for context-driven use like Timeline)
	export let registryRepoName = undefined;

	// Internal state for whether the selector is open
	let isSelectorOpen = false;

	// Local array for the selector - initialized when selector opens
	let selectorSelection = [];

	// When selector opens, initialize it with current key
	$: if (isSelectorOpen) {
		selectorSelection = imageKey ? [imageKey] : [];
	}

	// Handle selection change from selector
	const handleSelectionChange = (newSelection) => {
		const newKey = newSelection[0] || '';
		if (newKey !== imageKey && onImageSelect) {
			onImageSelect(newKey);
		}
	};

	$: avatarCss = css`
		height: ${size};
		width: ${size};
		border: 2px solid transparent;
		${showHoverEffect
			? `:hover {
			border: 2px solid ${hoverBorderColor};
		}`
			: ''}
	`;

	const handleKeydown = (e) => {
		if (onClickFunction && (e.key === 'Enter' || e.key === ' ')) {
			/** @type {Function} */ (onClickFunction)();
		}
	};

	const toggleSelector = () => {
		isSelectorOpen = !isSelectorOpen;
	};
</script>

<div class="jdg-image-avatar-wrapper">
	<div class="jdg-image-avatar-container">
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			class="jdg-image-avatar {avatarCss}"
			role={onClickFunction ? 'button' : undefined}
			tabindex={onClickFunction ? 0 : -1}
			on:click={onClickFunction}
			on:keydown={handleKeydown}
		>
			{#key imageMeta?.src}
				{#if imageMeta?.src}
					<JDGImage {imageMeta} maxHeight={size} maxWidth={size} cropToFillContainer={true} />
				{/if}
			{/key}
		</div>
		{#if allowEditing}
			<div class="edit-button">
				<JDGButton
					label={null}
					faIcon={isSelectorOpen ? 'fa-times' : 'fa-upload'}
					onClickFunction={toggleSelector}
					doForceSquareAspect={true}
					paddingTopBottom="6px"
					paddingLeftRight="6px"
					fontSize="12px"
					backgroundColor={isSelectorOpen ? jdgColors.cancel : jdgColors.active}
				/>
			</div>
		{/if}
	</div>
	{#if allowEditing && isSelectorOpen}
		<div class="avatar-selector">
			<JDGImageSelector
				{registryRepoName}
				requireRegistry={true}
				selectedImages={selectorSelection}
				isEnabled={true}
				imageHeight="80px"
				singleSelect={true}
				onSelectionChange={handleSelectionChange}
			/>
		</div>
	{/if}
</div>

<style>
	.jdg-image-avatar-wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.jdg-image-avatar-container {
		display: flex;
		align-items: center;
		position: relative;
	}

	.jdg-image-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 50%;
		cursor: pointer;
		box-sizing: border-box;
	}

	.edit-button {
		display: flex;
		align-items: center;
		margin-left: 8px;
	}

	.avatar-selector {
		max-height: 300px;
		overflow-y: auto;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		padding: 8px;
	}
</style>
