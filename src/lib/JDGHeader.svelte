<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import { css } from '@emotion/css';

	import uiState from './stores/uiState.js';

	import navItem from './schemas/nav-item.js';

	import { instantiateObject } from './jdg-utils.js';

	import { jdgColors, jdgBreakpoints, jdgSizes, jdgDurations } from './jdg-styling-constants.js';
	import { getDistanceToTopOfHeader, incrementHighestZIndex } from './jdg-ui-management.js';

	import { JDGStripesHorizontal } from './index.js';
	import { getAlphaFromRgbaString, setAlphaInRgbaString } from './jdg-graphics-factory.js';

	export let showLogo = true;
	export let logoSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-logo-ui.jpg'; // default if not passed in from host app
	export let logoAlt = 'Logo'; // alt text for logo image
	export let logoSupertitle = undefined; // text above title
	export let logoTitle = undefined; // title next to logo
	export let logoAlignment = 'left'; // TODO: rename to justification
	export let showNav = true;
	export let useMobileNav = false; // force use mobile nav at all breakpoints
	export let navItems = [];
	export let textColor = jdgColors.text;
	export let backgroundColorRgba = jdgColors.headerBackground;
	export let suppressAlphaOnScroll = true; // disable alpha past some scroll threshold

	let forceHideTitleAtBreakpoint = false; // forces no title below certain breakpoints
	let showTitleResult; // combined result between intent and breakpoint

	let forceUseMobileNavAtBreakpoint = false; // forces mobile nav below certain breakpoints
	let useMobileNavResult; // combined result between intent and breakpoint

	let isMobileNavExpanded;

	const onClickMobileNavButton = () => (isMobileNavExpanded = !isMobileNavExpanded);

	const mediaQueryHandler = () => {
		// less than smallest breakpoint - mobile
		if (window.innerWidth < jdgBreakpoints.width[0]) {
			// force the mobile nav on
			forceUseMobileNavAtBreakpoint = true;
			// force the title off
			forceHideTitleAtBreakpoint = true;
		}
		// between smallest and largest breakpoint - tablet
		else if (
			window.innerWidth >= jdgBreakpoints.width[0] &&
			window.innerWidth <= jdgBreakpoints.width[1]
		) {
			// largest breakpoint - desktop
		} else {
			forceUseMobileNavAtBreakpoint = false;
			forceHideTitleAtBreakpoint = false;
		}
	};

	const setHeaderBackgroundColorAlphaAtPos = () => {
		// Calculate the scroll position as a percentage of the total document height
		const scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);

		// Define the threshold for changing the transparency
		const threshold = 0.1;

		// Get the original alpha value from the rgba string
		const originalAlpha = getAlphaFromRgbaString(backgroundColorRgba);

		// Calculate the new alpha value based on the scroll percentage and the threshold
		let newAlpha;
		if (scrollPercent <= threshold) {
			newAlpha = originalAlpha + (1 - originalAlpha) * (scrollPercent / threshold);
		} else {
			newAlpha = 1;
		}

		// Update the background color with the new alpha value
		headerContainerInnerCss = css`
			${headerContainerInnerCss}
			background-color: ${setAlphaInRgbaString(backgroundColorRgba, newAlpha)};
		`;
	};

	let headerContainerOuterCss = css`
		color: ${jdgColors.text};
		z-index: ${incrementHighestZIndex()};
		a:before {
			width: 0; /* header links don't have highlight initially */
		}
	`;

	let headerContainerInnerCss = css`
		height: ${jdgSizes.headerHeight};
		padding-top: ${jdgSizes.headerTopBottomPadding};
		padding-bottom: ${jdgSizes.headerTopBottomPadding};
		background-color: ${backgroundColorRgba};
	`;

	const headerLogoContainerCss = css`
		align-items: ${logoAlignment};
	`;

	const headerLogoSupertitleCss = css`
		font-size: ${jdgSizes.fontSizeHeaderSupertitle};
		color: ${jdgColors.textLight};
	`;

	const headerLogoTitleCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		color: ${textColor};
	`;

	const headerMobileNavButtonCss = css`
		color: ${jdgColors.text};
		background-color: transparent;
		:hover {
			background-color: ${jdgColors.hoverBackground};
		}
	`;

	let headerNavContainerMobileCss = css`
		a:before {
			width: 0; /* header links don't have highlight initially */
			background-color: transparent;
		}
		background-color: ${jdgColors.headerBackground};
	`;

	const headerNavItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		:last-of-type {
			margin-right: 0rem;
			padding-right: 0rem;
		}
	`;

	const headerNavItemMobileCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		a:before {
			width: 0; /* header links don't have highlight initially */
		}
		:hover {
			background-color: ${jdgColors.hoverBackground};
		}
	`;

	onMount(() => {
		window.addEventListener('resize', mediaQueryHandler);
		if (suppressAlphaOnScroll) {
			window.addEventListener('scroll', setHeaderBackgroundColorAlphaAtPos);
		}
		// Call the handler once to handle the current screen size
		mediaQueryHandler();

		// show example nav items if requested and not already provided
		if (showNav && navItems.length === 0) {
			const newNavItem1 = instantiateObject(navItem);
			newNavItem1.label = 'HOME';
			newNavItem1.href = '/';

			const newNavItem2 = instantiateObject(navItem);
			newNavItem2.label = 'ABOUT';
			newNavItem2.href = '/about';

			const newNavItem3 = instantiateObject(navItem);
			newNavItem3.label = 'CONTACT';
			newNavItem3.href = '/contact';

			navItems = [newNavItem1, newNavItem2, newNavItem3];
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', mediaQueryHandler);
			if (suppressAlphaOnScroll) {
				window.removeEventListener('scroll', setHeaderBackgroundColorAlphaAtPos);
			}
		}
	});

	$: {
		// needs to be recomputed when notifications show/hide
		const distanceToTopOfHeaderResult = getDistanceToTopOfHeader();
		headerContainerOuterCss = css`
			${headerContainerOuterCss}
			top: ${distanceToTopOfHeaderResult.value.toString() + distanceToTopOfHeaderResult.unit};
		`;

		// needs to be recomputed when notifications show/hide
		headerNavContainerMobileCss = css`
			${headerNavContainerMobileCss}
			top: ${(
				jdgSizes.nHeaderHeight +
				2 * jdgSizes.nHeaderTopBottomPadding +
				$uiState.activeNotificationBanners.length * jdgSizes.nNotificationHeight
			).toString() + jdgSizes.fontUnitNotification};
			z-index: ${incrementHighestZIndex()};
		`;

		showTitleResult = logoTitle && !forceHideTitleAtBreakpoint;
		useMobileNavResult = useMobileNav || forceUseMobileNavAtBreakpoint;
	}
</script>

<div class="jdg-header-outer-container {headerContainerOuterCss}" transition:fade role="banner">
	<div class="jdg-header-inner-container {headerContainerInnerCss}">
		<!-- logo -->
		{#if showLogo}
			<div class="jdg-header-logo-container {headerLogoContainerCss}">
				<a href="/">
					<img src={logoSrc} class="jdg-header-logo" alt={logoAlt} />
					<!-- logo title -->
					{#if showTitleResult}
						<div class="jdg-header-logo-title-container">
							{#if logoSupertitle}
								<div class="jdg-header-logo-supertitle {headerLogoSupertitleCss}">
									{logoSupertitle}
								</div>
							{/if}
							<div class="jdg-header-logo-title {headerLogoTitleCss}">
								{logoTitle}
							</div>
						</div>
					{/if}
				</a>
			</div>
		{/if}
		<!-- navigation -->
		{#if showNav && navItems.length > 0}
			<!-- mobile nav -->
			{#if useMobileNavResult}
				<button
					class="jdg-header-nav-button-mobile {headerMobileNavButtonCss}"
					on:click={onClickMobileNavButton}
					on:keydown={onClickMobileNavButton}
					title={isMobileNavExpanded ? 'Close menu' : 'Open menu'}
				>
					{#if isMobileNavExpanded}
						<i class="fa-solid fa-xmark" />
					{:else}
						<i class="fa-solid fa-bars" />
					{/if}
				</button>
				<!-- desktop nav -->
			{:else}
				<nav class="jdg-header-nav-container">
					{#each navItems as navItem, i}
						<a class="jdg-header-nav-item {headerNavItemCss}" href={navItem?.href}
							>{navItem?.label}</a
						>
					{/each}
				</nav>
			{/if}
		{/if}
	</div>
	<!-- stripes at bottom of header -->
	<JDGStripesHorizontal />
</div>
<!-- mobile nav container (outside header container) -->
{#if useMobileNavResult && isMobileNavExpanded}
	<div
		class="jdg-header-nav-container-mobile {headerNavContainerMobileCss}"
		transition:slide={{ duration: jdgDurations.slide, delay: 0, axis: 'x' }}
	>
		<nav class="jdg-header-nav-item-container-mobile">
			{#each navItems as navItem, i}
				<div class="jdg-header-nav-item-mobile-container">
					<a class="jdg-header-nav-item-mobile {headerNavItemMobileCss}" href={navItem?.href}
						>{navItem?.label}</a
					>
				</div>
			{/each}
		</nav>
	</div>
{/if}

<style>
	a {
		letter-spacing: 5px;
		padding-left: 2.5px; /* letter-spacing adds an extra space at the end; account for this by shifting 1/2 letter spacing on left */
	}

	.jdg-header-outer-container {
		position: fixed;
		display: flex;
		flex-direction: column;
		width: -moz-available;
		width: -webkit-fill-available;
		z-index: 1;
		font-weight: 900;
	}

	.jdg-header-inner-container {
		display: flex;
		justify-content: space-between;
		padding: 1rem 2rem 1rem 2rem;
		backdrop-filter: blur(10px);

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.jdg-header-logo-container {
		display: flex;
		align-items: baseline;
		height: 100%;
	}

	.jdg-header-logo-container a {
		display: flex;
		height: 100%;
	}

	.jdg-header-logo {
		height: 100%; /* fill the header with the logo top-to-bottom */
		max-height: 5vh;
	}

	.jdg-header-logo-title-container {
		display: flex;
		margin-left: 15px;
		flex-direction: column;
		align-items: baseline;
		height: 100%;
		justify-content: end;
	}

	.jdg-header-logo-supertitle {
		line-height: 2vh;
	}

	.jdg-header-logo-title {
		display: inline;
		font-weight: bold;
		line-height: 1vh;
	}

	.jdg-header-nav-container {
		height: 100%;
		display: flex;
		float: right;
		align-items: flex-end;
		gap: 4rem;
	}

	.jdg-header-nav-item {
		align-items: baseline;
		display: flex;
		font-weight: bold;
		line-height: 0px; /* not sure why, but required to get text at bottom of div */
	}

	.jdg-header-nav-button-mobile {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		cursor: pointer;
		font-size: 25px;
		border: none;
		outline: none;
	}

	.jdg-header-nav-container-mobile {
		position: fixed;
		right: 0;
		width: 250px;
		height: 100%;
		backdrop-filter: blur(10px);
	}

	.jdg-header-nav-item-container-mobile {
		display: flex;
		flex-direction: column;
		padding: 15px;
	}

	.jdg-header-nav-item-mobile {
		align-items: baseline;
		display: flex;
		justify-content: center;
		font-weight: bold;
		padding: 15px;
	}

	.jdg-header-nav-item-mobile a::before {
		background-color: transparent;
	}
</style>
