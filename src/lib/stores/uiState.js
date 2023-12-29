import { writable } from 'svelte/store';

const uiState = {
	highestZIndex: 0,
	activeNotificationBanners: []
};

export default writable(uiState);
