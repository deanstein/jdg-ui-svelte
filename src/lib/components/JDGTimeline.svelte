<script>
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/jdg-timeline-event-types.js';
	import timelineEvent from '$lib/schemas/jdg-timeline-event.js';

	import uiState from '$lib/stores/ui-state';

	import { getMaxElementHeightPx } from 'jdg-ui-svelte/jdg-utils.js';

	import { schemaVersion } from '$lib/versions';
	import { generateTimelineRowItems, updateTimelineRowItems } from '$lib/ui-management';
	import { instantiateObject } from '$lib/utils';
	import { setTimelineEditEvent, setTimelineEditEventId } from '$lib/temp-management';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import TimelineEvent from '$lib/components/Timeline/Event/TimelineEvent.svelte';
	import { generateGradient } from '../graphics-factory';

	export let startEvent;
	export let mainEvents;
	export let endEvent;

	let scrollingCanvasDivRef;

	// if true, the timeline is spaced out
	// to show relative spacing between events
	let forceRelativeSpacing = false;
	// row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// timeline events will each have a slightly different color
	// along a gradient defined here
	let timelineEventColors = [];

	// dynamic classes using Emotion CSS

	let lineCss = css`
		width: ${stylingConstants.sizes.timelineSpineThickness};
		background: linear-gradient(
			to bottom,
			rgba(255, 0, 0, 0) 0%,
			${stylingConstants.colors.timelineSpineColor} 20px,
			${stylingConstants.colors.timelineSpineColor} calc(100% - 20px),
			rgba(255, 0, 0, 0) 100%
		);
	`;

	const lineColumnCss = css`
		margin-left: ${stylingConstants.sizes.nTimelineEventNodeSize / 2 +
		stylingConstants.sizes.nTimelineEventGapSize * 2 +
		stylingConstants.sizes.nTimelineEventYearWidth -
		stylingConstants.sizes.nTimelineSpineLineThickness / 2 +
		'vw'};
	`;

	let timelineEventGridCss;
	const timelineEventCountCss = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	// set up the birth event with its static fields
	// note that other fields are updated dynamically in a reactive block below
	const birthEvent = instantiateObject(timelineEvent);
	birthEvent.eventId = uuidv4();
	birthEvent.eventType = timelineEventTypes.birth.type;
	birthEvent.eventVersion = schemaVersion;
	// set up the death event with its static fields - if not deceased, this is today
	// note that other fields are updated dynamically in a reactive block below
	const deathEvent = instantiateObject(timelineEvent);
	deathEvent.eventId = uuidv4();
	deathEvent.eventVersion = schemaVersion;

	const onClickAddEventButton = () => {
		// birth date must be set first
		// before any normal timeline event is added
		if ($uiState.activePerson.birth.date === '') {
			setTimelineEditEvent(birthEvent);
			setTimelineEditEventId(birthEvent.eventId);
			// otherwise, add an event like normal
		} else {
			const newTimelineEvent = instantiateObject(timelineEvent);
			newTimelineEvent.eventId = uuidv4();
			newTimelineEvent.eventVersion = schemaVersion;
			newTimelineEvent.eventType = timelineEventTypes.generic.type;
			setTimelineEditEvent(newTimelineEvent);
			setTimelineEditEventId(newTimelineEvent.eventId);
		}
	};

	export const onCheckRelativeSpacing = () => {
		forceRelativeSpacing = true;
	};

	export const onUncheckRelativeSpacing = () => {
		forceRelativeSpacing = false;
	};

	let eventsInView = [];
	onMount(() => {
		// determine whether the spacing should default to relative
		const timelineHeightPx = getMaxElementHeightPx(scrollingCanvasDivRef);
		const emptyRowHeightPx = stylingConstants.sizes.nTimelineEventEmptyRowHeight;

		// set relative spacing to true if at least 5 events would appear
		const minEventsInView = 5;
		for (let i = 0; i < timelineRowItems.length; i++) {
			const rowItem = timelineRowItems[i];
			const rowYPosPx =
				rowItem.index * emptyRowHeightPx +
				(eventsInView.length + 1 * stylingConstants.sizes.nTimelineEventFilledRowHeight);
			if (rowYPosPx < timelineHeightPx) {
				eventsInView.push(rowItem.index);
				console.log('PUSHING', rowYPosPx, timelineHeightPx);
			}
			if (eventsInView.length > minEventsInView) {
				forceRelativeSpacing = true;
				break;
			}
		}
	});

	$: {
		// ensure birth event is kept updated
		birthEvent.eventDate = $uiState.activePerson.birth.date;
		birthEvent.eventContent.description = 'Born';
		// ensure death event is kept updated
		deathEvent.eventType =
			$uiState.activePerson.death.date !== ''
				? timelineEventTypes.death.type
				: timelineEventTypes.today.type;
		deathEvent.eventDate =
			$uiState.activePerson.death.date !== ''
				? $uiState.activePerson.death.date
				: new Date().toLocaleDateString();
		deathEvent.eventContent.description =
			$uiState.activePerson.death.date !== '' ? 'Deceased' : 'Today';

		// convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(generateTimelineRowItems($uiState.activePerson));

		// generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			$uiState?.activePerson?.timelineEvents?.length + 2 /* account for birth and death */,
			stylingConstants.colors.timelineEventBackgroundColorGradient1,
			stylingConstants.colors.timelineEventBackgroundColorGradient2,
			stylingConstants.colors.timelineEventBackgroundColorGradient3
		);

		// ensure custom css is kept updated
		timelineEventGridCss = css`
			row-gap: ${forceRelativeSpacing
				? stylingConstants.sizes.timelineEventEmptyRowHeight
				: 'auto'};
		`;
	}

	$: {
		lineCss = css`
			${lineCss}
			margin-top: ${$uiState.timelineCanvasScrollState.top
				? $uiState.timelineFirstEventHeight / 2 + 'px'
				: 0};
			margin-bottom: ${$uiState.timelineCanvasScrollState.bottom
				? $uiState.timelineLastEventHeight / 2 + 'px'
				: 0};
		`;
	}
</script>

<div class="timeline-container">
	<div class="timeline-actions-bar">
		<div class="timeline-event-count {timelineEventCountCss}">
			<!-- birth and death/today are always shown, so add 2 to the count -->
			Showing {timelineRowItems.length + 2} timeline events
		</div>
		<Checkbox
			isEnabled={true}
			showLabel={true}
			label="Relative Spacing"
			isChecked={forceRelativeSpacing}
			onCheckAction={onCheckRelativeSpacing}
			onUncheckAction={onUncheckRelativeSpacing}
		/>
		<Button buttonText="Add Event" onClickFunction={onClickAddEventButton} />
	</div>
	<div class="timeline-content-container">
		<!-- vertical line/spine of the timeline -->
		<div class="timeline-spine">
			<div class="timeline-spine-line-column {lineColumnCss}">
				<div class="timeline-spine-line {lineCss}" />
			</div>
		</div>
		<div class="timeline-scrolling-canvas" bind:this={scrollingCanvasDivRef}>
			<!-- the grid containing all timeline events -->
			<div class="timeline-event-grid {timelineEventGridCss}">
				<!-- always present and always at the top: birth -->
				<TimelineEvent
					timelineEvent={birthEvent}
					rowIndex={0}
					backgroundColor={timelineEventColors[0]}
				/>

				<!-- all other timeline events saved to the person -->
				{#each timelineRowItems as timelineRowItem, i}
					<TimelineEvent
						timelineEvent={timelineRowItem.event}
						rowIndex={timelineRowItem.index}
						backgroundColor={timelineEventColors[i + 1]}
					/>
				{/each}

				<!-- always present: current date or date of death -->
				<TimelineEvent
					timelineEvent={deathEvent}
					rowIndex={stylingConstants.quantities.initialTimelineRowCount}
					backgroundColor={timelineEventColors[timelineEventColors.length - 1]}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1vh;
	}

	.timeline-actions-bar {
		display: flex;
		justify-content: right;
		column-gap: 1vh;
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
		height: 100%;
	}

	.timeline-spine-line-column {
		display: flex;
	}
</style>
