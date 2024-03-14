import { writable } from 'svelte/store';

const uiState = {
	windowWidth: 0,
	showImageDetailOverlay: false,
	imageDetailAttributes: {},
	showNavSidebar: false,
	highestZIndex: 1,
	activeNotificationBanners: []
};

export default writable(uiState);
