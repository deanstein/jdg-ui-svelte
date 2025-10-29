import { derived, writable } from 'svelte/store';

/*** ADMINISTRATION ***/
export let isAdminMode = writable(true);
export let showAdminLoginModal = writable(false);
export let postAdminLoginFunction = writable(() => {});

/*** BREAKPOINTS ***/
export let isMobileBreakpoint = writable(false);
export let isTabletBreakpoint = writable(false);

/*** FONTS, COLORS, SETTINGS ***/
export let appAccentColors = writable([]);
export let appFontFamily = writable('');
export let allowTextSelection = writable(false);
// shared dynamic emotion css styles
export let appCssHyperlinkBar = writable('');
export let appCssHyperlinkSimple = writable('');

/*** SCROLLING ***/
export let isScrolling = writable(false);
export let isScrollingToAnchorTag = writable(false);
export let windowScrollPosition = writable(0);
export let scrollDirection = writable('down');

/*** NAVIGATION ***/
export let jumpToNavItems = writable([]);
export let showNavSidebar = writable(false);

/*** HEADER ***/
export let headerHeightPx = writable(0);
export let showHeaderStripes = writable(false);

/*** IMAGES ***/
export let imageAspectRatios = writable({}); // { src: "", aspectRatio: 0 }
export let imagesLoading = writable([]);
/*** IMAGE VIEWER MODAL ***/
export let imageViewerMeta = writable({});
export let imageViewerWidth = writable(0); // width of the image for caption alignment
export let imageViewerScale = writable(1.0);
export let showImageViewerModal = writable(false);
/*** IMAGE META MODAL ***/
export let showImageMetaModal = writable(false);

/*** TIMELINE ***/
export let showTimelineEventModal = writable(false);
export let isTimelineEventModalEditable = writable(false);

/*** QUANTITIES ***/
export let clientWidth = writable(0); // window minus scrollbar
export let windowWidth = writable(0); // full window width, including scrollbar
export let highestZIndex = writable(1);

/*** DELETION ***/
export let showDeleteModal = writable(false);
export let customDeleteMessage = writable(undefined);
export let postDeleteFunction = writable(() => {});

/*** DEV TOOLS ***/
export let showDevTools = writable(false); // state view and tools in footer
export let showDevToolbarSticky = writable(false); // sticky toolbar with specific dev output
export let devToolbarStickyContent = writable('No data found in $devToolbarStickyContent state.');
export let showDevModal = writable(false); // overlay with specific dev output
export let devModalContent = writable('No data found in $devModalContent state.');

// Create a combined store to display in footer dev tools
const storeMap = {
	// administration
	isAdminMode,
	// breakpoints
	isMobileBreakpoint,
	isTabletBreakpoint,
	// font, colors, settings
	appFontFamily,
	appAccentColors,
	appCssHyperlinkBar,
	appCssHyperlinkSimple,
	allowTextSelection,
	// scrolling
	isScrolling,
	isScrollingToAnchorTag,
	scrollDirection,
	windowScrollPosition,
	// nav
	showNavSidebar,
	jumpToNavItems,
	// header
	headerHeightPx,
	showHeaderStripes,
	// images
	imageAspectRatios,
	imagesLoading,
	showImageViewerModal,
	imageViewerMeta,
	imageViewerWidth,
	imageViewerScale,
	// timeline
	showTimelineEventModal,
	// quantities
	clientWidth,
	windowWidth,
	highestZIndex,
	// deletion
	showDeleteModal,
	customDeleteMessage,
	postDeleteFunction,
	// dev
	showDevTools,
	showDevToolbarSticky,
	devToolbarStickyContent,
	showDevModal,
	devModalContent
};
const uiStoreEntries = Object.entries(storeMap);
// derived store containing all ui state values
export let allUiStoreValues = derived(
	uiStoreEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(uiStoreEntries.map(([key], index) => [key, $stores[index]]))
);
