import { addUniqueValueToArray, removeValueFromArray } from './jdg-utils.js';
import {
	accentColors,
	activeNotificationBanners,
	highestZIndex,
	imageAspectRatios,
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
// IMAGES
//

export const recordImageAspectRatio = (src, imageWidth, imageHeight, overwriteIfLarger = false) => {
	const imageAspectRatio = imageWidth / imageHeight;
	let updateNeeded = false; // only update the store when needed

	imageAspectRatios.subscribe((store) => {
		const prevAspectRatio = store[src]?.aspectRatio || 0;
		const prevWidth = store[src]?.width || 0;
		const prevHeight = store[src]?.height || 0;

		if (
			(imageWidth * imageHeight > prevWidth * prevHeight && overwriteIfLarger) ||
			Math.abs(imageAspectRatio - prevAspectRatio) > 0.01
		) {
			updateNeeded = true;
		}
	});

	// only update the store the aspectRatio has changed considerably
	// and if the source width and height are larger (more accurate aspect ratio)
	if (updateNeeded) {
		imageAspectRatios.update((store) => {
			store = {
				...store,
				[src]: { width: imageWidth, height: imageHeight, aspectRatio: imageAspectRatio }
			};
			return store;
		});
	}
};

export const getImageAspectRatioRecord = (src) => {
	let aspectRatio = 0.0;
	imageAspectRatios.subscribe((store) => {
		aspectRatio = store[src]?.aspectRatio || 0.0;
	})();
	return aspectRatio;
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
