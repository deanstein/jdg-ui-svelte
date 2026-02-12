<script>
	import { css } from '@emotion/css';
	import { showImageGalleryModal, repoName } from '$lib/stores/jdg-ui-store.js';
	import {
		imageMetaRegistryOptions,
		jdgUiSvelteRepoName
	} from '$lib/jdg-persistence-management.js';
	import {
		JDGModal,
		JDGSelect,
		JDGImageRegistryGallery,
		JDGFlyout,
		JDGCheckbox
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Sort options for JDGSelect (matches gallery's options)
	const sortOptionsGroup = {
		sort: {
			label: 'Sort order',
			'json-asc': { value: 'json-asc', label: 'By JSON (ascending)' },
			'json-desc': { value: 'json-desc', label: 'By JSON (descending)' },
			'date-asc': { value: 'date-asc', label: 'By date (oldest first)' },
			'date-desc': { value: 'date-desc', label: 'By date (newest first)' }
		}
	};

	// Whether to show captions (controlled by Options flyout)
	let showCaptions = true;

	// Sort mode for gallery
	let sortMode = 'json-desc';

	// Registry to show: default to current website's registry (repoName set by consuming app)
	let selectedRepoName;
	$: currentWebsiteRegistry = $repoName ?? jdgUiSvelteRepoName;
	$: if (selectedRepoName == null && currentWebsiteRegistry) {
		selectedRepoName = currentWebsiteRegistry;
	}

	const controlsContainerCss = css`
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid ${jdgColors.border};
	`;

	const selectLabelCss = css`
		font-size: 14px;
		color: ${jdgColors.text};
	`;

	const selectWrapperCss = css`
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 200px;
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

<JDGModal
	title="Image Meta Registry Gallery"
	subtitle="View available images in a given registry"
	onClickCloseButton={() => {
		$showImageGalleryModal = false;
	}}
	backgroundColor={'rgba(235, 235, 235, 1)'}
	width="90vw"
	height="80dvh"
	overflow="hidden"
>
	<div slot="modal-content-slot" class="gallery-content-wrapper">
		<div class={controlsContainerCss}>
			<div class={selectWrapperCss}>
				<span class={selectLabelCss}>Registry:</span>
				<JDGSelect optionsGroup={imageMetaRegistryOptions} bind:inputValue={selectedRepoName} />
			</div>
			<div style="margin-left: auto;">
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
			</div>
		</div>
		<div class="gallery-scroll-container">
			<JDGImageRegistryGallery
				imagesPerPage={48}
				bind:showCaptions
				bind:sortMode
				showOptionsFlyout={false}
				imageHeight="20svh"
				registryRepoName={selectedRepoName}
			/>
		</div>
	</div>
</JDGModal>

<style>
	.gallery-content-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		box-sizing: border-box;
		width: 100%;
	}

	.gallery-scroll-container {
		flex: 1;
		overflow-y: auto;
		min-height: 0; /* Required for flex child scrolling */
	}
</style>
