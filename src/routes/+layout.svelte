<script>
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';

	import uiState from '$lib/states/ui-state.js';

	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		JDGAppContainer,
		JDGBackground,
		JDGFooter,
		JDGHeader,
		JDGImageDetailOverlay,
		JDGNotificationBanner
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';

	// define the nav items in the header
	const newNavItem1 = instantiateObject(jdgNavItem);
	newNavItem1.label = 'HOME';
	newNavItem1.href = '/';

	const newNavItem2 = instantiateObject(jdgNavItem);
	newNavItem2.label = 'ABOUT';
	newNavItem2.href = '/about';

	const newNavItem3 = instantiateObject(jdgNavItem);
	newNavItem3.label = 'CONTACT';
	newNavItem3.href = '/contact';

	const navItems = [newNavItem1, newNavItem2, newNavItem3];

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is text for the footer! It could be a disclaimer or something else.';
	const showHeaderStripes = false;
</script>

<JDGAppContainer accentColors={jdgColors.accentColorsCCP} {showHeaderStripes}>
	<JDGNotificationBanner notificationType="warning" />
	<JDGHeader
		logoJustification="left"
		logoSupertitle={'INTRODUCING'}
		logoTitle={'JDG SVELTE UI'}
		logoAlt="JDG SVELTE UI"
		{navItems}
		useMobileNav={true}
		suppressAlphaOnScroll={true}
	/>
	<JDGBackground />
	<!-- all content goes in this slot -->
	<slot />
	<JDGFooter {appVersion} disclaimer={disclaimerMessage} showDevToolsButton={true} />
	<!-- show the image detail overlay when appropriate -->
	{#if $uiState.showImageDetailOverlay}
		<JDGImageDetailOverlay imageAttributes={$uiState.imageDetailAttributes} />
	{/if}
</JDGAppContainer>
