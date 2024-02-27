import { writable } from 'svelte/store';

const uiState = {
	isNavSidebarOpen: false,
	highestZIndex: 1,
	activeNotificationBanners: []
};

export default writable(uiState);
