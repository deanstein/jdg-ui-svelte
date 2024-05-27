import { jdgColors } from './jdg-styling-constants.js';
import { addUniqueValueToArray, removeValueFromArray } from './jdg-utils.js';
import uiState from './states/ui-state.js';

export const getAccentColors = () => {
	let accentColors = jdgColors.accentColorsJDG;
	uiState.subscribe((currentValue) => {
		accentColors = currentValue.accentColors;
	});
	return accentColors;
};

export const setAccentColors = (accentColors) => {
	uiState.update((currentValue) => {
		currentValue.accentColors = accentColors;
		return currentValue;
	});
};

export const setWindowWidth = (windowWidth) => {
	uiState.update((currentValue) => {
		currentValue.windowWidth = windowWidth;
		return currentValue;
	});
};

export const setClientWidth = (clientWidth) => {
	uiState.update((currentValue) => {
		currentValue.clientWidth = clientWidth;
		return currentValue;
	});
};

export const setIsMobileBreakpoint = (isMobileBreakpoint) => {
	uiState.update((currentValue) => {
		currentValue.isMobileBreakpoint = isMobileBreakpoint;
		return currentValue;
	});
};

export const setShowHeaderStripes = (showHeaderStripes) => {
	uiState.update((currentValue) => {
		currentValue.showHeaderStripes = showHeaderStripes;
		return currentValue;
	});
};

export const setShowImageDetailModal = (showImageDetailModal) => {
	uiState.update((currentValue) => {
		currentValue.showImageDetailOverlay = showImageDetailModal;
		return currentValue;
	});
};

export const setImageDetailAttributes = (imageDetailObject) => {
	uiState.update((currentValue) => {
		currentValue.imageDetailAttributes = imageDetailObject;
		return currentValue;
	});
};

export const setImageDetailEnhancedSrc = (imageDetailEnhancedSource) => {
	uiState.update((currentValue) => {
		currentValue.imageDetailEnhancedSrc = imageDetailEnhancedSource;
		return currentValue;
	});
};

export const getIsNavSideBarOpen = () => {
	let isOpen;

	uiState.subscribe((currentValue) => {
		isOpen = currentValue.showNavSidebar;
	});

	return isOpen;
};

export const setNavSidebarOpen = (sidebarOpenState) => {
	uiState.update((currentValue) => {
		currentValue.showNavSidebar = sidebarOpenState;
		return currentValue;
	});
};

export const toggleDevTools = () => {
	uiState.update((currentValue) => {
		currentValue.showDevTools = !currentValue.showDevTools;
		return currentValue;
	});
};

export const incrementHighestZIndex = () => {
	let newZIndex;
	uiState.update((currentValue) => {
		currentValue.highestZIndex + 1;
		newZIndex = currentValue.highestZIndex;
		return currentValue;
	});
	return newZIndex;
};

export const getHighestZIndex = () => {
	let zIndex = 0;
	uiState.subscribe((currentValue) => {
		zIndex = currentValue.highestZIndex;
	});
	return zIndex;
};

export const addNotificationBanner = (bannerId) => {
	uiState.update((currentValue) => {
		const updatedArray = addUniqueValueToArray(currentValue.activeNotificationBanners, bannerId);
		currentValue.activeNotificationBanners = updatedArray;
		return currentValue;
	});
};

export const removeNotificationBanner = (bannerId) => {
	uiState.update((currentValue) => {
		const updatedArray = removeValueFromArray(currentValue.activeNotificationBanners, bannerId);
		currentValue.activeNotificationBanners = updatedArray;
		return currentValue;
	});
};
