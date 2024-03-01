<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgColors, jdgSizes } from './jdg-styling-constants.js';
	import { breakpointHandler, incrementHighestZIndex } from './jdg-ui-management.js';

	import { getAlphaFromRgbaString, setAlphaInRgbaString } from './jdg-graphics-factory.js';

	import { JDGTopNav, JDGSideNav, JDGStripesHorizontal } from './index.js';

	export let showLogo = true;
	export let logoSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-logo-ui.jpg'; // default if not passed in from host app
	export let logoAlt = 'Logo'; // alt text for logo image
	export let logoSupertitle = undefined; // text above title
	export let logoTitle = undefined; // title next to logo
	export let logoJustification = 'left';
	export let showNav = true;
	export let useMobileNav = false; // force use mobile nav at all breakpoints
	export let navItems = [];
	export let textColor = jdgColors.text;
	export let backgroundColorRgba = jdgColors.headerBackground;
	export let showHorizontalStripes = false;
	export let suppressAlphaOnScroll = false; // disable alpha past some scroll threshold

	let forceHideTitleAtBreakpoint = false; // forces no title below certain breakpoints
	let forceMobileNavOnCenteredTitle = false; // forces mobile nav when title is centered
	let showTitleResult; // combined result between intent and breakpoint
	let isNavSidebarOpen = false;

	// set certain flags at certain breakpoints
	const headerBreakpointHandler = () => {
		breakpointHandler(
			// breakpoint 0
			() => {
				// force the title off
				forceHideTitleAtBreakpoint = true;
			},
			// breakpoint 1
			() => {},
			// breakpoint 2
			() => {
				forceHideTitleAtBreakpoint = false;
			}
		);
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
		// TODO: THIS CAUSES DUPLICATE CSS STYLES - FIX!
		headerContainerInnerCss = css`
			${headerContainerInnerCss}
			background-color: ${setAlphaInRgbaString(backgroundColorRgba, newAlpha)};
		`;
	};

	let headerContainerOuterCss = css`
		color: ${jdgColors.text};
		z-index: ${incrementHighestZIndex()};
	`;

	let headerContainerInnerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightLg};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightLg};
		}
		padding-top: ${jdgSizes.headerTopBottomPadding};
		padding-bottom: ${jdgSizes.headerTopBottomPadding};
		background-color: ${backgroundColorRgba};
		backdrop-filter: blur(${jdgSizes.blurSizeMedium});
	`;

	let logoJustificationContainerCss = css`
		display: flex;
		width: calc(100% - 2 * ${jdgSizes.headerSidePadding});
		justify-content: ${logoJustification};
	`;

	const headerLogoImgCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			max-height: ${jdgSizes.headerLogoHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			max-height: ${jdgSizes.headerLogoHeightLg};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			max-height: ${jdgSizes.headerLogoHeightLg};
		}
	`;

	const logoTitleLinkCss = css`
		flex-direction: ${logoJustification === 'center' ? 'column' : 'row'};
		align-items: ${logoJustification === 'center' ? 'center' : 'left'};
	`;

	const headerLogoSupertitleCss = css`
		font-size: ${jdgSizes.fontSizeHeaderSupertitle};
		text-align: ${logoJustification === 'center' ? 'center' : 'left'};
		color: ${jdgColors.textLight};
	`;

	const headerLogoTitleCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		text-align: ${logoJustification === 'center' ? 'center' : 'left'};
		color: ${textColor};
	`;

	onMount(() => {
		window.addEventListener('resize', headerBreakpointHandler);
		if (suppressAlphaOnScroll) {
			window.addEventListener('scroll', setHeaderBackgroundColorAlphaAtPos);
		}
		// Call the handler once to handle the current screen size
		headerBreakpointHandler();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', headerBreakpointHandler);
			if (suppressAlphaOnScroll) {
				window.removeEventListener('scroll', setHeaderBackgroundColorAlphaAtPos);
			}
		}
	});

	$: {
		showTitleResult = logoTitle && !forceHideTitleAtBreakpoint && logoJustification !== 'center';
		forceMobileNavOnCenteredTitle = logoJustification === 'center';
	}
</script>

<div class="jdg-header-outer-container {headerContainerOuterCss}" transition:fade role="banner">
	<div class="jdg-header-inner-container {headerContainerInnerCss}">
		<!-- logo -->
		{#if showLogo}
			<!-- wrap the logo in an additional div that can go full width when logo is centered -->
			<div class="logo-justification-container {logoJustificationContainerCss}">
				<div class="logo-container jdg-letter-spacing-title">
					<a href="/" class="no-initial-highlight {logoTitleLinkCss}">
						<img src={logoSrc} class="logo-img {headerLogoImgCss}" alt={logoAlt} />
						<!-- logo title -->
						{#if showTitleResult}
							<div class="logo-title-container">
								{#if logoSupertitle}
									<div class="logo-supertitle {headerLogoSupertitleCss}">
										{logoSupertitle}
									</div>
								{/if}
								<div class="logo-title {headerLogoTitleCss}">
									{logoTitle}
								</div>
							</div>
						{/if}
					</a>
				</div>
			</div>
		{/if}
		<!-- navigation: in header -->
		{#if showNav && navItems.length > 0}
			<JDGTopNav {navItems} useMobileNav={useMobileNav || forceMobileNavOnCenteredTitle} />
		{/if}
	</div>
	<!-- navigation: sidebar -->
	{#if showNav && navItems.length > 0}
		<JDGSideNav {navItems} />
	{/if}
	<!-- stripes at bottom of header -->
	{#if showHorizontalStripes}
		<JDGStripesHorizontal />
	{/if}
</div>

<style>
	a {
		letter-spacing: 5px;
		padding-left: 2.5px; /* letter-spacing adds an extra space at the end; account for this by shifting 1/2 letter spacing on left */
	}

	.jdg-header-outer-container {
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		width: -moz-available;
		width: -webkit-fill-available;
		z-index: 1;
		font-weight: 900;
		box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
	}

	.jdg-header-inner-container {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: end;
		padding-right: 2rem;
		padding-left: 2rem;
		box-sizing: border-box;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.logo-justification-container {
		position: absolute;
	}

	.logo-container {
		display: flex;
		align-items: baseline;
		height: 100%;
	}

	.logo-container a {
		display: flex;
		height: 100%;
	}

	.logo-img {
		height: 100%;
	}

	.logo-title-container {
		display: flex;
		margin-left: 15px;
		flex-direction: column;
		align-items: baseline;
		justify-content: end;
	}

	.logo-supertitle {
		width: 100%;
		line-height: 2vh;
	}

	.logo-title {
		display: inline;
		width: 100%;
		font-weight: bold;
		line-height: 1vh;
	}
</style>
