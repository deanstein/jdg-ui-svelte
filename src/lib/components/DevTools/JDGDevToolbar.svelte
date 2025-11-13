<script>
	import { css } from '@emotion/css';

	import {
		showDevToolbarSticky,
		showDevModal,
		allowTextSelection,
		showAdminLoginModal,
		showImageMetaModal
	} from '$lib/stores/jdg-ui-store.js';

	import { instantiateObject, JDGButton, JDGH3H4 } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import jdgImageMeta from '$lib/schemas/jdg-image-meta.js';
	import { draftImageMeta } from '$lib/stores/jdg-temp-store.js';

	const flexContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			flex-direction: row;
		}
	`;
</script>

<div class="jdg-dev-toolbar-container">
	<JDGH3H4 h3String="DEV TOOLBAR" />
	<div class="toolbar-button-flex-container {flexContainerCss}">
		<JDGButton
			onClickFunction={() => {
				const newImageMeta = instantiateObject(jdgImageMeta);
				draftImageMeta.set(newImageMeta);
				showImageMetaModal.set(true);
			}}
			faIcon={'fa-square-plus'}
			label={'Add New Image'}
			backgroundColor={jdgColors.buttonColor}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				showAdminLoginModal.set(!$showAdminLoginModal);
			}}
			faIcon={$showDevToolbarSticky ? 'fa-eye-slash' : 'fa-eye'}
			label={$showAdminLoginModal ? 'Hide Admin Login' : 'Show Admin Login'}
			backgroundColor={jdgColors.activeSecondary}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				showDevToolbarSticky.set(!$showDevToolbarSticky);
			}}
			faIcon={$showDevToolbarSticky ? 'fa-eye-slash' : 'fa-eye'}
			label={$showDevToolbarSticky ? 'Hide Sticky Dev Toolbar' : 'Show Sticky Dev Toolbar'}
			backgroundColor={jdgColors.activeSecondary}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				showDevModal.set(!$showDevModal);
			}}
			faIcon={$showDevModal ? 'fa-eye-slash' : 'fa-eye'}
			label={$showDevModal ? 'Hide Dev Overlay' : 'Show Dev Overlay'}
			backgroundColor={jdgColors.activeSecondary}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				allowTextSelection.set(!$allowTextSelection);
			}}
			faIcon={$allowTextSelection ? 'fa-text-slash' : 'fa-arrow-pointer'}
			label={$allowTextSelection ? 'Disallow Text Selection' : 'Allow Text Selection'}
			backgroundColor={jdgColors.activeSecondary}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
	</div>
</div>

<style>
	.jdg-dev-toolbar-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.toolbar-button-flex-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 10px;
	}
</style>
