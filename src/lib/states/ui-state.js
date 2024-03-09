import { writable } from 'svelte/store';

const uiState = {
	isNavSidebarOpen: false,
	highestZIndex: 1,
	activeNotificationBanners: [],
	windowWidth: 0
};

export default writable(uiState);
