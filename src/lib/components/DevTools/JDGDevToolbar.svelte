<script>
	import { css } from '@emotion/css';

	import {
		doShowDevToolbarSticky,
		doShowDevOverlay,
		doAllowTextSelection,
		doShowAdminLoginModal
	} from '$lib/stores/jdg-ui-store.js';

	import { JDGButton, JDGH3H4 } from '$lib/index.js';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';

	const buttonColor = 'rgba(150, 150, 150, 1)';

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
				doShowAdminLoginModal.set(!$doShowAdminLoginModal);
			}}
			label={$doShowAdminLoginModal ? 'Hide Admin Modal' : 'Show Admin Modal'}
			backgroundColor={buttonColor}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			faIcon={$doShowDevToolbarSticky ? 'fa-eye-slash' : 'fa-eye'}
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				doShowDevToolbarSticky.set(!$doShowDevToolbarSticky);
			}}
			label={$doShowDevToolbarSticky ? 'Hide Sticky Dev Toolbar' : 'Show Sticky Dev Toolbar'}
			backgroundColor={buttonColor}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			faIcon={$doShowDevToolbarSticky ? 'fa-eye-slash' : 'fa-eye'}
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				doShowDevOverlay.set(!$doShowDevOverlay);
			}}
			label={$doShowDevOverlay ? 'Hide Dev Overlay' : 'Show Dev Overlay'}
			backgroundColor={buttonColor}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			faIcon={$doShowDevOverlay ? 'fa-eye-slash' : 'fa-eye'}
			fontSize={jdgSizes.fontSizeBodyXSm}
		/>
		<JDGButton
			onClickFunction={() => {
				doAllowTextSelection.set(!$doAllowTextSelection);
			}}
			label={$doAllowTextSelection ? 'Disallow Text Selection' : 'Allow Text Selection'}
			backgroundColor={buttonColor}
			paddingTopBottom="5px"
			paddingLeftRight="10px"
			faIcon={$doAllowTextSelection ? 'fa-text-slash' : 'fa-arrow-pointer'}
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
