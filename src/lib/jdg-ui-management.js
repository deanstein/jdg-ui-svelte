import uiState from './stores/uiState.js';

import { jdgSizes } from './jdg-styling-constants.js';

import { addUniqueValueToArray, removeValueFromArray } from './jdg-utils.js';

export const getScreenCentroid = () => {
	return {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};
};

// account for any active notifications for the header's top positioning
export const getDistanceToTopOfHeader = () => {
	let distanceToTop = { value: 0, unit: jdgSizes.fontUnitNotification };
	uiState.subscribe((currentValue) => {
		distanceToTop.value =
			currentValue.activeNotificationBanners.length > 0
				? jdgSizes.nNotificationHeight * currentValue.activeNotificationBanners.length
				: 0;
	});
	return distanceToTop;
};

// get the bottom of the header so any main content can start there
export const getDistanceToBottomOfHeader = () => {
	let distanceToBottom = { value: 0, unit: jdgSizes.headerHeightUnit };
	distanceToBottom.value =
		getDistanceToTopOfHeader().value +
		jdgSizes.nHeaderHeight +
		2 * jdgSizes.nHeaderTopBottomPadding;
	return distanceToBottom;
};

export const getHighestZIndex = () => {
	let zIndex = 0;
	uiState.subscribe((currentValue) => {
		zIndex = currentValue.highestZIndex;
	});
	return zIndex;
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

export const addNotificationBannerToState = (bannerId) => {
	uiState.update((currentValue) => {
		const updatedArray = addUniqueValueToArray(currentValue.activeNotificationBanners, bannerId);
		currentValue.activeNotificationBanners = updatedArray;
		return currentValue;
	});
};

export const removeNotificationBannerFromState = (bannerId) => {
	uiState.update((currentValue) => {
		const updatedArray = removeValueFromArray(currentValue.activeNotificationBanners, bannerId);
		currentValue.activeNotificationBanners = updatedArray;
		return currentValue;
	});
};

export const scrollToAnchor = (anchorId) => {
	const element = document.querySelector(`#${anchorId}`);
	if (element) {
		window.scrollTo({
			//@ts-expect-error
			top: element.offsetTop,
			behavior: 'smooth'
		});
	}
};

export const openUrl = (url, newTab) => {
	if (newTab) {
		window.open(url, '_blank');
	} else {
		window.location.href = url;
	}
};
