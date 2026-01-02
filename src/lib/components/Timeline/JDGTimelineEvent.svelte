<script>
	import { getContext } from 'svelte';
	import { css } from '@emotion/css';

	import { JDG_CONTEXTS } from '$lib/jdg-contexts.js';

	import timelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import timelineEventReference from '$lib/schemas/timeline/jdg-timeline-event-reference.js';

	import { ageSuffix, isMobileBreakpoint, isTabletBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import {
		getNumYearsBetweenDates,
		instantiateObject,
		resolveImageMetaKeys
	} from '$lib/jdg-utils.js';
	import { upgradeTimelineEvent } from '$lib/jdg-timeline-management.js';

	import { JDGButton, JDGImageThumbnailGroup } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let timelineHost;
	export let timelineEvent;
	// If true, this event is a reference to someone else's actual event
	// so it will display and interact differently
	export let eventReference = instantiateObject(timelineEventReference);
	// Is this event interactive?
	export let isInteractive = true;
	// When clicking on the event - default is to set it active
	export let onClickTimelineEvent = (timelineEventId) => {};
	// When clicking on an event reference host
	export let onClickEventRefHost = (timelineHostId) => {};
	// when clicking on an associated host
	export let onClickAssociatedHost = (timelineHostId) => {};

	export let backgroundColor = jdgColors.activeColorSubtle;
	export let rowIndex;

	// canClick may need to be overridden
	let canClickCalculated;
	$: {
		isInteractive;
		upgradedEvent;
		canClickCalculated = canClickOnTimelineEvent();
	}

	let upgradedEvent;
	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const eventBorderRadius = '10px';
	const dateBorderRadius = '5px';

	const monthNames = [
		'JAN',
		'FEB',
		'MAR',
		'APR',
		'MAY',
		'JUN',
		'JUL',
		'AUG',
		'SEP',
		'OCT',
		'NOV',
		'DEC'
	];

	const canClickOnTimelineEvent = () => {
		// If the prop is set to false, don't click
		if (!isInteractive) {
			return false;
		}
		// Otherwise, we still don't want to do anything on click in some cases
		if (upgradedEvent) {
			return (
				upgradedEvent.type !== jdgTimelineEventKeys.context &&
				upgradedEvent.type !== jdgTimelineEventKeys.reference &&
				upgradedEvent.type !== jdgTimelineEventKeys.today
			);
		}
	};

	const eventRowCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
			gap: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
			gap: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
	`;

	const eventDateYearCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			> :nth-child(1) {
				margin-right: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
			}
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			> :nth-child(1) {
				margin-right: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
			}
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			> :nth-child(1) {
				margin-right: ${jdgSizes.timelineEventGapSize};
			}
		}
	`;

	const eventDateCss = css`
		color: ${jdgColors.text};
		background-color: ${jdgColors.activeSubtle};
		border-radius: ${dateBorderRadius} ${dateBorderRadius} 0 0;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.6rem;
			width: ${jdgSizes.timelineEventYearWidthSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 0.7rem;
			width: ${jdgSizes.timelineEventYearWidthMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 0.9rem;
			width: ${jdgSizes.timelineEventYearWidthLg};
		}
	`;

	const eventYearCss = css`
		color: ${jdgColors.text};
		background-color: ${jdgColors.activeSubtle};
		border-radius: 0 0 ${dateBorderRadius} ${dateBorderRadius};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.9rem;
			width: ${jdgSizes.timelineEventYearWidthSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 1.1rem;
			width: ${jdgSizes.timelineEventYearWidthMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 1.5rem;
			width: ${jdgSizes.timelineEventYearWidthLg};
		}
	`;

	const eventDescriptionCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.7rem;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 0.8rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 0.9rem;
		}
	`;

	const eventNodeCss = css`
		height: ${jdgSizes.timelineEventNodeSize};
		background-color: ${jdgColors.textLight};
		/* Center node on spine: offset by half the difference between node and spine width */
		margin-left: ${-((jdgSizes.nTimelineEventNodeSize - jdgSizes.nTimelineSpineWidth) / 2) +
		jdgSizes.timelineUnit};
	`;

	const eventLineCss = css`
		height: ${jdgSizes.nTimelineEventNodeSize / 3 + jdgSizes.timelineUnit};
		background-color: ${jdgColors.textLight};
	`;

	const eventTitleBarCss = css`
		background-color: rgb(205, 205, 205);
		border-radius: ${eventBorderRadius} ${eventBorderRadius} 0px 0px;
	`;

	const eventFaIconCss = css`
		color: ${jdgColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.8rem;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 0.9rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 1rem;
		}
	`;

	const eventAgeCss = css`
		color: ${jdgColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.7rem;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 0.8rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 0.9rem;
		}
	`;

	const eventContentCss = css`
		background-color: ${backgroundColor};
		border-radius: 0px 0px ${eventBorderRadius} ${eventBorderRadius};
	`;

	const firstRowContext = getContext(JDG_CONTEXTS.TIMELINE_FIRST_ROW_HEIGHT);
	const lastRowContext = getContext(JDG_CONTEXTS.TIMELINE_LAST_ROW_HEIGHT);

	// Get the timeline's image registry from context (set by parent JDGTimeline)
	const timelineImageRegistryStore = getContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY);
	$: imageMetaRegistry = $timelineImageRegistryStore;

	$: {
		// Ensure the event is upgraded and updated if the input changes
		upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// Update the age of the event
		if (upgradedEvent) {
			eventDateCorrected = new Date(upgradedEvent.date);

			eventAge = getNumYearsBetweenDates(timelineHost.inceptionDate, eventDateCorrected);
		}
	}

	// For approximate dates with month=01 and day=01, hide the date div entirely
	$: hideDateDiv =
		upgradedEvent?.isApprxDate &&
		eventDateCorrected?.getUTCMonth() === 0 &&
		eventDateCorrected?.getUTCDate() === 1;

	// Update row heights
	$: {
		if (upgradedEvent) {
			// birth and death events report their row height for the spine to align to
			if (
				(upgradedEvent.type === timelineEventTypes.birth.type ||
					upgradedEvent.type === timelineEventTypes.birth.type) &&
				eventRowDivRef
			) {
				const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
				firstRowContext.set(eventRowHeight);
			}
			if (
				(upgradedEvent.type === timelineEventTypes.death.type ||
					upgradedEvent.type === timelineEventTypes.death) &&
				eventRowDivRef
			) {
				const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
				lastRowContext.set(eventRowHeight);
			}
		}
	}

	// Dynamic CSS
	let eventRowContainerCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowContainerCss = css`
				cursor: ${canClickCalculated ? 'pointer' : 'default'};
			`;
		}
	}

	let eventRowDynamicCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowDynamicCss = css`
				grid-row: ${rowIndex};
				cursor: ${canClickCalculated ? 'pointer' : 'default'};
				@media (hover: hover) {
					&:hover {
						background-color: ${canClickCalculated ? 'rgba(255, 255, 255, 0.75)' : ''};
					}
				}
			`;
		}
	}
</script>

<div
	class="timeline-event-row {eventRowCss} {eventRowDynamicCss}"
	role="button"
	tabindex="0"
	on:click={onClickTimelineEvent}
	on:keydown={onClickTimelineEvent}
	bind:this={eventRowDivRef}
>
	<div class="timeline-event-date-year-container {eventDateYearCss}">
		<!-- For approximate dates: hide day if day=01, hide month+day if month=01 -->
		{#if !hideDateDiv}
			<div class="timeline-event-date {eventDateCss}">
				<!-- Show month name with three letters like AUG -->
				{#if eventDateCorrected?.toString() !== 'Invalid Date'}
					{#if upgradedEvent?.isApprxDate && eventDateCorrected?.getUTCDate() === 1}
						<!-- Approximate date with day=01: show only month -->
						{monthNames[eventDateCorrected?.getUTCMonth()]}
					{:else}
						<!-- Full date: show month and day -->
						{monthNames[eventDateCorrected?.getUTCMonth()] + ' ' + eventDateCorrected?.getUTCDate()}
					{/if}
				{:else}
					Date?
				{/if}
			</div>
		{/if}
		<div
			class="timeline-event-year {eventYearCss}"
			style:border-radius={hideDateDiv ? dateBorderRadius : null}
		>
			{eventDateCorrected?.toString() !== 'Invalid Date'
				? eventDateCorrected?.getUTCFullYear()
				: 'Year?'}
		</div>
		{#if upgradedEvent?.isApprxDate}
			<div class="timeline-event-date-apprx">(apprx.)</div>
		{/if}
	</div>
	<div class="timeline-event-node {eventNodeCss}" />
	<!-- Only show the line on desktop -->
	{#if !$isMobileBreakpoint && !$isTabletBreakpoint}
		<div class="timeline-event-line {eventLineCss}" />
	{/if}
	<div class="timeline-event-content-outer-container {eventRowContainerCss}">
		<div class="timeline-event-title-bar {eventTitleBarCss}">
			<!-- event icon -->
			<i
				class="fa-solid {timelineEventTypes[upgradedEvent?.type]?.icon} {eventFaIconCss}"
				title="{timelineEventTypes[upgradedEvent?.type]?.label ?? upgradedEvent?.type} event"
			/>
			<!-- hide age if this is the birth event or if age is 0 or negative -->
			{#if upgradedEvent?.type !== timelineEventTypes.birth.type && eventAge > 0}
				<div class="timeline-event-age {eventAgeCss}">
					{eventAge} {eventAge === 1 ? 'year' : 'years'} {$ageSuffix}
				</div>
			{/if}
			<!-- if this is a reference event, show the timeline host it's shared from -->
			{#if upgradedEvent?.type === timelineEventTypes.reference}
				<div>
					<div class="timeline-event-reference-info">
						<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
						<JDGButton
							onClickFunction={() => {
								onClickEventRefHost();
							}}
							faIcon={'fa-circle-arrow-right'}
							backgroundColor={jdgColors.activeSubtle}
							paddingLeftRight="8px"
							paddingTopBottom="2px"
							fontSize="12px"
							gap="6px"
							label={eventReference?.name}
							tooltip={'Go to ' + eventReference?.name}
						/>
					</div>
				</div>
			{/if}
			<!-- if this event has associated people, show the first -->
			{#if upgradedEvent?.associatedPeopleIds?.length > 0 && upgradedEvent?.type !== timelineEventTypes.reference}
				<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event with &nbsp; </i>
				<JDGButton
					onClickFunction={() => {
						onClickAssociatedHost(upgradedEvent.associatedPeopleIds[0]);
					}}
					faIcon={'fa-circle-arrow-right'}
					backgroundColor={jdgColors.active}
					paddingLeftRight="8px"
					paddingTopBottom="2px"
					fontSize="12px"
					gap="6px"
					label={timelineHost.name}
					tooltip={'Go to ' + timelineHost.name}
				/>
				<!-- if more than one, show a label -->
				{#if upgradedEvent?.additionalContent?.associatedPeopleIds?.length > 1}
					&nbsp;and others
				{/if}
			{/if}
			<!-- if this is a contextual event, treat it specifically -->
			{#if upgradedEvent?.originType === timelineEventTypes.context}
				<!-- child birth -->
				{#if upgradedEvent?.type === timelineEventTypes.childBirth.type}
					<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
					<JDGButton
						onClickFunction={() => {
							onClickEventRefHost(timelineHost.id);
						}}
						faIcon={timelineEventTypes.childBirth.icon}
						backgroundColor={jdgColors.activeSubtle}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={timelineHost.name}
						tooltip={timelineHost.name}
					/>
				{/if}
				<!-- parent death -->
				{#if upgradedEvent?.type === timelineEventTypes.parentDeath.type}
					<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
					<JDGButton
						onClickFunction={() => {
							onClickEventRefHost(timelineHost.id);
						}}
						faIcon={timelineEventTypes.parentDeath.icon}
						backgroundColor={jdgColors.activeSubtle}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={timelineHost.name}
						tooltip={timelineHost.name}
					/>
				{/if}
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description {eventDescriptionCss}">
				{upgradedEvent?.description ? upgradedEvent?.description : 'Event description'}
			</div>
			{#if upgradedEvent?.images?.length > 0}
				{@const resolvedImages = resolveImageMetaKeys(upgradedEvent.images, imageMetaRegistry)}
				{#if resolvedImages?.length > 0}
					<div class="timeline-event-image-preview">
						<!-- show a few of the timeline event images, if there are any -->
						<JDGImageThumbnailGroup imageMetaSet={resolvedImages} maxImageHeight={'15svh'} />
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.timeline-event-row {
		max-width: 100%;
		display: flex;
		align-items: center;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.timeline-event-date-year-container {
		display: flex;
		flex-direction: column;
	}

	.timeline-event-date {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timeline-event-year {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timeline-event-date-apprx {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: center;
		font-size: 10px;
		padding-top: 3px;
	}

	.timeline-event-node {
		border-radius: 1rem;
		aspect-ratio: 1;
	}

	.timeline-event-line {
		display: flex;
		flex-shrink: 0;
		width: 2rem;
	}

	.timeline-event-title-bar {
		display: flex;
		flex-basis: 0;
		flex-grow: 1;
		width: -webkit-fill-available;
		padding: 5px 10px 5px 10px;
	}

	/* font awesome icon */
	.fa-solid {
		display: flex;
		align-items: center;
	}

	.timeline-event-age {
		padding-left: 10px;
		font-style: italic;
	}

	.timeline-event-content-outer-container {
		display: flex;
		flex-direction: column;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.timeline-event-content {
		padding: 0px 8px 0px 8px;
	}

	.timeline-event-description {
		padding: 8px 0px 8px 0px;
	}

	.timeline-event-image-preview {
		padding-bottom: 8px;
		/* Constrain width to prevent iOS flexbox overflow issues */
		max-width: 100%;
		overflow: hidden;
	}

	.timeline-event-reference-info {
		display: flex;
	}
</style>
