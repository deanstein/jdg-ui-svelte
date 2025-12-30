import { get } from 'svelte/store';

import {
	showAdminLoginModal,
	showTimelineEventModal,
	isAdminMode,
	postAdminLoginFunction
} from './stores/jdg-ui-store.js';
import { draftTimelineEvent } from './stores/jdg-temp-store.js';

import jdgTimelineEventTypes from './schemas/timeline/jdg-timeline-event-types.js';
import jdgTimelineRowItem from '$lib/schemas/timeline/jdg-timeline-row-item.js';

import { instantiateObject } from '$lib/jdg-utils.js';

import { jdgBreakpoints, jdgQuantities, jdgSizes } from '$lib/jdg-shared-styles.js';
import { getTimelineEventById, upgradeTimelineHost } from './jdg-timeline-management.js';

//
// ADMIN MODE
//

// wrapper for functions that require
// adminMode to be checked or authenticated first
export const requireAdminMode = (fn) => {
	if (get(isAdminMode)) {
		fn();
	} else {
		showAdminLoginModal.set(true);
		postAdminLoginFunction.set(fn);
	}
};

//
// SCREEN
//

export const getScreenCentroid = () => {
	return {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};
};

// get the bottom of the header so any main content can start there
// returns value in pixels
export const getDistancePxToBottomOfHeader = (includeStripes = false) => {
	let distanceToBottom = 0;
	const headerHeight = jdgSizes.nHeaderHeightLg;
	const headerPadding = jdgSizes.nHeaderTopBottomPadding * 2;
	const stripeHeight = includeStripes ? 3 * jdgSizes.nHorizontalStripeHeightLg : 0;
	distanceToBottom = headerHeight + headerPadding + stripeHeight;
	return distanceToBottom;
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

// get the full width of text, even if it's being truncated
export const getFullTextWidth = (element) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const style = window.getComputedStyle(element);
	context.font = `${style.fontSize} ${style.fontFamily}`;
	const metrics = context.measureText(element.textContent);
	return metrics.width;
};

///
/// TIMELINE
///

// The default action when a timeline event
// is set "active" for viewing or editing
export const setTimelineEventActive = (jdgTimelineEvent) => {
	showTimelineEventModal.set(true);
	draftTimelineEvent.set(jdgTimelineEvent);
};

// gets the earliest timeline event from an array of events
export const getEarliestTimelineEvent = (timelineEvents) => {
	if (!Array.isArray(timelineEvents) || timelineEvents.length === 0) return null;

	// Filter out invalid or empty dates
	const validEvents = timelineEvents.filter(
		(event) => event.date && !isNaN(Date.parse(event.date))
	);

	if (validEvents.length === 0) return null;

	// Find the event with the earliest date
	return validEvents.reduce((earliest, current) => {
		const earliestDate = new Date(earliest.date);
		const currentDate = new Date(current.date);
		return currentDate < earliestDate ? current : earliest;
	});
};

export const getClosestTimelineRowByDate = (inceptionDate, eventDate, totalRows) => {
	const closestRow = Math.ceil(getTimelineProportionByDate(inceptionDate, eventDate) * totalRows);
	return closestRow;
};

export const getTimelineProportionByDate = (
	inceptionDate,
	eventDate,
	cessationDate = undefined
) => {
	/*** HANDLE NO INCEPTION DATE CASES */
	// If both the eventDate and inceptionDate are unknown,
	// this must be the un-set inceptionDate, so
	// force the div to the top (0 proportion)
	if (eventDate === '' && inceptionDate === '') {
		return 0;
	}
	// If there is no inceptionDate,
	// this is probably the Today event, so put it at the bottom
	if (inceptionDate === '') {
		return 1;
	}

	const startDate = new Date(inceptionDate);
	// end date is the death date if deceased or today
	const endDate = cessationDate ? new Date(cessationDate) : new Date();

	// lifespan and event duration in milliseconds
	const lifespanMs = Math.abs(endDate.getTime() - startDate.getTime()) - 1;
	const eventDurationMs = Math.abs(new Date(eventDate).getTime() - startDate.getTime());

	// proportion is event duration divided by lifespan, in milliseconds
	let proportion = eventDurationMs / lifespanMs;

	return proportion;
};

// converts raw timeline events to timeline row items for UI
// row items include an index to properly sort based on chronology
export const generateTimelineRowItems = (timelineHost, contextualEvents, inceptionDate) => {
	// ensure timelineHost has all expected fields
	const upgradedTimelineHost = upgradeTimelineHost(timelineHost);

	let timelineEventRowItems = [];
	let timelineEventReferenceRowItems = [];
	let numberOfRows = Math.max(
		upgradedTimelineHost.timelineEvents.length +
			upgradedTimelineHost.timelineEventReferences.length,
		jdgQuantities.initialTimelineRowCount
	);

	// generate the regular events
	for (let i = 0; i < upgradedTimelineHost.timelineEvents.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(jdgTimelineRowItem);
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			inceptionDate,
			upgradedTimelineHost.timelineEvents[i].date,
			numberOfRows
		);
		thisRowItem.index = rowIndex;
		thisRowItem.event = upgradedTimelineHost.timelineEvents[i];
		if (!isNaN(rowIndex)) {
			timelineEventRowItems.push(thisRowItem);
		}
	}
	// generate the event references
	for (let i = 0; i < upgradedTimelineHost.timelineEventReferences.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(jdgTimelineRowItem);
		// get the event from the reference
		// use instantiateObject to ensure it's a copy
		const eventFromReference = instantiateObject(
			getTimelineEventById(
				upgradedTimelineHost.timelineEventReferences[i].personId,
				upgradedTimelineHost.timelineEventReferences[i].eventId
			)
		);
		// mark the event as a reference origin type
		eventFromReference.type = jdgTimelineEventTypes.reference;
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			inceptionDate,
			eventFromReference.eventDate,
			numberOfRows
		);
		thisRowItem.index = rowIndex;
		thisRowItem.event = eventFromReference;
		thisRowItem.eventReference = upgradedTimelineHost.timelineEventReferences[i];
		if (!isNaN(rowIndex)) {
			timelineEventReferenceRowItems.push(thisRowItem);
		}
	}
	// generate the contextual events
	for (let i = 0; i < contextualEvents?.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(jdgTimelineRowItem);
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			inceptionDate,
			contextualEvents[i].eventDate,
			numberOfRows
		);
		thisRowItem.index = rowIndex;
		thisRowItem.event = contextualEvents[i];
		thisRowItem.eventReference = upgradedTimelineHost.timelineEventReferences[i];
		if (!isNaN(rowIndex)) {
			timelineEventReferenceRowItems.push(thisRowItem);
		}
	}

	return [...timelineEventRowItems, ...timelineEventReferenceRowItems];
};

// sorts timeline event row items by date
// optionally assigns sequential row indices (for even distribution)
// or keeps proportional indices (for relative date-based spacing)
export const updateTimelineRowItems = (rowItems, useSequentialIndices = true) => {
	const sortedRowItems = rowItems.sort(
		(a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
	);
	// Reassign row indices sequentially after sorting if requested
	// Sequential indices ensure even visual distribution with align-content: space-between
	// Proportional indices (when useSequentialIndices=false) preserve date-relative spacing
	if (useSequentialIndices) {
		for (let i = 0; i < sortedRowItems.length; i++) {
			sortedRowItems[i].index = i + 1; // Start at 1 to leave room for inception event at 0
		}
	}
	return sortedRowItems;
};
