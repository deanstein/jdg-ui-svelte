<script>
	import { MetaTags } from 'svelte-meta-tags';
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import { jdgSharedUrls } from '$lib/jdg-shared-strings.js';

	import {
		JDGAppContainer,
		JDGBackground,
		JDGDevToolbarSticky,
		JDGFooter,
		JDGHeader,
		JDGNotificationBanner,
		JDGSocialMedia
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import sharedStrings from './shared-strings.js';
	import {
		devOverlayContent,
		devToolbarStickyContent,
		imagesLoading,
		isScrollingToAnchorTag
	} from '$lib/states/ui-state.js';

	// define the nav items in the header
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

	const navItemIframe = instantiateObject(jdgNavItem);
	navItemIframe.label = 'IFRAME TEST';
	navItemIframe.href = '/iframe-test';

	const navItems = [
		navItemHome,
		navItemSimpleTest,
		navItemCloudinaryTest,
		navItemJdgTest,
		navItemPlaceholder,
		navItemIframe
	];

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is text for the footer! It could be a disclaimer or something else.';
	const showHeaderStripes = false;

	// optional: configure dev toolbar or dev overlay data in state
	$: {
		devToolbarStickyContent.set(
			`Is scrolling to anchor tag? ${$isScrollingToAnchorTag} Images loading: ${$imagesLoading}`
		);
		devOverlayContent.set(
			`Is scrolling to anchor tag? ${$isScrollingToAnchorTag} Images loading: ${$imagesLoading}`
		);
	}
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
<JDGAppContainer appAccentColors={jdgColors.accentColorsCCP} {showHeaderStripes}>
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
		disclaimer={disclaimerMessage}
		showDevToolsButton={true}
		alignItems="center"
	>
		<JDGSocialMedia
			iconColor={'gray'}
			instagramHref={jdgSharedUrls.ccpInstagram}
			facebookHref={jdgSharedUrls.ccpFacebook}
			youtubeHref={jdgSharedUrls.ccpYouTube}
			linkedinHref={jdgSharedUrls.jdgLinkedIn}
			githubHref={jdgSharedUrls.ccpGitHubReleases}
		/>
	</JDGFooter>
</JDGAppContainer>
