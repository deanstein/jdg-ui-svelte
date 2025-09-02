import { derived, writable } from 'svelte/store';

export let activeNotificationBanners = writable([]);
export let doShowNavSidebar = writable(false);
export let highestZIndex = writable(1);

export let jumpToNavItems = writable([]);

// breakpoints
export let isMobileBreakpoint = writable(false);
export let isTabletBreakpoint = writable(false);

// font, colors, settings
export let appAccentColors = writable([]);
export let appFontFamily = writable('');
export let doAllowTextSelection = writable(false);
// shared dynamic emotion css styles
export let appCssHyperlinkBar = writable('');
export let appCssHyperlinkSimple = writable('');

// scrolling
export let isScrolling = writable(false);
export let isScrollingToAnchorTag = writable(false);
export let windowScrollPosition = writable(0);
export let scrollDirection = writable('down');

// header
export let headerHeightPx = writable(0);
export let doShowHeaderStripes = writable(false);

// images
export let imageAspectRatios = writable({}); // { src: "", aspectRatio: 0 }
export let imagesLoading = writable([]);

// image detail overlay
export let imageDetailMeta = writable({});
export let imageDetailWidth = writable(0); // width of the image for caption alignment
export let imageDetailScale = writable(1.0);
export let doShowImageDetailOverlay = writable(false);

// sizes
export let clientWidth = writable(0); // window minus scrollbar
export let windowWidth = writable(0); // full window width, including scrollbar

// timeline
export let doShowTimelineEventDetailsModal = writable(false);

// dev tools
export let doShowDevTools = writable(false); // state view and tools in footer
export let doShowDevToolbarSticky = writable(false); // sticky toolbar with specific dev output
export let devToolbarStickyContent = writable('No data found in $devToolbarStickyContent state.');
export let doShowDevOverlay = writable(false); // overlay with specific dev output
export let devOverlayContent = writable('No data found in $devOverlayContent state.');

// create a combined store to display in footer dev tools
const storeMap = {
	appFontFamily,
	appAccentColors,
	appCssHyperlinkBar,
	appCssHyperlinkSimple,
	doAllowTextSelection,
	activeNotificationBanners,
	doShowNavSidebar,
	highestZIndex,
	isMobileBreakpoint,
	jumpToNavItems,
	isScrolling,
	isScrollingToAnchorTag,
	scrollDirection,
	windowScrollPosition,
	headerHeightPx,
	doShowHeaderStripes,
	imageAspectRatios,
	imagesLoading,
	doShowImageDetailOverlay,
	doShowTimelineEventDetailsModal,
	imageDetailMeta,
	imageDetailWidth,
	imageDetailScale,
	clientWidth,
	windowWidth,
	doShowDevTools,
	doShowDevToolbarSticky,
	devToolbarStickyContent,
	doShowDevOverlay,
	devOverlayContent
};
const storeEntries = Object.entries(storeMap);
// derived store containing all ui state values
export let allStateValues = derived(
	storeEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(storeEntries.map(([key], index) => [key, $stores[index]]))
);
