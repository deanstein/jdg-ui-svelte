<script>
	import { css } from '@emotion/css';

	import { JDGLoadingOverlay } from '$lib/index.js';
	import { onMount, tick } from 'svelte';

	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGFooter, JDGHeader, JDGNotificationBanner } from '$lib/index.js';
	import { convertHexToRGBA, instantiateObject } from '$lib/jdg-utils.js';
	import navItem from '$lib/schemas/nav-item.js';

	// flag to show a loading overlay to prevent FOUC (flash of unstyled content)
	let isLayoutLoaded = false;

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
	const disclaimerMessage = 'This is a notification banner.';

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

	onMount(async () => {
		await tick(); // apparently isn't set to true until layout and all children are loaded
		isLayoutLoaded = true;
	});
</script>

<div class="jdg-app-container">
	{#if isLayoutLoaded}
		<JDGNotificationBanner message={disclaimerMessage} color={jdgColors.notificationInformation} />
		<div class="jdg-ui-demo-container {demoContainerCss}">
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
	{/if}
</div>

<!-- loading overlay - only shown before layout is fully loaded -->
<JDGLoadingOverlay isLoading={!isLayoutLoaded} />

<style>
	.jdg-app-container {
		display: flex;
		flex-direction: column;
	}

	.jdg-ui-demo-container {
		position: relative;
		display: flex;
		flex-direction: column;
	}
</style>
