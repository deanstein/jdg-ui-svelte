<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { css } from '@emotion/css';

	import { getMaxElementHeightPx } from '$lib/jdg-utils.js';

	import { jdgTimelineEventKeys } from '$lib/schemas/timeline/jdg-timeline-event-types.js';


	import { generateTimelineRowItems, updateTimelineRowItems } from '$lib/jdg-ui-management.js';

	import { generateGradient } from '$lib/jdg-utils.js';

	import Checkbox from '$lib/components/Input/JDGCheckbox.svelte';
	import ComposeToolbar from '$lib/components/Compose/JDGComposeToolbar.svelte';
	import JDGTimelineEvent from '$lib/components/Timeline/JDGTimelineEvent.svelte';
	import { jdgQuantities, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { JDG_CONTEXT_KEYS } from '$lib/stores/jdg-context-keys.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';

	// Timeline host contains events and event references
	export let timelineHost;
	// Optionally include contextual events
	export let contextEvents = timelineHost.contextualEvents;
	// Whether the add event button is shown
	export let allowEditing = true;
	// Width and height for timeline interface
	export let width = '100%';
	export let minHeight = '50svh';

	export let onClickInceptionEvent = () => {};
	export let onClickTimelineEvent = () => {};
	export let onClickEventRefHost = () => {};
	export let onClickAssociatedHost = () => {};
	export let addClickAddEvent = () => {};
	export let getTimelineHostById = () => {};

	const rowHeightEmptyPx = 1;
	const rowHeightFilledPx = 80;

	// set up the inception and cessation events
	let emptyStateEvent;
	let todayEvent;

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
		// If there are no timeline events, show an inception event
		// that creates an initial event when clicked
		if (timelineHost.timelineEvents.length === 0) {
			emptyStateEvent = instantiateTimelineEvent(jdgTimelineEventKeys.inception);
			emptyStateEvent.date = timelineHost.inceptionDate;
		}
		// If there's no cessation date, show a Today event
		if (!timelineHost.cessationDate) {
			todayEvent = instantiateTimelineEvent(jdgTimelineEventKeys.today);
			todayEvent.type = jdgTimelineEventKeys.today;
		}

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

	const timelineWrapperCss = css`
		width: ${width};
		min-height: ${minHeight};
	`;

	const timelineEventCountCss = css`
		font-size: ${jdgSizes.fontSizeBodySm};
		margin-left: ${jdgSizes.timelineEventGapSize};
	`;

	// Timeline spine styling
	let spineContainerCss = css`
		margin-left: ${jdgSizes.nTimelineEventNodeSize / 2 +
		jdgSizes.nTimelineEventGapSize * 2 +
		jdgSizes.nTimelineEventYearWidth -
		jdgSizes.nTimelineSpineWidth / 2 +
		jdgSizes.timelineUnit};
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

	// If there are no events, force add
	// an inception and today event to contextual events
	$: {
		if (timelineHost?.timelineEvents.length === 0) {
		}
	}

	// Keep timeline event grid updated
	let timelineEventGridCss;
	$: {
		// Ensure custom css is kept updated
		timelineEventGridCss = css`
			row-gap: ${forceRelativeSpacing ? rowHeightEmptyPx : 'auto'};
		`;
	}

	// Keep timeline row items updated
	$: {
		// Convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(
			generateTimelineRowItems(timelineHost, contextEvents, timelineHost.inceptionDate)
		);
	}

	$: {
		// Generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			timelineHost?.timelineEvents?.length + 2 /* account for birth and death */,
			timelineEventColorGradient1,
			timelineEventColorGradient2,
			timelineEventColorGradient3
		);
	}
</script>

<div bind:this={timelineWrapperRef} class="timeline-wrapper {timelineWrapperCss}">
	{#if allowEditing}
		<ComposeToolbar
			parentRef={timelineWrapperRef}
			composeButtonFaIcon={'fa-plus fa-fw'}
			composeButtonTooltip={'Add a new event'}
			onClickCompose={addClickAddEvent}
			zIndex={1}
		/>
	{/if}
	<div bind:this={timelineContainerRef} class="timeline-container">
		<div class="timeline-actions-bar">
			<div class="timeline-event-count {timelineEventCountCss}">
				Showing {timelineRowItems.length + (emptyStateEvent ? 1 : 0) + (todayEvent ? 1 : 0)} timeline
				events
			</div>
			<Checkbox
				isEnabled={true}
				showLabel={true}
				label="Relative Spacing"
				isChecked={forceRelativeSpacing}
				onCheckAction={onCheckRelativeSpacing}
				onUncheckAction={onUncheckRelativeSpacing}
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
							timelineEvent={emptyStateEvent}
							onClickTimelineEvent={allowEditing ? onClickInceptionEvent : () => {}}
							isInteractive={allowEditing ? true : false}
							rowIndex={0}
							backgroundColor={timelineEventColors[0]}
							{getTimelineHostById}
						/>
					{/if}
					<!-- All timeline events saved to the host -->
					{#each timelineRowItems as timelineRowItem, i}
						<!-- Use a key to ensure the UI reacts when these values change -->
						{#key `${timelineHost.id}-${timelineRowItem.event.eventId}`}
							<JDGTimelineEvent
								timelineEvent={timelineRowItem.event}
								onClickAssociatedHost={() => {
									//timelineRowItem.event.associatedHostIds[0]
								}}
								rowIndex={timelineRowItem.index}
								backgroundColor={timelineEventColors[i + 1]}
								eventReference={timelineRowItem.eventReference}
								{getTimelineHostById}
							/>
						{/key}
					{/each}
					<!-- Show the today event if no cessation date -->
					{#if todayEvent}
						<JDGTimelineEvent
							timelineEvent={todayEvent}
							rowIndex={jdgQuantities.initialTimelineRowCount}
							backgroundColor={timelineEventColors[timelineEventColors.length - 1]}
							{getTimelineHostById}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-wrapper {
		position: relative;
		display: flex;
		flex-grow: 1;
		height: -webkit-fill-available;
		width: -moz-available;
		background-color: gainsboro;
		padding: 1rem;
		border-radius: 10px;
	}

	.timeline-container {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1rem;
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
