<script>
	import { onMount, setContext, tick } from 'svelte';
	import { css } from '@emotion/css';

	import jdgContexts from '$lib/jdg-contexts.js';
	import {
		appAccentColors,
		appFontFamily,
		clientWidth,
		doAllowTextSelection,
		doShowDevOverlay,
		doShowDevToolbarSticky,
		doShowHeaderStripes,
		doShowImageDetailOverlay,
		headerHeightPx,
		imageDetailAttributes,
		isMobileBreakpoint,
		isScrolling,
		scrollDirection,
		windowScrollPosition,
		windowWidth
	} from '$lib/states/ui-state.js';

	import { adjustColorForContrast, convertHexToRGBA } from '$lib/jdg-utils.js';

	import {
		JDGDevOverlay,
		JDGDevToolbarSticky,
		JDGImageDetailOverlay,
		JDGLoadingOverlay,
		JDGScrollToTop
	} from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgFonts, jdgLinkStyles } from '$lib/jdg-shared-styles.js';
	import { getDistancePxToBottomOfHeader } from '$lib/jdg-ui-management.js';

	export let fontFamily = jdgFonts.body;
	export let appLoadingIconSrc =
		'https://res.cloudinary.com/jdg-main/image/upload/v1718070772/jdg-ui-svelte/jdg-ui-logo_cs4ji5.jpg';
	export let accentColors = jdgColors.accentColorsJDG;
	export let linkColorDefault = accentColors[0]; /* color for the "banner" hyperlink style */
	export let linkColorSimple = accentColors[0]; /* color for the simple hyperlink style */
	export let loadingSpinnerColor = accentColors[0];
	export let showHeaderStripes = true;
	export let showScrollToTopButton = true;
	export let allowTextSelection = false;

	// flag to show a loading overlay before app is loaded
	// to prevent flash of unstyled content
	let isAppLoaded = false;

	// used for determining the "client width" - width w/o scrollbars
	let appContainerRef;

	// global hyperlink style options
	const stripedColorOpacity = 0.75;
	const useStripedHyperlinkHoverStyle = false;

	// determine whether page is being actively scrolled or not
	const scrollTimeoutDuration = 100; //ms
	let scrollTimeout;

	// helps determine if last scroll direction was up or down
	let lastWindowScrollY = 0;

	// app sets window and client width in the ui state
	// so children don't have to add event handlers
	const onPageResize = () => {
		windowWidth.set(window.innerWidth);
		clientWidth.set(appContainerRef?.clientWidth);
		headerHeightPx.set(getDistancePxToBottomOfHeader($doShowHeaderStripes));
		isMobileBreakpoint.set(appContainerRef?.clientWidth <= jdgBreakpoints.width[0]);
	};

	// set whether page is being scrolled or not
	const onPageScroll = () => {
		// set window position and scrolling state
		windowScrollPosition.set(window.scrollY);
		isScrolling.set(true);

		// set scrolling direction
		const currentScrollPos = window.scrollY;
		if (currentScrollPos > lastWindowScrollY) {
			scrollDirection.set('down');
		} else {
			scrollDirection.set('up');
		}
		lastWindowScrollY = currentScrollPos;

		// slight delay before we decide scrolling is not happening anymore
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isScrolling.set(false);
		}, scrollTimeoutDuration);
	};

	// global styles using emotion css
	const appContainerCss = css`
		.jdg-letter-spacing-title {
			letter-spacing: 5px;
		}

		hr {
			border: none;
			height: 1px;
			width: 100%;
			background-color: ${jdgColors.text};
		}

		color: ${jdgColors.text};
		font-family: ${fontFamily};
	`;

	const linkStyleDefaultCss = css`
		${jdgLinkStyles.animatedBar}
		a {
			color: ${jdgColors.text};
		}

		a.no-initial-highlight::before,
		.jdg-highlight-container .jdg-highlight::before {
			background: ${useStripedHyperlinkHoverStyle
				? `linear-gradient(
				to bottom,
				${convertHexToRGBA(appAccentColors[0], stripedColorOpacity)} 33%,
				${convertHexToRGBA(appAccentColors[1], stripedColorOpacity)} 33%,
				${convertHexToRGBA(appAccentColors[1], stripedColorOpacity)} 66%,
				${convertHexToRGBA(appAccentColors[2], stripedColorOpacity)} 66%
			)`
				: `${adjustColorForContrast(linkColorDefault, jdgColors.text, 10)}`};
		}
		a:before {
			background: ${adjustColorForContrast(linkColorDefault, jdgColors.text, 10)};
		}
	`;

	// other link styles which may not be used here but need to be defined here and
	// made available via setContext for other components to possibly access
	const linkStyleSimpleCss = css`
		${jdgLinkStyles.simple}
		a {
			color: ${adjustColorForContrast(linkColorSimple, jdgColors.contentBoxBackground, 3)};
		}
		a:hover {
			color: ${adjustColorForContrast(linkColorSimple, jdgColors.contentBoxBackground, 5)};
		}
	`;
	setContext(jdgContexts.linkStyleSimple, linkStyleSimpleCss);

	onMount(async () => {
		await tick(); // delay until layout and all children are loaded
		isAppLoaded = true;

		// use the text selection prop to set the state initially
		doAllowTextSelection.set(allowTextSelection);

		// set stores based on props
		appFontFamily.set(fontFamily);
		appAccentColors.set(accentColors);
		doShowHeaderStripes.set(showHeaderStripes);
		// update the client and window width at the end so they're accurate
		setTimeout(onPageResize, 0);
	});

	let appContainerCssDynamic = css``;
	$: {
		appContainerCssDynamic = css`
			${!$doAllowTextSelection &&
			`
				-webkit-user-select: none; /* Safari */
				-moz-user-select: none;    /* Firefox */
				-ms-user-select: none;     /* Internet Explorer/Edge */
				user-select: none;         /* Standard syntax */
			`}
		`;
	}
</script>

<!-- set up directives for event listeners -->
<svelte:window on:resize={onPageResize} on:scroll={onPageScroll} />

<div
	class="jdg-app-container {appContainerCss} {appContainerCssDynamic} {linkStyleDefaultCss}"
	bind:this={appContainerRef}
>
	<!-- all content goes here after the app is loaded -->
	{#if isAppLoaded}
		<slot />
	{/if}
	{#if showScrollToTopButton}
		<JDGScrollToTop />
	{/if}
	<!-- show overlays when requested -->
	<JDGLoadingOverlay
		isLoading={!isAppLoaded}
		loadingIconSrc={appLoadingIconSrc}
		{loadingSpinnerColor}
	/>
	{#if $doShowImageDetailOverlay}
		<JDGImageDetailOverlay imageAttributes={$imageDetailAttributes} />
	{/if}
	<!-- show dev UI when requested -->
	{#if $doShowDevOverlay}
		<JDGDevOverlay />
	{/if}
	{#if $doShowDevToolbarSticky}
		<JDGDevToolbarSticky />
	{/if}
</div>

<style>
	:global(body),
	:global(p) {
		margin: 0;
	}

	:global(:root) {
		scroll-behavior: smooth;
	}

	.jdg-app-container {
		display: flex;
		flex-direction: column;
	}
</style>
