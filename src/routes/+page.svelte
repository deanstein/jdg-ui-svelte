<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGFooter, JDGHeader, JDGNotificationBanner } from '$lib/index.js';
	import JdgContentBoxFloating from '$lib/JDGContentBoxFloating.svelte';
	import { getDistanceToBottomOfHeader, getDistanceToTopOfHeader } from '$lib/jdg-ui-management.js';
	import uiState from '$lib/stores/uiState.js';

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is a UI library demo site. UI may load slowly and flash while loading because this is using raw UI library components, not compiled code.';
	
	let demoAppContentCss;

	$: {
		$uiState.activeNotificationBanners; // forces an update when uiState updates
		const getDistanceToBottomOfHeaderResult = getDistanceToBottomOfHeader();
		demoAppContentCss = css`
		top: ${getDistanceToBottomOfHeaderResult.value.toString() + getDistanceToBottomOfHeaderResult.unit};
		`;
	}
</script>

<div class="jdg-ui-demo-container">
	<JDGNotificationBanner message={disclaimerMessage} color={jdgColors.notificationInformation} />

	<JDGHeader logoTitle={'JDG SVELTE UI'} useMobileNav={true} />

	<JDGBackground />

	<div class="jdg-ui-demo-content {demoAppContentCss}">
		<JdgContentBoxFloating />
	</div>

	<JDGFooter {appVersion} disclaimer={disclaimerMessage} />
</div>

<style>
	.jdg-ui-demo-container {
		display: flex;
		flex-direction: column;
	}

	.jdg-ui-demo-content {
		position: fixed;
		width: -webkit-fill-available;
		width: -moz-available;
	}
</style>
