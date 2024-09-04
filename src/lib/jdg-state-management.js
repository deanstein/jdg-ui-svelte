import { addUniqueValueToArray, removeValueFromArray } from './jdg-utils.js';
import {
	accentColors,
	activeNotificationBanners,
	highestZIndex,
	imageDetailAttributes,
	jumpToNavItems,
	doShowImageDetailOverlay,
	doShowNavSidebar,
	doShowDevTools
} from './states/ui-state.js';

//
// ACCENT COLORS + HEADER STRIPES
//

export const getAccentColors = () => {
	let currentAccentColors;
	accentColors.subscribe((currentValue) => {
		currentAccentColors = currentValue;
	});
	return currentAccentColors;
};

//
// IMAGE DETAIL MODAL
//

export const showImageDetailModal = (imageAttributes) => {
	doShowImageDetailOverlay.set(true);
	imageDetailAttributes.set(imageAttributes);
};

export const hideImageDetailModal = () => {
	doShowImageDetailOverlay.set(false);
	imageDetailAttributes.set(undefined);
};

//
// JUMP-TO
//

export const resetJumpToNavItems = () => {
	jumpToNavItems.update((currentValue) => {
		currentValue = [];
		return currentValue;
	});
};

export const addJumpToNavItem = (navItem) => {
	jumpToNavItems.update((currentValue) => {
		currentValue.push(navItem);
		return currentValue;
	});
};

export const removeJumpToNavItem = (navItem) => {
	jumpToNavItems.update((currentValue) => {
		const index = currentValue.findIndex(
			(item) => JSON.stringify(item) === JSON.stringify(navItem)
		);
		if (index !== -1) {
			currentValue.splice(index, 1);
		}
		return currentValue;
	});
};

//
// NAV SIDEBAR
//

export const getIsNavSideBarOpen = () => {
	let isOpen;
	doShowNavSidebar.subscribe((currentValue) => {
		isOpen = currentValue;
	});

	return isOpen;
};

//
// NOTIFICATION BANNERS
//

export const addNotificationBanner = (bannerId) => {
	activeNotificationBanners.update((currentValue) => {
		const updatedArray = addUniqueValueToArray(currentValue, bannerId);
		currentValue = updatedArray;
		return currentValue;
	});
};

export const removeNotificationBanner = (bannerId) => {
	activeNotificationBanners.update((currentValue) => {
		const updatedArray = removeValueFromArray(currentValue, bannerId);
		currentValue = updatedArray;
		return currentValue;
	});
};

//
// Z-INDICES
//

export const incrementHighestZIndex = () => {
	let newZIndex;
	highestZIndex.update((currentValue) => {
		currentValue + 1;
		newZIndex = currentValue;
		return currentValue;
	});
	return newZIndex;
};

export const getHighestZIndex = () => {
	let zIndex = 0;
	highestZIndex.subscribe((currentValue) => {
		zIndex = currentValue;
	});
	return zIndex;
};

//
// DEV TOOLS
//

export const toggleDevTools = () => {
	doShowDevTools.update((currentValue) => {
		currentValue = !currentValue;
		return currentValue;
	});
};
