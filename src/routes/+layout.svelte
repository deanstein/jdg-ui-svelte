<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGFooter, JDGHeader, JDGNotificationBanner } from '$lib/index.js';
	import { convertHexToRGBA, instantiateObject } from '$lib/jdg-utils.js';
	import navItem from '$lib/schemas/nav-item.js';

	// define the nav items in the header
	const newNavItem1 = instantiateObject(navItem);
	newNavItem1.label = 'HOME';
	newNavItem1.href = '/';

	const newNavItem2 = instantiateObject(navItem);
	newNavItem2.label = 'ABOUT';
	newNavItem2.href = '/about';

	const newNavItem3 = instantiateObject(navItem);
	newNavItem3.label = 'CONTACT';
	newNavItem3.href = '/contact';

	const navItems = [newNavItem1, newNavItem2, newNavItem3];

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is a UI library demo site. UI may load slowly and flash while loading because this is using raw UI library components, not compiled code.';

	// global styles, but using emotion css
	const useStripedHyperlinkHoverStyle = false;
	const hyperlinkColorOpacity = 0.75;
	const demoContainerCss = css`
		a {
			color: ${jdgColors.text};
		}
		a.no-initial-highlight::before,
		.jdg-highlight-container .jdg-highlight::before {
			background: ${useStripedHyperlinkHoverStyle
				? `linear-gradient(
				to bottom,
				${convertHexToRGBA(jdgColors.accentStripesJDG[0], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[1], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[1], hyperlinkColorOpacity)} 66%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[2], hyperlinkColorOpacity)} 66%
			)`
				: `${jdgColors.accentStripesJDG[0]}`};
		}
		a:before {
			background: ${jdgColors.accentStripesJDG[0]};
		}
	`;
</script>

<div class="jdg-ui-demo-container {demoContainerCss}">
	<JDGNotificationBanner message={disclaimerMessage} color={jdgColors.notificationInformation} />

	<JDGHeader
		logoJustification="left"
		logoSupertitle={'INTRODUCING'}
		logoTitle={'JDG SVELTE UI'}
		logoAlt="JDG SVELTE UI"
		{navItems}
		useMobileNav={false}
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
