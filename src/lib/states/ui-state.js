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
	showDevTools: false,
	windowWidth: 0, // full window width, including scrollbar
	clientWidth: 0, // window minus scrollbar
	isMobileBreakpoint: false
};

export default writable(uiState);
