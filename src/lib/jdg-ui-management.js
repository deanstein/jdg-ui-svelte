import { jdgBreakpoints, jdgSizes } from './jdg-styling-constants.js';

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
	const stripeHeight = includeStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0;
	distanceToBottom.value = headerHeight + headerPadding + stripeHeight;
	return distanceToBottom;
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
