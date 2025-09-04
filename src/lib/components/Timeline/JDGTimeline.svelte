<script>
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { css } from '@emotion/css';

	import { getMaxElementHeightPx } from '$lib/jdg-utils.js';

	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';

	import { isTimelineEventInEditMode, timelineEditEvent } from '$lib/stores/jdg-temp.js';
	import { doShowTimelineEventDetailsModal } from '$lib/states/ui-state.js';

	import { jdgSchemaVersion } from '$lib/schemas/jdg-schema-versions.js';
	import { generateTimelineRowItems, updateTimelineRowItems } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { generateGradient } from '$lib/jdg-utils.js';

	import Checkbox from '$lib/components/JDGCheckbox.svelte';
	import ComposeToolbar from '$lib/components/Compose/JDGComposeToolbar.svelte';
	import TimelineEvent from '$lib/components/Timeline/JDGTimelineEvent.svelte';

	// timeline host contains events and event references
	export let timelineHost;
	// optionally include contextual events
	export let contextEvents = undefined;
	// the event used to determine age
	export let inceptionEvent = undefined;
	// if not provided, use today's date
	export let cessationEvent = undefined;

	let timelineWrapperRef;
	let timelineContainerRef;
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

	let canvasScrollState = { top: true, bottom: true };
	let firstEventHeight = 0;
	let lastEventHeight = 0;

	// dynamic classes using Emotion CSS
	let timelineEventGridCss;
	const timelineEventCountCss = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	const onClickAddEventButton = () => {
		// if the inception event is provided, but with no date
		// then clicking add event will set it
		// @ts-expect-error
		if (inceptionEvent && inceptionEvent?.eventDate === '') {
			timelineEditEvent.set(inceptionEvent);
			doShowTimelineEventDetailsModal.set(true);
			isTimelineEventInEditMode.set(true);
		}
		// otherwise, add an event like normal
		else {
			const newTimelineEvent = instantiateObject(jdgTimelineEvent);
			newTimelineEvent.id = uuidv4();
			newTimelineEvent.version = jdgSchemaVersion;
			newTimelineEvent.type = jdgTimelineEventTypes.generic.type;
			timelineEditEvent.set(newTimelineEvent);
			doShowTimelineEventDetailsModal.set(true);
			isTimelineEventInEditMode.set(true);
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
		const emptyRowHeightPx = 1;

		// set relative spacing to true if at least 5 events would appear
		const minEventsInView = 5;
		for (let i = 0; i < timelineRowItems.length; i++) {
			const rowItem = timelineRowItems[i];
			const rowYPosPx =
				rowItem.index * emptyRowHeightPx +
				(eventsInView.length + 1 * stylingConstants.sizes.nTimelineEventFilledRowHeight);
			if (rowYPosPx < timelineHeightPx) {
				eventsInView.push(rowItem.index);
			}
			if (eventsInView.length > minEventsInView) {
				forceRelativeSpacing = true;
				break;
			}
		}
	});

	// keep timeline row items updated
	$: {
		// convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(
			generateTimelineRowItems(
				timelineEvents,
				timelineEventReferences,
				contextEvents,
				inceptionEvent
			)
		);
	}

	$: {
		// generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			jdgTimelineHost?.timelineEvents?.length + 2 /* account for birth and death */,
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

	// timeline spine styling
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

	$: {
		lineCss = css`
			${lineCss}
			margin-top: ${$timelineCanvasScrollState.top ? $timelineFirstEventHeight / 2 + 'px' : 0};
			margin-bottom: ${$timelineCanvasScrollState.bottom ? $timelineLastEventHeight / 2 + 'px' : 0};
		`;
	}
</script>

<div bind:this={timelineWrapperRef} class="timeline-wrapper">
	<ComposeToolbar
		parentRef={timelineWrapperRef}
		composeButtonFaIcon={'fa-plus fa-fw'}
		composeButtonTooltip={'Add a new event'}
		onClickCompose={onClickAddEventButton}
		zIndex={1}
	/>
	<div bind:this={timelineContainerRef} class="timeline-container">
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
		</div>
		<div class="timeline-content-container">
			<div class="timeline-spine">
				<div class="timeline-spine-line-column {lineColumnCss}">
					<div class="timeline-spine-line {lineCss}" />
				</div>
			</div>
			<div class="timeline-scrolling-canvas" bind:this={scrollingCanvasDivRef}>
				<!-- the grid containing all timeline events -->
				<div class="timeline-event-grid {timelineEventGridCss}">
					<!-- show the inception event if provided -->
					{#if inceptionEvent}
						<TimelineEvent
							timelineEvent={inceptionEvent}
							rowIndex={0}
							backgroundColor={timelineEventColors[0]}
						/>
					{/if}
					<!-- all other timeline events saved to the person -->
					{#each timelineRowItems as timelineRowItem, i}
						<!-- ensure the UI reacts when these values change -->
						{#key `${$activePerson.id}-${timelineRowItem.event.eventId}-${$timelineEditEvent}`}
							<TimelineEvent
								timelineEvent={timelineRowItem.event}
								rowIndex={timelineRowItem.index}
								backgroundColor={timelineEventColors[i + 1]}
								eventReference={timelineRowItem.eventReference}
							/>
						{/key}
					{/each}
					<!-- show the cessation event if provided -->
					{#if cessationEvent}
						<TimelineEvent
							timelineEvent={cessationEvent}
							rowIndex={stylingConstants.quantities.initialTimelineRowCount}
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
		height: 100%;
	}

	.timeline-spine-line-column {
		display: flex;
	}
</style>
