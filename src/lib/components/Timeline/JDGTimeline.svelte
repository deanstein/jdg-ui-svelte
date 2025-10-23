<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { css } from '@emotion/css';

	import { JDG_CONTEXT_KEYS } from '$lib/stores/jdg-context-keys.js';
	import { getMaxElementHeightPx, getNumDaysBetweenDates, lightenColor } from '$lib/jdg-utils.js';

	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';
	import {
		doShowImageMetaModal,
		doShowTimelineEventModal,
		isAdminMode,
		isTimelineEventModalEditable
	} from '$lib/stores/jdg-ui-store.js';

	import { jdgTimelineEventKeys } from '$lib/schemas/timeline/jdg-timeline-event-types.js';

	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import {
		generateTimelineRowItems,
		getEarliestTimelineEvent,
		updateTimelineRowItems
	} from '$lib/jdg-ui-management.js';

	import { generateGradient } from '$lib/jdg-utils.js';

	import { JDGCheckbox, JDGComposeToolbar, JDGImage, JDGTimelineEvent } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgQuantities, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { imageMetaCollection } from '../../../routes/image-meta-collection.js';

	// Timeline host contains events and event references
	export let timelineHost;
	// Optionally include contextual events
	export let contextEvents = timelineHost.contextualEvents;
	// Whether to show the name of the timeline host at the top
	export let showTitleBar = true;
	// Whether the ComposeToolbar is shown
	export let allowEditing = true;
	// If true, users can click TimelineEvents to see more detail
	export let isInteractive = true;
	// Width and height for timeline interface
	export let width = '100%';
	export let minHeight = '50svh';
	export let maxHeight = '50svh';

	export let onClickInceptionEvent = () => {};
	export let addClickAddEvent = () => {};

	/*** Eventually needed, but not developed yet ***/
	// export let onClickEventRefHost = () => {};
	// export let onClickAssociatedHost = () => {};

	const rowHeightEmptyPx = 1;
	const rowHeightFilledPx = 80;

	const timelineBackgroundColor = 'rgba(225, 225, 225, 1)';

	// set up the inception and cessation events
	let emptyStateEvent;
	let todayEvent;

	const avatarHeight = '30px';

	// these three colors define the gradient
	// that all timeline events will occupy from start to end
	const timelineEventColorGradient1 = 'rgba(227, 244, 223, 1)';
	const timelineEventColorGradient2 = 'rgba(208, 240, 242, 1)';
	const timelineEventColorGradient3 = 'rgba(218, 228, 248, 1)';

	let timelineWrapperRef;
	let timelineContainerRef;
	let scrollingCanvasDivRef;

	// If true, the timeline is spaced out
	// to show relative spacing between events
	let forceRelativeSpacing = false;
	// Row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// Timeline events will each have a slightly different color
	// along a gradient defined here
	let timelineEventColors = [];

	// The spine changes its margin
	// depending on whether the canvas is scrolled to the top or bottom
	let canvasScrollState = { top: true, bottom: true };

	// Make a local store for values
	// that should be shared with TimelineEvents
	const firstEventRowHeightStore = writable(0);
	setContext(JDG_CONTEXT_KEYS.timelineFirstRowHeight, firstEventRowHeightStore);
	const lastEventRowHeightStore = writable(0);
	setContext(JDG_CONTEXT_KEYS.timelineLastRowHeight, lastEventRowHeightStore);

	const onCheckRelativeSpacing = () => {
		forceRelativeSpacing = true;
	};

	const onUncheckRelativeSpacing = () => {
		forceRelativeSpacing = false;
	};

	let eventsInView = [];
	onMount(() => {
		// Determine whether the spacing should default to relative
		const timelineHeightPx = getMaxElementHeightPx(scrollingCanvasDivRef);
		const emptyRowHeightPx = 1;

		// set relative spacing to true if at least 5 events would appear
		const minEventsInView = 5;
		for (let i = 0; i < timelineRowItems.length; i++) {
			const rowItem = timelineRowItems[i];
			const rowYPosPx =
				rowItem.index * emptyRowHeightPx + (eventsInView.length + 1 * rowHeightFilledPx);
			if (rowYPosPx < timelineHeightPx) {
				eventsInView.push(rowItem.index);
			}
			if (eventsInView.length > minEventsInView) {
				forceRelativeSpacing = true;
				break;
			}
		}
	});

	// DYNAMIC STYLES

	const timelineContainerCss = css`
		width: ${width};
		min-height: ${minHeight};
		max-height: ${maxHeight};
		background-color: ${timelineBackgroundColor};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
	`;

	const timelineTitleBarCss = css`
		background-color: ${lightenColor(timelineBackgroundColor, 0.03)};
	`;

	const timelineAvatarCss = css`
		height: ${avatarHeight};
		border: 2px solid transparent;
		:hover {
			border: 2px solid ${jdgColors.accentColorsJDG[1]};
		}
	`;

	const timelineEventCountCss = css`
		margin-left: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
	`;

	// font sizing for number of events, timeline options
	const timelineSupportingTextCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyXSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodySm};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodySm};
		}
	`;

	// Timeline spine styling
	let spineContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 4 +
			jdgSizes.ntimelineEventYearWidthSm +
			jdgSizes.nTimelineSpineWidth +
			jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 4 +
			jdgSizes.ntimelineEventYearWidthMd +
			jdgSizes.nTimelineSpineWidth +
			jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 2 +
			jdgSizes.ntimelineEventYearWidthLg +
			jdgSizes.nTimelineSpineWidth * 2 +
			jdgSizes.timelineUnit};
		}
	`;
	$: {
		spineContainerCss = css`
			${spineContainerCss}
			margin-top: ${canvasScrollState.top ? $firstEventRowHeightStore / 2 + 'px' : 0};
			margin-bottom: ${canvasScrollState.bottom ? $lastEventRowHeightStore / 2 + 'px' : 0};
		`;
	}

	let spineColumnCss = css`
		width: ${jdgSizes.timelineSpineWidth};
	`;

	// Keep timeline event grid updated
	let timelineEventGridCss;
	$: {
		// Ensure custom css is kept updated
		timelineEventGridCss = css`
			row-gap: ${forceRelativeSpacing ? rowHeightEmptyPx + 'px' : '0'};
		`;
	}

	// Keep emptyState and today events updated
	$: {
		// If there is no inception date, use the earliest date
		const earliestEvent = getEarliestTimelineEvent(timelineHost.timelineEvents);
		let earliestOrInceptionDate =
			timelineHost?.inceptionDate === undefined || timelineHost.inceptionDate !== ''
				? timelineHost.inceptionDate
				: earliestEvent?.date;

		// If there are no timeline events,
		// or if there's no event on the inception date,
		// show an inception event
		if (
			timelineHost.timelineEvents.length === 0 ||
			getNumDaysBetweenDates(timelineHost.inceptionDate, earliestEvent.date) > 0
		) {
			emptyStateEvent = instantiateTimelineEvent(jdgTimelineEventKeys.inception);
			emptyStateEvent.date = timelineHost.inceptionDate;
		} else {
			emptyStateEvent = undefined;
		}

		// If there's no cessation date, show a Today event
		if (timelineHost?.cessationDate === '' || !timelineHost?.cessationDate) {
			todayEvent = instantiateTimelineEvent(jdgTimelineEventKeys.today);
			todayEvent.type = jdgTimelineEventKeys.today;
		} else {
			todayEvent = undefined;
		}

		// Convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(
			generateTimelineRowItems(timelineHost, contextEvents, earliestOrInceptionDate)
		);
	}

	// Keep timeline row items updated
	$: {
	}

	$: {
		// Generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			timelineHost?.timelineEvents?.length +
				(emptyStateEvent ? 1 : 0) +
				(todayEvent ? 2 : 0) /* account for birth and death */,
			timelineEventColorGradient1,
			timelineEventColorGradient2,
			timelineEventColorGradient3
		);
	}
</script>

<div bind:this={timelineWrapperRef} class="timeline-wrapper">
	{#if showTitleBar}
		<div class="timeline-title-bar {timelineTitleBarCss}">
			<div
				class="timeline-avatar {timelineAvatarCss}"
				role="button"
				tabindex="0"
				on:click={() => {
					doShowImageMetaModal.set(true);
				}}
				on:keydown={() => {
					doShowImageMetaModal.set(true);
				}}
			>
				<JDGImage
					imageMeta={imageMetaCollection.aerial_60s70s_1}
					maxHeight={avatarHeight}
					maxWidth={avatarHeight}
					cropToFillContainer={true}
				/>
			</div>
			<div class="timeline-title">
				{timelineHost.name}
			</div>
		</div>
	{/if}
	<div bind:this={timelineContainerRef} class="timeline-container {timelineContainerCss}">
		{#if allowEditing}
			<JDGComposeToolbar
				parentRef={timelineWrapperRef}
				composeButtonFaIcon={'fa-plus fa-fw'}
				composeButtonTooltip={'Add a new event'}
				onClickCompose={addClickAddEvent}
				zIndex={1}
			/>
		{/if}
		<div class="timeline-actions-bar {timelineSupportingTextCss}">
			<div class="timeline-event-count {timelineEventCountCss}">
				Showing {timelineRowItems.length + (emptyStateEvent ? 1 : 0) + (todayEvent ? 1 : 0)} timeline
				events
			</div>
			<JDGCheckbox
				isEnabled={true}
				showLabel={true}
				label="Relative spacing"
				isChecked={forceRelativeSpacing}
				onCheckAction={onCheckRelativeSpacing}
				onUncheckAction={onUncheckRelativeSpacing}
				labelFontSize={''}
			/>
		</div>
		<div class="timeline-content-container">
			<div class="timeline-spine {spineContainerCss}">
				<div class="timeline-spine-line-column {spineColumnCss}">
					<div class="timeline-spine-line" />
				</div>
			</div>
			<div class="timeline-scrolling-canvas" bind:this={scrollingCanvasDivRef}>
				<!-- The grid containing all timeline events -->
				<div class="timeline-event-grid {timelineEventGridCss}">
					<!-- If there are no events, make an empty state event at the top -->
					{#if emptyStateEvent}
						<JDGTimelineEvent
							{timelineHost}
							timelineEvent={emptyStateEvent}
							onClickTimelineEvent={isInteractive && allowEditing
								? onClickInceptionEvent
								: () => {}}
							isInteractive={(isInteractive && allowEditing) || $isAdminMode ? true : false}
							rowIndex={0}
							backgroundColor={timelineEventColors[0]}
						/>
					{/if}
					<!-- All timeline events saved to the host -->
					{#each timelineRowItems as timelineRowItem, i}
						<!-- Use a key to ensure the UI reacts when these values change -->
						{#key `${timelineHost.id}-${timelineRowItem.event.eventId}`}
							<JDGTimelineEvent
								{timelineHost}
								timelineEvent={timelineRowItem.event}
								onClickTimelineEvent={() => {
									timelineEventDraft.set(timelineRowItem.event);
									doShowTimelineEventModal.set(true);
									isTimelineEventModalEditable.set(allowEditing);
								}}
								rowIndex={timelineRowItem.index}
								backgroundColor={timelineEventColors[i]}
								eventReference={timelineRowItem.eventReference}
								isInteractive={isInteractive || $isAdminMode}
							/>
						{/key}
					{/each}
					<!-- Show the today event if there's no cessation date provided -->
					{#if timelineHost.cessationDate === '' || (!timelineHost?.cessationDate && todayEvent)}
						<JDGTimelineEvent
							{timelineHost}
							timelineEvent={todayEvent}
							rowIndex={jdgQuantities.initialTimelineRowCount + 1}
							backgroundColor={timelineEventColors[timelineEventColors.length - 1]}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-wrapper {
		height: -webkit-fill-available;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.timeline-title-bar {
		padding: 10px 10px 20px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px 10px 0 0;
		margin-bottom: -10px;
		gap: 10px;
	}

	.timeline-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 50%;
		cursor: pointer;
	}

	.timeline-container {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1rem;
		box-sizing: border-box;
		border-radius: 10px;
	}

	.timeline-actions-bar {
		display: flex;
		justify-content: right;
		column-gap: 1svh;
	}

	.timeline-event-count {
		display: flex;
		flex-grow: 1;
		align-items: center;
	}

	.timeline-content-container {
		position: relative;
		display: flex;
		height: -webkit-fill-available;
		flex-grow: 1;
		overflow: hidden;
	}

	.timeline-scrolling-canvas {
		position: relative;
		height: -webkit-fill-available;
		width: -webkit-fill-available;
		width: -moz-available;
		display: flex;
		overflow: auto;
	}

	.timeline-event-grid {
		display: grid;
		grid-template-columns: 1fr;
		flex-grow: 1;
	}

	.timeline-spine {
		position: absolute;
		display: flex;
		height: inherit;
		background: linear-gradient(
			to bottom,
			rgba(255, 0, 0, 0) 0%,
			rgba(200, 200, 200, 0.75) 20px,
			rgba(200, 200, 200, 0.7) calc(100% - 20px),
			rgba(255, 0, 0, 0) 100%
		);
	}

	.timeline-spine-line-column {
		display: flex;
	}
</style>
