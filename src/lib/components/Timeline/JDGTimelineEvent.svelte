<script>
	import { getContext, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import timelineEventReference from '$lib/schemas/timeline/jdg-timeline-event-reference.js';

	import { JDG_CONTEXT_KEYS } from '$lib/stores/jdg-context-keys.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';

	import {
		getNumberOfYearsBetweenEvents,
		instantiateObject,
		upgradeTimelineEvent
	} from '$lib/jdg-utils.js';

	import { doShowTimelineEventDetailsModal } from '$lib/stores/jdg-ui-store.js';

	import { JDGButton, JDGImageThumbnailGroup } from '$lib/index.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';

	export let timelineEvent;
	// If true, this event is a reference to someone else's actual event
	// so it will display and interact differently
	export let eventReference = instantiateObject(timelineEventReference);
	// Is this event interactive?
	export let isInteractive = true;
	// When clicking on the event - default is to set it active
	export let onClickTimelineEvent = setTimelineEventActive;
	// When clicking on an event reference host
	export let onClickEventRefHost = (timelineHostId) => {};
	// when clicking on an associated host
	export let onClickAssociatedHost = (timelineHostId) => {};
	// how does this context find a host from their ID?
	export let getTimelineHostById = (timelineHostId) => {
		return instantiateObject(jdgTimelineHost);
	};

	export let backgroundColor = jdgColors.activeColorSubtle;
	export let rowIndex;

	// canClick may need to be overridden
	let canClickCalculated;
	$: {
		isInteractive;
		canClickCalculated = canClickOnTimelineEvent();
	}

	let upgradedEvent;
	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const cornerRadius = '10px';
	const dateFontSize = '0.9rem';
	const yearFontSize = '1.5rem';
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
		gap: ${jdgSizes.timelineEventGapSize};
	`;

	const eventDateYearCss = css`
		margin-left: ${jdgSizes.timelineEventGapSize};
	`;

	const eventDateCss = css`
		font-size: ${dateFontSize};
		width: ${jdgSizes.timelineEventYearWidth};
		color: ${jdgColors.text};
		background-color: ${jdgColors.activeSubtle};
	`;

	const eventYearCss = css`
		font-size: ${yearFontSize};
		width: ${jdgSizes.timelineEventYearWidth};
		color: ${jdgColors.text};
		background-color: ${jdgColors.activeSubtle};
	`;

	const eventNodeCss = css`
		height: ${jdgSizes.timelineEventNodeSize};
		background-color: ${jdgColors.text};
	`;

	const eventDetailLineCss = css`
		background-color: ${jdgColors.text};
	`;

	const eventTitleBarCss = css`
		background-color: rgb(205, 205, 205);
		border-radius: ${cornerRadius} ${cornerRadius} 0px 0px;
	`;

	const eventFaIconCss = css`
		color: ${jdgColors.text};
	`;

	const eventAgeCss = css`
		color: ${jdgColors.text};
	`;

	const eventContentCss = css`
		background-color: ${backgroundColor};
		border-radius: 0px 0px ${cornerRadius} ${cornerRadius};
	`;

	const firstRowContext = getContext(JDG_CONTEXT_KEYS.timelineFirstRowHeight);
	const lastRowContext = getContext(JDG_CONTEXT_KEYS.timelineLastRowHeight);

	onMount(() => {
		// Upgrade the timeline event so it has the right fields for downstream operations
		upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// If this is an eventReference, or the type is today
		// don't do anything on click
		if (eventReference?.personId || timelineEvent.type === jdgTimelineEventKeys.today) {
			onClickTimelineEvent = () => {};
		}
	});

	$: {
		if (upgradedEvent) {
			eventDateCorrected = new Date(upgradedEvent.date);

			eventAge = getNumberOfYearsBetweenEvents(
				getContext(JDG_CONTEXT_KEYS.timelineInceptionEvent),
				eventDateCorrected
			);
		}
	}

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

	// dynamic CSS
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
				&:hover {
					background-color: ${canClickCalculated ? 'rgba(255, 255, 255, 0.75)' : ''};
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
		<div class="timeline-event-date {eventDateCss}">
			<!-- show month name with three letters like AUG -->
			{eventDateCorrected?.toString() !== 'Invalid Date'
				? monthNames[eventDateCorrected?.getUTCMonth()] + ' ' + eventDateCorrected?.getUTCDate()
				: 'Date?'}
		</div>
		<div class="timeline-event-year {eventYearCss}">
			{eventDateCorrected?.toString() !== 'Invalid Date'
				? eventDateCorrected?.getUTCFullYear()
				: 'Year?'}
		</div>
		{#if upgradedEvent?.isApprxDate}
			<div class="timeline-event-date-apprx">(apprx.)</div>
		{/if}
	</div>
	<div class="timeline-event-node {eventNodeCss}" />
	<div class="timeline-event-line {eventDetailLineCss}" />
	<div class="timeline-event-content-outer-container {eventRowContainerCss}">
		<div class="timeline-event-title-bar {eventTitleBarCss}">
			<!-- event icon -->
			<i class="fa-solid {timelineEventTypes[upgradedEvent?.type]?.icon} {eventFaIconCss}" />
			<!-- hide age if this is the birth event -->
			{#if upgradedEvent?.type !== timelineEventTypes.birth.type}
				<div class="timeline-event-age {eventAgeCss}">
					{eventAge?.toString() !== 'NaN' ? 'Age: ' : ''}
					{eventAge?.toString() !== 'NaN' ? eventAge : ''}
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
					label={getTimelineHostById(upgradedEvent?.associatedHostIds[0])?.name}
					tooltip={'Go to ' + getTimelineHostById(upgradedEvent?.associatedHostIds[0])?.name}
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
							onClickEventRefHost(getTimelineHostById(upgradedEvent.additionalContent.childId));
						}}
						faIcon={timelineEventTypes.childBirth.icon}
						backgroundColor={jdgColors.activeSubtle}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getTimelineHostById(upgradedEvent.additionalContent.childId)?.name}
						tooltip={getTimelineHostById(upgradedEvent.additionalContent.childId)?.name}
					/>
				{/if}
				<!-- parent death -->
				{#if upgradedEvent?.type === timelineEventTypes.parentDeath.type}
					<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
					<JDGButton
						onClickFunction={() => {
							onClickEventRefHost(getTimelineHostById(upgradedEvent.additionalContent.parentId));
						}}
						faIcon={timelineEventTypes.parentDeath.icon}
						backgroundColor={jdgColors.activeSubtle}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getTimelineHostById(upgradedEvent.additionalContent.parentId)?.name}
						tooltip={getTimelineHostById(upgradedEvent.additionalContent.parentId)?.name}
					/>
				{/if}
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description">
				{upgradedEvent?.additionalContent?.description
					? upgradedEvent?.additionalContent?.description
					: 'Event description'}
			</div>
			{#if upgradedEvent?.additionalContent?.images?.length > 0}
				<div class="timeline-event-image-preview">
					<!-- show a few of the timeline event images, if there are any -->
					<JDGImageThumbnailGroup imageMetaSet={upgradedEvent?.additionalContent?.images} />
				</div>
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
		border-radius: 5px 5px 0px 0px;
	}

	.timeline-event-year {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0px 0px 5px 5px;
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
		border-radius: 1vw;
		aspect-ratio: 1;
	}

	.timeline-event-line {
		display: flex;
		flex-shrink: 0;
		height: 0.5svh;
		width: 2vw;
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
		font-size: 20px;
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
	}

	.timeline-event-content {
		padding: 0px 8px 0px 8px;
	}

	.timeline-event-description {
		padding: 8px 0px 8px 0px;
	}

	.timeline-event-image-preview {
		padding-bottom: 8px;
	}

	.timeline-event-reference-info {
		display: flex;
	}
</style>
