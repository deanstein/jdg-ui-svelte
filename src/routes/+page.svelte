<script>
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGFooter, JDGHeader, JDGNotificationBanner } from '$lib/index.js';

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
</script>

<div class="jdg-ui-demo-container">
	<JDGNotificationBanner
		message={'UI MAY FLASH AND LOAD SLOWLY. This is a UI library demo site and is not compiled into static assets.'}
		color={jdgColors.notificationInformation}
	/>

	<JDGHeader logoTitle={'JDG SVELTE UI'} useMobileNav={true} />

	<JDGBackground />

	<JDGFooter {appVersion} disclaimer={'This is a disclaimer statement.'} />
</div>

<style>
	.jdg-ui-demo-container {
		display: flex;
		flex-direction: column;
	}
</style>
