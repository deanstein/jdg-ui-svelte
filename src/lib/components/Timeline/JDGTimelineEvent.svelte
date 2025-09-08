<script>
	import { getContext, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import timelineEventOriginTypes from '$lib/schemas/timeline/jdg-timeline-event-origin-types.js';
	import timelineEventReference from '$lib/schemas/timeline/jdg-timeline-event-reference.js';

	import { JDG_CONTEXT_KEYS } from '$lib/stores/jdg-context-keys.js';
	import { timelineEditEvent } from '$lib/stores/jdg-temp-store.js';

	import { getNumberOfYearsBetweenEvents, instantiateObject, upgradeTimelineEvent } from '$lib/jdg-utils.js';

	import {
		doShowTimelineEventDetailsModal,
	} from '$lib/states/ui-state.js';

	import { JDGButton, JDGImageThumbnailGroup } from '$lib/index.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let timelineEvent;
	// if this is set, this event is a reference to someone else's event
	// so it will display and interact differently
	export let eventReference = instantiateObject(timelineEventReference);
	// when clicking on the event
	export let onClickFunction = () => {};
	// when clicking on the event reference rouce
	export let onClickEventRefSourceFunction = () => {};
	// when clicking on the associat
	export let onClickEventAssocSourceFunction = () => {};
	export let backgroundColor = jdgColors.activeColorSubtle;
	export let rowIndex;

	let upgradedEvent;
	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const timelineFirstEventHeight = getContext(JDG_CONTEXT_KEYS.timelineFirstRowHeight);
	const timelineLastEventHeight = getContext(JDG_CONTEXT_KEYS.timelineLastRowHeight);

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

	const onClickTimelineEvent = () => {
		// do nothing if this is the "today" event (no death date)
		// or if the event is not a self event
		if (
			upgradedEvent.originType !== timelineEventOriginTypes.self ||
			upgradedEvent.eventType === timelineEventTypes.today.type
		) {
			return;
		}
		doShowTimelineEventDetailsModal.set(true);
		timelineEditEvent.set(upgradedEvent);
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
		border-radius: ${cornerRadius}
			${cornerRadius} 0px 0px;
	`;

	const eventFaIconCss = css`
		color: ${jdgColors.text};
	`;

	const eventAgeCss = css`
		color: ${jdgColors.text};
	`;

	const eventContentCss = css`
		background-color: ${backgroundColor};
		border-radius: 0px 0px ${cornerRadius}
			${cornerRadius};
	`;

	onMount(() => {
		// upgrade the timeline event so it has the right fields for downstream operations
		upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// birth and death events report their row height for the spine to align to
		if (upgradedEvent.eventType === timelineEventTypes.birth.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			timelineFirstEventHeight.set(eventRowHeight);
		}
		if (upgradedEvent.eventType === timelineEventTypes.death.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			timelineLastEventHeight.set(eventRowHeight);
		}

		// if onClick isn't provided, use this function
		onClickFunction =
			(onClickFunction ?? eventReference?.personId) ? () => {} : onClickTimelineEvent;
	});

	$: {
		if (upgradedEvent) {
			eventDateCorrected = new Date(upgradedEvent.eventDate);

			eventAge = getNumberOfYearsBetweenEvents(getContext(JDG_CONTEXT_KEYS.timelineInceptionEvent), eventDateCorrected);
		}
	}

	// dynamic CSS
	let eventRowContainerCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowContainerCss = css`
				cursor: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
				upgradedEvent.eventType === timelineEventTypes.today.type
					? 'default'
					: 'pointer'};
			`;
		}
	}

	let eventRowDynamicCss = css``;
	$: {
		if (upgradedEvent) {
			eventRowDynamicCss = css`
				grid-row: ${rowIndex};
				cursor: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
				upgradedEvent.eventType === timelineEventTypes.today.type
					? 'default'
					: 'pointer'};
				&:hover {
					background-color: ${upgradedEvent.originType !== timelineEventOriginTypes.self ||
					upgradedEvent.eventType === timelineEventTypes.today.type
						? ''
						: 'rgba(255, 255, 255, 0.75)'};
				}
			`;
		}
	}
</script>

<div
	class="timeline-event-row {eventRowCss} {eventRowDynamicCss}"
	role="button"
	tabindex="0"
	on:click={onClickFunction}
	on:keydown={onClickFunction}
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
			<i class="fa-solid {timelineEventTypes[upgradedEvent?.eventType]?.icon} {eventFaIconCss}" />
			<!-- hide age if this is the birth event -->
			{#if upgradedEvent?.eventType !== timelineEventTypes.birth.type}
				<div class="timeline-event-age {eventAgeCss}">
					{eventAge?.toString() !== 'NaN' ? 'Age: ' : ''}
					{eventAge?.toString() !== 'NaN' ? eventAge : ''}
				</div>
			{/if}
			<!-- if this is a reference event, show who it's shared from -->
			{#if timelineEvent.originType === timelineEventOriginTypes.reference}
				<div>
					<div class="timeline-event-reference-info">
						<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
						<JDGButton
							onClickFunction={() => {
								onClickEventRefSourceFunction();
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
			{#if upgradedEvent?.eventContent?.associatedPeopleIds?.length > 0 && upgradedEvent?.originType !== timelineEventOriginTypes.reference}
				<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event with &nbsp; </i>
				<JDGButton
					onClickFunction={() => {
						setActivePerson(getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0]));
					}}
					faIcon={'fa-circle-arrow-right'}
					backgroundColor={jdgColors.active}
					paddingLeftRight="8px"
					paddingTopBottom="2px"
					fontSize="12px"
					gap="6px"
					label={getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0])?.name}
					tooltip={'Go to ' +
						getPersonById(upgradedEvent?.eventContent?.associatedPeopleIds[0])?.name}
				/>
				<!-- if more than one, show a label -->
				{#if upgradedEvent?.eventContent?.associatedPeopleIds?.length > 1}
					&nbsp;and others
				{/if}
			{/if}
			<!-- if this is a contextual event, treat it specifically -->
			{#if upgradedEvent?.originType === timelineEventOriginTypes.contextual}
				<!-- child birth -->
				{#if upgradedEvent?.eventType === timelineEventTypes.childBirth.type}
					<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
					<JDGButton
						onClickFunction={() => {
							setActivePerson(getPersonById(upgradedEvent?.originMeta?.personId));
						}}
						faIcon={timelineEventTypes.childBirth.icon}
						backgroundColor={stylingConstants.colors.activePersonNodeColor}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getPersonById(upgradedEvent?.originMeta?.personId)?.name}
						tooltip={'Go to ' + getPersonById(upgradedEvent?.originMeta?.personId)?.name}
					/>
				{/if}
				<!-- parent death -->
				{#if upgradedEvent?.eventType === timelineEventTypes.parentDeath.type}
					<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
					<JDGButton
						onClickFunction={() => {
							setActivePerson(getPersonById(upgradedEvent?.originMeta?.personId));
						}}
						faIcon={timelineEventTypes.parentDeath.icon}
						backgroundColor={stylingConstants.colors.activePersonNodeColor}
						paddingLeftRight="8px"
						paddingTopBottom="2px"
						fontSize="12px"
						gap="6px"
						label={getPersonById(upgradedEvent?.originMeta?.personId)?.name}
						tooltip={'Go to ' + getPersonById(upgradedEvent?.originMeta?.personId)?.name}
					/>
				{/if}
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description">
				{upgradedEvent?.eventContent?.description
					? upgradedEvent?.eventContent?.description
					: 'Event description'}
			</div>
			{#if upgradedEvent?.eventContent?.images?.length > 0}
				<div class="timeline-event-image-preview">
					<!-- show a few of the timeline event images, if there are any -->
					<ImageThumbnailGroup
						imageArray={upgradedEvent?.eventContent?.images}
						showGroupTitle={false}
						showAddButton={false}
					/>
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
		background-color: rgba(205, 205, 205, 1);
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
