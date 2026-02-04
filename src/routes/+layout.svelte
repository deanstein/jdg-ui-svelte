<script>
	import { MetaTags } from 'svelte-meta-tags';

	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';

	import { repoName, showDevTools } from '$lib/stores/jdg-ui-store.js';

	import { jdgUiSvelteRepoName } from '$lib/jdg-persistence-management.js';
	import { toggleDevTools } from '$lib/jdg-state-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import jdgSharedUrlsStore from '$lib/stores/jdg-shared-urls-store.js';

	import imageMetaRegistry from './image-meta-registry.js';

	import {
		JDGAppContainer,
		JDGBackground,
		JDGButton,
		JDGFooter,
		JDGHeader,
		JDGNotificationBanner,
		JDGSocialMedia
	} from '$lib/index.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import sharedStrings from './shared-strings.js';

	// Define the repo name
	repoName.set(jdgUiSvelteRepoName);

	// Define the nav items in the header
	const navItemHome = instantiateObject(jdgNavItem);
	navItemHome.label = 'HOME';
	navItemHome.href = '/';

	const navItemPlaceholder = instantiateObject(jdgNavItem);
	navItemPlaceholder.label = 'PLACEHOLDER TEST';
	navItemPlaceholder.href = '/jdg-test';

	const navItemSimpleTest = instantiateObject(jdgNavItem);
	navItemSimpleTest.label = 'SIMPLE TEST';
	navItemSimpleTest.href = '/simple-test';

	const navItemCloudinaryTest = instantiateObject(jdgNavItem);
	navItemCloudinaryTest.label = 'CLOUDINARY TEST';
	navItemCloudinaryTest.href = '/cloudinary-test';

	const navItemJdgTest = instantiateObject(jdgNavItem);
	navItemJdgTest.label = 'JDG TEST';
	navItemJdgTest.href = '/jdg-test';

	const navItemPmxTest = instantiateObject(jdgNavItem);
	navItemPmxTest.label = 'PMX TEST';
	navItemPmxTest.href = '/pmx-test';

	const navItemIframe = instantiateObject(jdgNavItem);
	navItemIframe.label = 'IFRAME TEST';
	navItemIframe.href = '/iframe-test';

	const navItemTimeline = instantiateObject(jdgNavItem);
	navItemTimeline.label = 'TIMELINE TEST';
	navItemTimeline.href = '/timeline-test';

	const navItemTools = instantiateObject(jdgNavItem);
	navItemTools.label = 'TOOLS';
	navItemTools.href = '/tools';

	const navItems = [
		navItemHome,
		navItemTools,
		navItemSimpleTest,
		navItemCloudinaryTest,
		navItemJdgTest,
		navItemPmxTest,
		navItemPlaceholder,
		navItemIframe,
		navItemTimeline
	];

	// Get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is text for the footer! It could be a disclaimer or something else.';
	const showHeaderStripes = false;
</script>

<!-- this a unique usage of MetaTags; don't use for Svelte websites -->
<!-- see jdg-website repo for correct website usage of MetaTags -->
<MetaTags
	title={sharedStrings.websiteTitle}
	openGraph={{
		title: sharedStrings.websiteTitle,
		description: sharedStrings.websiteDescription,
		images: [
			{
				url: sharedStrings.web,
				width: 800,
				height: 600
			}
		]
	}}
/>
<JDGAppContainer
	{imageMetaRegistry}
	accentColors={jdgColors.accentColorsJDG}
	linkColorContrastAdjustment={6}
	{showHeaderStripes}
	fontFamily="REM"
>
	<JDGNotificationBanner notificationType={jdgNotificationTypes.information.id} />
	<JDGHeader
		logoJustification="left"
		logoSupertitle={'INTRODUCING'}
		logoTitle={'JDG SVELTE UI'}
		logoAlt="JDG SVELTE UI"
		{navItems}
		useMobileNav={true}
		suppressAlphaOnScroll={false}
	/>
	<JDGBackground />
	<!-- all content goes in this slot -->
	<slot />
	<JDGFooter
		{appVersion}
		copyrightHref="https://jdeangoldstein.com/"
		disclaimer={disclaimerMessage}
		showDevToolsButton={true}
		alignItems="center"
	>
		<div slot="footer-slot-top">
			<JDGSocialMedia
				iconColor={'gray'}
				instagramHref={$jdgSharedUrlsStore.ccpInstagram}
				facebookHref={$jdgSharedUrlsStore.ccpFacebook}
				youtubeHref={$jdgSharedUrlsStore.ccpYouTube}
				linkedinHref={$jdgSharedUrlsStore.jdgLinkedIn}
				githubHref={$jdgSharedUrlsStore.ccpGitHubReleases}
			/>
		</div>
		<div slot="footer-slot-dev-tools" style="display: flex; align-items: center;">
			<div style="padding-left: 0px; padding-right: 10px;">&nbsp;|</div>
			<JDGButton
				onClickFunction={toggleDevTools}
				label={null}
				tooltip={$showDevTools ? 'Hide Alternate Dev Tools' : 'Show Alternate Dev Tools'}
				isPrimary={false}
				paddingTopBottom="5px"
				paddingLeftRight="10px"
				faIcon={$showDevTools ? 'fa-eye-slash' : 'fa-screwdriver-wrench'}
				fontSize={jdgSizes.fontSizeBodyXSm}
				doForceSquareAspect
			/>
			&nbsp;
		</div>
	</JDGFooter>
</JDGAppContainer>
