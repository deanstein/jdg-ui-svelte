<script>
	import { doShowDevToolbarSticky, doShowDevOverlay } from '$lib/states/ui-state.js';
	import { JDGButton, JDGH3H4 } from '$lib/index.js';
	import { jdgSizes } from '$lib/jdg-shared-styles.js';
</script>

<div class="jdg-dev-toolbar-container">
<JDGH3H4 h3String="DEV TOOLBAR" />
<div class="toolbar-button-flex-container">
	<JDGButton
		onClickFunction={() => {
			doShowDevToolbarSticky.set(!$doShowDevToolbarSticky);
		}}
		label={$doShowDevToolbarSticky ? 'Hide Sticky Dev Toolbar' : 'Show Sticky Dev Toolbar'}
		paddingTopBottom="5px"
		paddingLeftRight="10px"
		faIcon={$doShowDevToolbarSticky ? "fa-eye-slash" : "fa-eye"}
		fontSize={jdgSizes.fontSizeBodyXSm}
        isPrimary={false}
	/>
	<JDGButton
		onClickFunction={() => {
			doShowDevOverlay.set(!$doShowDevOverlay);
		}}
		label={$doShowDevOverlay ? 'Hide Dev Overlay' : 'Show Dev Overlay'}
		paddingTopBottom="5px"
		paddingLeftRight="10px"
		faIcon={$doShowDevOverlay ? "fa-eye-slash" : "fa-eye"}
		fontSize={jdgSizes.fontSizeBodyXSm}
        isPrimary={false}
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
