import { writable } from 'svelte/store';

import { jdgColors } from '$lib/jdg-shared-styles.js';

const uiState = {
	accentColors: jdgColors.accentColorsJDG,
	activeNotificationBanners: [],
	highestZIndex: 1,
	imageDetailAttributes: {},
	jumpToNavItems: [],
	showHeaderStripes: false,
	showImageDetailOverlay: false,
	showNavSidebar: false,
	showDevTools: false
};

export let isMobileBreakpoint = writable(false);
export let isScrolling = writable(false);
export let clientWidth = writable(0); // window minus scrollbar
export let windowWidth = writable(0); // full window width, including scrollbar

export default writable(uiState);
