import { get } from 'svelte/store';

import {
	doShowAdminLoginModal,
	doShowTimelineEventDetailsModal,
	isAdminMode,
	postAdminLoginFunction
} from './stores/jdg-ui-store.js';
import { timelineEventDraft } from './stores/jdg-temp-store.js';

import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
import jdgTimelineEventTypes, {
	jdgTimelineEventKeys
} from './schemas/timeline/jdg-timeline-event-types.js';
import jdgTimelineRowItem from '$lib/schemas/timeline/jdg-timeline-row-item.js';

import { instantiateObject } from '$lib/jdg-utils.js';

import { jdgBreakpoints, jdgQuantities, jdgSizes } from '$lib/jdg-shared-styles.js';
import { getTimelineEventById, instantiateTimelineEvent } from './jdg-timeline-management.js';

//
// ADMIN MODE
//

// wrapper for functions that require
// adminMode to be checked or authenticated first
export const requireAdminMode = (fn) => {
	if (get(isAdminMode)) {
		fn();
	} else {
		doShowAdminLoginModal.set(true);
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
	doShowTimelineEventDetailsModal.set(true);
	timelineEventDraft.set(jdgTimelineEvent);
};

// gets the earliest timeline event from an array of events
export const getEarliestTimelineEvent = (timelineEvents) => {
	if (!Array.isArray(timelineEvents) || timelineEvents.length === 0) return null;

	// Filter out invalid or empty dates
	const validEvents = timelineEvents.filter(
		(event) => event.eventDate && !isNaN(Date.parse(event.eventDate))
	);

	if (validEvents.length === 0) return null;

	// Find the event with the earliest date
	return validEvents.reduce((earliest, current) => {
		const earliestDate = new Date(earliest.eventDate);
		const currentDate = new Date(current.eventDate);
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
export const generateTimelineRowItems = (
	timelineHost,
	contextualEvents,
	inceptionEvent = undefined
) => {
	// ensure timelineHost has all expected fields
	const upgradedTimelineHost = instantiateObject(jdgTimelineHost, timelineHost);

	let timelineEventRowItems = [];
	let timelineEventReferenceRowItems = [];
	let numberOfRows = Math.max(
		upgradedTimelineHost.timelineEvents.length +
			upgradedTimelineHost.timelineEventReferences.length,
		jdgQuantities.initialTimelineRowCount
	);

	// if no inception event is provided, use the earliest event
	if (!inceptionEvent) {
		inceptionEvent = getEarliestTimelineEvent(upgradedTimelineHost.timelineEvents);
		// if there's still no inception event, generate one
		if (!inceptionEvent) {
			inceptionEvent = instantiateTimelineEvent(jdgTimelineEventKeys.generic);
		}
	}

	// generate the regular events
	for (let i = 0; i < upgradedTimelineHost.timelineEvents.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(jdgTimelineRowItem);
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			inceptionEvent.date,
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
			inceptionEvent.eventDate,
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
	for (let i = 0; i < contextualEvents.length; i++) {
		// create a new timeline row item
		let thisRowItem = instantiateObject(jdgTimelineRowItem);
		// get the index this item belongs to
		const rowIndex = getClosestTimelineRowByDate(
			inceptionEvent.eventDate,
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
// and ensurs any conflicting row indices are resolved
export const updateTimelineRowItems = (rowItems) => {
	const sortedRowItems = rowItems.sort(
		(a, b) => new Date(a.event.eventDate).getTime() - new Date(b.event.eventDate).getTime()
	);
	let indices = sortedRowItems.map((rowItem) => rowItem.index);
	let duplicates = indices.filter((item, index) => indices.indexOf(item) != index);
	while (duplicates.length > 0) {
		let conflictingRowItems = sortedRowItems.filter((obj) => obj.index === duplicates[0]);
		for (let i = 1; i < conflictingRowItems.length; i++) {
			conflictingRowItems[i].index++;
		}
		indices = sortedRowItems.map((rowItem) => rowItem.index);
		duplicates = indices.filter((item, index) => indices.indexOf(item) != index);
	}
	return sortedRowItems;
};
