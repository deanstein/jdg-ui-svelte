import uiState from './stores/uiState.js';

import { jdgSizes } from './jdg-styling-constants.js';

import { addUniqueValueToArray, removeValueFromArray } from './jdg-utils.js';

export const getScreenCentroid = () => {
	return {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};
};

export const convertFromVhToPixels = (vhValue) => {
	if (typeof window === 'undefined') {
		return 0;
	} else {
		return (vhValue / 100) * window.innerHeight;
	}
};

export const convertFromRemToPixels = (remValue) => {
	return (
		remValue * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('font-size'))
	);
};

// account for any active notifications for the header's top positioning
// returns value in pixels
export const getDistanceToTopOfHeader = () => {
	let distanceToTop = { value: 0, unit: 'px' };
	uiState.subscribe((currentValue) => {
		distanceToTop.value =
			currentValue.activeNotificationBanners.length > 0
				? convertFromVhToPixels(jdgSizes.nNotificationHeight) *
					currentValue.activeNotificationBanners.length
				: 0;
	});
	return distanceToTop;
};

// get the bottom of the header so any main content can start there
// returns value in pixels
export const getDistanceToBottomOfHeader = () => {
	let distanceToBottom = {
		value: 0,
		unit: 'px'
	};
	const notificationHeight = getDistanceToTopOfHeader().value;
	const headerHeight = convertFromVhToPixels(jdgSizes.nHeaderHeight);
	const headerPadding = 2 * convertFromVhToPixels(jdgSizes.nHeaderTopBottomPadding);
	const stripeHeight = 3 * jdgSizes.nHorizontalStripeHeight;
	distanceToBottom.value = notificationHeight + headerHeight + headerPadding + stripeHeight;
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

export const scrollToAnchor = (anchorId, accountForHeader = true, additionalOffset = 0) => {
	const element = document.querySelector(`#${anchorId}`);
	if (element) {
		const topValue = accountForHeader
			? //@ts-expect-error
				element.offsetTop - getDistanceToBottomOfHeader().value - additionalOffset
			: //@ts-expect-error
				element.offsetTop - additionalOffset;
		window.scrollTo({
			top: topValue,
			behavior: 'smooth'
		});
	}
};

export const scrollToAnchorFloatingContentBox = (anchorId) => {
	const additionalOffset = convertFromRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle);
	scrollToAnchor(anchorId, true, additionalOffset);
};

export const openUrl = (url, newTab) => {
	if (newTab) {
		window.open(url, '_blank');
	} else {
		window.location.href = url;
	}
};
