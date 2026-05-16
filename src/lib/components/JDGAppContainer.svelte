<script>
	import { onMount, setContext, tick } from 'svelte';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import getJdgImageMetaRegistry from '$lib/jdg-image-meta-registry.js';

	import { jdgSharedUrls } from '$lib/jdg-shared-strings.js';
	import jdgSharedUrlsStore from '$lib/stores/jdg-shared-urls-store.js';

	import {
		ADMIN_TOKEN_STORAGE_KEY,
		adminModeSource,
		appAccentColors,
		appContainerRef as appContainerRefStore,
		appFontFamily,
		clientWidth,
		allowTextSelection as allowTextSelectionStore,
		colorModeSetting as colorModeSettingStore,
		colorMode as colorModeStore,
		showAdminLoginModal,
		showDevModal,
		showDevToolbarSticky,
		showHeaderStripes as showHeaderStripesStore,
		showImageMetaModal,
		showImageGalleryModal,
		showImageViewerModal,
		headerHeightPx,
		imageViewerMeta,
		isMobileBreakpoint,
		isScrolling,
		scrollDirection,
		tokenBasedAdminMode,
		windowScrollPosition,
		windowWidth,
		windowHeight,
		appCssHyperlinkBar,
		isTabletBreakpoint,
		isAdminMode
	} from '$lib/stores/jdg-ui-store.js';
	import { get } from 'svelte/store';
	import { draftImageMeta, draftTimelineHost } from '$lib/stores/jdg-temp-store.js';

	import { getDistancePxToBottomOfHeader } from '$lib/jdg-ui-management.js';
	import {
		fetchJsonFromRepo,
		fetchVerifyAdmin,
		jdgRepoOwner,
		jdgUiSvelteRepoName
	} from '$lib/jdg-persistence-management.js';

	import {
		JDGAdminLoginModal,
		JDGDevOverlay,
		JDGDevToolbarSticky,
		JDGImageViewerModal,
		JDGImageMetaModal,
		JDGImageRegistryGalleryModal,
		JDGLoadingOverlay,
		JDGMaintenanceOverlay,
		JDGScrollToTop,
		JDGSaveStateBanner
	} from '$lib/index.js';
	import {
		setUpdatedHyperlinkStyleSimple,
		jdgBreakpoints,
		jdgColors,
		jdgFonts,
		getThemePalette,
		themeColors,
		setUpdatedHyperlinkStyleBar
	} from '$lib/jdg-shared-styles.js';

	// IMAGE META REGISTRY
	// Consuming websites *must* provide an image meta regisry
	export let imageMetaRegistry;

	// Set the registry in context for read-only access by descendant components
	setContext(JDG_CONTEXTS.IMAGE_META_REGISTRY, imageMetaRegistry);

	// STYLING OPTIONS
	export let fontFamily = jdgFonts.body;
	export let appLoadingIconSrc = getJdgImageMetaRegistry().jdg_logo_ui.src;
	export let accentColors = jdgColors.accentColorsJDG;
	// "Banner under text" hyperlink style
	export let linkColorDefault = accentColors[0];
	// "Simple" hyperlink style
	export let linkColorSimple = accentColors[0];
	// How much the link color will be adjusted for contrast with text
	export let linkColorContrastAdjustment = 10;
	export let loadingSpinnerColor = accentColors[0];
	export let showHeaderStripes = true;
	export let showScrollToTopButton = true;
	export let allowTextSelection = false;
	export let showMaintenanceOverlay = false;
	export let maintenanceMessage = "We're making some updates. Try again shortly.";
	// 'auto' follows OS preference; 'light'/'dark' forces a specific mode
	export let colorMode = 'auto';

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

	// track last known width to avoid unnecessary updates on iOS
	// (iOS fires resize when action bar shows/hides, but only height changes)
	let lastKnownWidth = 0;

	let resolvedColorMode = 'light';
	let darkModeMediaQuery;

	function resolveColorMode() {
		if (colorMode === 'auto') {
			resolvedColorMode = darkModeMediaQuery?.matches ? 'dark' : 'light';
		} else {
			resolvedColorMode = colorMode;
		}
		colorModeSettingStore.set(colorMode);
		colorModeStore.set(resolvedColorMode);
	}

	// app sets window and client width in the ui state
	// so children don't have to add event handlers
	const onPageResize = () => {
		const currentWidth = window.innerWidth;

		// Only update stores if width actually changed
		// This prevents iOS action bar show/hide from triggering re-renders
		if (currentWidth !== lastKnownWidth) {
			lastKnownWidth = currentWidth;
			windowWidth.set(currentWidth);
			windowHeight.set(window.innerHeight);
			clientWidth.set(appContainerRef?.clientWidth);
			headerHeightPx.set(getDistancePxToBottomOfHeader($showHeaderStripesStore));
			isMobileBreakpoint.set(appContainerRef?.clientWidth <= jdgBreakpoints.width[0]);
			isTabletBreakpoint.set(
				appContainerRef?.clientWidth > jdgBreakpoints.width[0] &&
					appContainerRef?.clientWidth <= jdgBreakpoints.width[1]
			);
		}
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

	// global styles using emotion css (reactive for theme changes)
	let appContainerCss = css``;
	$: appContainerCss = css`
		.jdg-letter-spacing-title {
			letter-spacing: 5px;
		}

		hr {
			border: none;
			height: 1px;
			width: 100%;
			background-color: ${$themeColors.text};
		}

		color: ${$themeColors.text};
		font-family: ${fontFamily};
	`;

	onMount(async () => {
		// Set the app container element reference for JDGPortal to use
		appContainerRefStore.set(appContainerRef);

		await tick(); // layout so clientWidth / breakpoints are meaningful

		onPageResize(); // windowWidth + windowHeight before slot mounts

		// Use the text selection prop to set the state initially
		allowTextSelectionStore.set(allowTextSelection);

		// Set UI state based on props
		// (must happen before isAppLoaded so children have valid store values at creation time)
		appFontFamily.set(fontFamily);
		appAccentColors.set(accentColors);
		showHeaderStripesStore.set(showHeaderStripes);

		// Set up color mode detection
		darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		darkModeMediaQuery.addEventListener('change', resolveColorMode);
		resolveColorMode();

		// Update shared style states with resolved palette
		const palette = getThemePalette(resolvedColorMode);
		setUpdatedHyperlinkStyleBar(
			linkColorDefault,
			linkColorContrastAdjustment,
			accentColors,
			useStripedHyperlinkHoverStyle,
			stripedColorOpacity,
			palette.text
		);
		setUpdatedHyperlinkStyleSimple(linkColorSimple, palette.contentBoxBackground);

		isAppLoaded = true;

		await tick();

		// Set the shared url store once by fetching the json
		const updatedSharedUrlsJson = await fetchJsonFromRepo(
			jdgRepoOwner,
			jdgUiSvelteRepoName,
			jdgSharedUrls.jdgSharedUrlsStoreFileName
		);
		if (updatedSharedUrlsJson) {
			// Ensure the existing store structure is merged with the new json
			jdgSharedUrlsStore.set({ ...jdgSharedUrlsStore, ...updatedSharedUrlsJson });
		}

		// Restore admin state from stored JWT when app has not provided adminModeSource
		if (get(adminModeSource) === null && typeof sessionStorage !== 'undefined') {
			const token = sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
			if (token) {
				const verified = await fetchVerifyAdmin(token);
				if (verified?.isAdmin) {
					tokenBasedAdminMode.set(true);
				} else {
					sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
					tokenBasedAdminMode.set(false);
				}
			}
		}
	});

	// OPTIONAL DEBUG: Set sticky dev toolbar overlay content and show it
	// $: {
	// 	$devToolbarStickyContent = JSON.stringify($draftImageMeta);
	// 	$showDevToolbarSticky = true;
	// }

	let appContainerCssDynamic = css``;
	$: {
		appContainerCssDynamic = css`
			${!$allowTextSelectionStore &&
			`
				-webkit-user-select: none; /* Safari */
				-moz-user-select: none;    /* Firefox */
				-ms-user-select: none;     /* Internet Explorer/Edge */
				user-select: none;         /* Standard syntax */
			`}
		`;
	}

	$: if (isAppLoaded && resolvedColorMode) {
		const palette = getThemePalette(resolvedColorMode);
		setUpdatedHyperlinkStyleBar(
			linkColorDefault,
			linkColorContrastAdjustment,
			accentColors,
			useStripedHyperlinkHoverStyle,
			stripedColorOpacity,
			palette.text
		);
		setUpdatedHyperlinkStyleSimple(linkColorSimple, palette.contentBoxBackground);
	}
</script>

<!-- set up directives for event listeners -->
<svelte:window on:resize={onPageResize} on:scroll={onPageScroll} />

<div
	class="jdg-app-container {appContainerCss} {appContainerCssDynamic} {$appCssHyperlinkBar}"
	bind:this={appContainerRef}
>
	<!-- ALL CONTENT GOES HERE AFTER APP IS LOADED -->
	{#if isAppLoaded}
		<slot />
	{/if}

	<!-- SaveStateBanner will show when required-->
	{#if !$draftTimelineHost && !$draftImageMeta}
		<!-- Don't scroll for timeline and image editing -->
		<JDGSaveStateBanner scrollOnStatusChange={!$draftTimelineHost && !$draftImageMeta} />
	{/if}

	<!-- Show button to scroll to the top of page -->
	{#if showScrollToTopButton}
		<JDGScrollToTop />
	{/if}

	<!-- OVERLAYS -->
	<!-- Maintenance -->
	{#if showMaintenanceOverlay}
		<JDGMaintenanceOverlay iconSrc={appLoadingIconSrc} message={maintenanceMessage} />
	{/if}
	<!-- Admin -->
	{#if $showAdminLoginModal}
		<JDGAdminLoginModal />
	{/if}
	<!-- Loading -->
	{#if !showMaintenanceOverlay}
		<JDGLoadingOverlay
			isLoading={!isAppLoaded}
			loadingIconSrc={appLoadingIconSrc}
			{loadingSpinnerColor}
		/>
	{/if}
	<!-- Image -->
	{#if $showImageViewerModal}
		<JDGImageViewerModal imageMeta={$imageViewerMeta} />
	{/if}
	<!-- TimelineEventModal is rendered inside JDGTimeline for context access -->
	{#if $showImageMetaModal}
		<JDGImageMetaModal />
	{/if}
	{#if $showImageGalleryModal}
		<JDGImageRegistryGalleryModal />
	{/if}
	<!-- Dev -->
	{#if $showDevModal}
		<JDGDevOverlay />
	{/if}
	{#if $showDevToolbarSticky}
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
		overflow-x: clip;
	}
</style>
