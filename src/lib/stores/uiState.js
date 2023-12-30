import { writable } from 'svelte/store';

const uiState = {
	highestZIndex: 1,
	activeNotificationBanners: []
};

export default writable(uiState);
