import uiState from './states/ui-state.js';

import { jdgBreakpoints, jdgSizes } from './jdg-styling-constants.js';

import { addUniqueValueToArray, convertRemToPixels, removeValueFromArray } from './jdg-utils.js';

export const setWindowWidth = (windowWidth) => {
	uiState.update((currentValue) => {
		currentValue.windowWidth = windowWidth;
		return currentValue;
	});
};

export const getIsNavSideBarOpen = () => {
	let isOpen;

	uiState.subscribe((currentValue) => {
		isOpen = currentValue.isNavSidebarOpen;
	});

	return isOpen;
};

export const setNavSidebarOpen = (sidebarOpenState) => {
	uiState.update((currentValue) => {
		currentValue.isNavSidebarOpen = sidebarOpenState;
		return currentValue;
	});
};

export const getScreenCentroid = () => {
	return {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};
};

// get the bottom of the header so any main content can start there
// returns value in pixels
export const getDistanceToBottomOfHeader = (includeStripes = false) => {
	let distanceToBottom = {
		value: 0,
		unit: 'px'
	};
	const headerHeight = jdgSizes.nHeaderHeightLg;
	const headerPadding = jdgSizes.nHeaderTopBottomPadding * 2;
	const stripeHeight = includeStripes ? 3 * jdgSizes.nHorizontalStripeHeight : 0;
	distanceToBottom.value = headerHeight + headerPadding + stripeHeight;
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
	const additionalOffset = convertRemToPixels(jdgSizes.nFontSizeFloatingContentBoxTitle);
	scrollToAnchor(anchorId, true, additionalOffset);
};

export const openUrl = (url, newTab) => {
	if (newTab) {
		window.open(url, '_blank');
	} else {
		window.location.href = url;
	}
};

// do stuff at each breakpoint
export const breakpointHandler = (
	breakpoint0Function,
	breakpoint1Function,
	breakpoint2Function
) => {
	if (window.innerWidth < jdgBreakpoints.width[0]) {
		// less than smallest breakpoint - mobile
		breakpoint0Function();
	} else if (
		window.innerWidth >= jdgBreakpoints.width[0] &&
		window.innerWidth <= jdgBreakpoints.width[1]
	) {
		// between smallest and largest breakpoint - tablet
		breakpoint1Function();
	} else {
		// largest breakpoint - desktop
		breakpoint2Function();
	}
};
