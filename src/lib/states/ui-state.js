import { writable } from 'svelte/store';

import { jdgColors } from '$lib/jdg-styling-constants.js';

const uiState = {
	accentColors: jdgColors.accentColorsJDG,
	activeNotificationBanners: [],
	highestZIndex: 1,
	imageDetailAttributes: {},
	showImageDetailOverlay: false,
	showNavSidebar: false,
	windowWidth: 0
};

export default writable(uiState);
