<script>
	import navItem from '$lib/schemas/nav-item.js';

	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		JDGAppContainer,
		JDGBackground,
		JDGFooter,
		JDGHeader,
		JDGNotificationBanner
	} from '$lib/index.js';

	import { jdgColors } from '$lib/jdg-styling-constants.js';

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
	const bannerMessage = 'This is a notification banner.';
	const disclaimerMessage =
		'This is text for the footer! It could be a disclaimer or something else.';
</script>

<JDGAppContainer>
	<JDGNotificationBanner message={bannerMessage} color={jdgColors.notificationInformation} />
	<JDGHeader
		logoJustification="left"
		logoSupertitle={'INTRODUCING'}
		logoTitle={'JDG SVELTE UI'}
		logoAlt="JDG SVELTE UI"
		{navItems}
		useMobileNav={false}
	/>
	<JDGBackground />
	<!-- all content goes in this slot -->
	<slot />
	<JDGFooter {appVersion} disclaimer={disclaimerMessage} />
</JDGAppContainer>
