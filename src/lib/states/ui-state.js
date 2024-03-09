import { writable } from 'svelte/store';

const uiState = {
	windowWidth: 0,
	showImageDetailModal: false,
	imageDetails: {},
	showNavSidebar: false,
	highestZIndex: 1,
	activeNotificationBanners: []
};

export default writable(uiState);
