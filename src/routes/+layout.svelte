<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGFooter, JDGHeader, JDGNotificationBanner } from '$lib/index.js';

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is a UI library demo site. UI may load slowly and flash while loading because this is using raw UI library components, not compiled code.';

	// global styles, but using emotion css
	const demoContainerCss = css`
		a {
			color: ${jdgColors.text};
		}
		a:before {
			background-color: ${jdgColors.accentStripesJDG[2]};
		}
	`;
</script>

<div class="jdg-ui-demo-container {demoContainerCss}">
	<JDGNotificationBanner message={disclaimerMessage} color={jdgColors.notificationInformation} />

	<JDGHeader
		logoTitle={'JDG SVELTE UI'}
		logoSupertitle={'INTRODUCING'}
		useMobileNav={false}
		suppressAlphaOnScroll={true}
	/>

	<JDGBackground />

	<slot />

	<JDGFooter {appVersion} disclaimer={disclaimerMessage} />
</div>

<style>
	.jdg-ui-demo-container {
		display: flex;
		flex-direction: column;
	}
</style>
