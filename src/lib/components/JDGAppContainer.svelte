<script>
	import { onMount, setContext, tick } from 'svelte';
	import { css } from '@emotion/css';

	import { JDG_CONTEXTS } from '$lib/jdg-contexts.js';

	import { jdgSharedUrls } from '$lib/jdg-shared-strings.js';
	import jdgSharedUrlsStore from '$lib/stores/jdg-shared-urls-store.js';

	import {
		appAccentColors,
		appContainerRef as appContainerRefStore,
		appFontFamily,
		clientWidth,
		allowTextSelection as allowTextSelectionStore,
		showAdminLoginModal,
		showDevModal,
		showDevToolbarSticky,
		showHeaderStripes as showHeaderStripesStore,
		showImageMetaModal,
		showImageGalleryModal,
		showImageViewerModal,
		showTimelineEventModal,
		headerHeightPx,
		imageViewerMeta,
		isMobileBreakpoint,
		isScrolling,
		scrollDirection,
		windowScrollPosition,
		windowWidth,
		appCssHyperlinkBar,
		isTabletBreakpoint,
		isAdminMode
	} from '$lib/stores/jdg-ui-store.js';

	import { getDistancePxToBottomOfHeader } from '$lib/jdg-ui-management.js';
	import {
		fetchJsonFromRepo,
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
		JDGScrollToTop,
		JDGTimelineEventModal,
		JDGSaveStateBanner
	} from '$lib/index.js';
	import {
		setUpdatedHyperlinkStyleSimple,
		jdgBreakpoints,
		jdgColors,
		jdgFonts,
		setUpdatedHyperlinkStyleBar
	} from '$lib/jdg-shared-styles.js';
	import getJdgimageMetaRegistry from '$lib/jdg-image-meta-registry.js';
	import { draftImageMetaRegistry } from '$lib/stores/jdg-temp-store.js';

	// IMAGE META REGISTRY
	// Consuming websites *must* provide an image meta regisry
	export let imageMetaRegistry;

	// Set the registry in context for read-only access by descendant components
	setContext(JDG_CONTEXTS.IMAGE_META_REGISTRY, imageMetaRegistry);

	// STYLING OPTIONS
	export let fontFamily = jdgFonts.body;
	export let appLoadingIconSrc = getJdgimageMetaRegistry().jdg_logo_ui.src;
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

	// app sets window and client width in the ui state
	// so children don't have to add event handlers
	const onPageResize = () => {
		const currentWidth = window.innerWidth;

		// Only update stores if width actually changed
		// This prevents iOS action bar show/hide from triggering re-renders
		if (currentWidth !== lastKnownWidth) {
			lastKnownWidth = currentWidth;
			windowWidth.set(currentWidth);
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

	onMount(async () => {
		// Call onPageResize() once for initialization
		setTimeout(onPageResize, 0);

		// Set the app container element reference for JDGPortal to use
		appContainerRefStore.set(appContainerRef);

		await tick(); // Delay until layout and all children are loaded
		isAppLoaded = true;

		// Use the text selection prop to set the state initially
		allowTextSelectionStore.set(allowTextSelection);

		// Set UI state based on props
		appFontFamily.set(fontFamily);
		appAccentColors.set(accentColors);
		showHeaderStripesStore.set(showHeaderStripes);

		// Update shared style states
		setUpdatedHyperlinkStyleBar(
			linkColorDefault,
			linkColorContrastAdjustment,
			accentColors,
			useStripedHyperlinkHoverStyle,
			stripedColorOpacity
		);
		setUpdatedHyperlinkStyleSimple(linkColorSimple);

		// Set the shared url store once by fetching the json
		// Note: This must be below the setTimeout above
		const updatedSharedUrlsJson = await fetchJsonFromRepo(
			jdgRepoOwner,
			jdgUiSvelteRepoName,
			jdgSharedUrls.jdgSharedUrlsStoreFileName
		);
		if (updatedSharedUrlsJson) {
			// Ensure the existing store structure is merged with the new json
			jdgSharedUrlsStore.set({ ...jdgSharedUrlsStore, ...updatedSharedUrlsJson });
		}

		// If the app is running locally,
		// set isAdminMode to true by default
		if (window.location.hostname === 'localhost') {
			isAdminMode.set(true);
		}
	});

	// If isAdminMode changes to true,
	// hydrate the imageMetaAdminRegistry store for editing
	$: {
		if ($isAdminMode) {
			draftImageMetaRegistry.set(imageMetaRegistry);
		}
	}

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
</script>

<!-- set up directives for event listeners -->
<svelte:window on:resize={onPageResize} on:scroll={onPageScroll} />

<div
	class="jdg-app-container {appContainerCss} {appContainerCssDynamic} {$appCssHyperlinkBar}"
	bind:this={appContainerRef}
>
	<!-- all content goes here after the app is loaded -->
	{#if isAppLoaded}
		<!-- Save state banner will show when required -->
		<JDGSaveStateBanner />
		<slot />
	{/if}
	{#if showScrollToTopButton}
		<JDGScrollToTop />
	{/if}

	<!-- OVERLAYS -->
	<!-- Admin -->
	{#if $showAdminLoginModal}
		<JDGAdminLoginModal />
	{/if}
	<!-- Loading -->
	<JDGLoadingOverlay
		isLoading={!isAppLoaded}
		loadingIconSrc={appLoadingIconSrc}
		{loadingSpinnerColor}
	/>
	<!-- Image -->
	{#if $showImageViewerModal}
		<JDGImageViewerModal imageMeta={$imageViewerMeta} />
	{/if}
	<!-- Timeline -->
	{#if $showTimelineEventModal}
		<JDGTimelineEventModal />
	{/if}
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
	}
</style>
