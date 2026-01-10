<script>
	import { getContext } from 'svelte';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';

	import timelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import timelineEventReference from '$lib/schemas/timeline/jdg-timeline-event-reference.js';

	import { isMobileBreakpoint, isTabletBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import {
		getYearsAndMonthsBetweenDates,
		formatAgeDisplayWithRounding,
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

	// Get age suffixes from context (set by parent components)
	// Falls back to default values if context not available
	const eventAgeSuffixPositive = getContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_POSITIVE) ?? 'old';
	const eventAgeSuffixNegative = getContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_NEGATIVE) ?? 'old';
	// Get show months setting from context (default is false)
	const eventAgeShowMonths = getContext(JDG_CONTEXTS.EVENT_AGE_SHOW_MONTHS) ?? false;

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
	let eventAgeDisplay;
	let isEventAgePositive;
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
		/* Centered layout - no left padding needed */
	`;

	const eventDateYearCss = css`
		/* Date/year now above content, no margin needed */
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

	// Node and line removed - no longer needed

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

	// Get the timeline's image registry from context (set by parent JDGTimeline)
	const timelineImageRegistryStore = getContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY);
	$: imageMetaRegistry = $timelineImageRegistryStore;

	$: {
		// Ensure the event is upgraded and updated if the input changes
		upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// Update the age of the event
		if (upgradedEvent) {
			eventDateCorrected = new Date(upgradedEvent.date);

			const ageData = getYearsAndMonthsBetweenDates(timelineHost.inceptionDate, eventDateCorrected);
			eventAge = ageData.years;
			// Format age display with rounding logic
			eventAgeDisplay = formatAgeDisplayWithRounding(
				ageData.years,
				ageData.months,
				eventAgeShowMonths
			);
			// Determine if age is positive (event after inception) or negative (event before inception)
			// Check based on the formatted display - if it shows, determine sign from the data
			if (eventAgeDisplay) {
				const totalYears = ageData.years + ageData.months / 12;
				isEventAgePositive = totalYears > 0 || (totalYears === 0 && ageData.months > 0);
			} else {
				isEventAgePositive = true; // Default, won't be used if display is null
			}
		}
	}

	// For approximate dates with month=01 and day=01, hide the date div entirely
	$: hideDateDiv =
		upgradedEvent?.isApprxDate &&
		eventDateCorrected?.getUTCMonth() === 0 &&
		eventDateCorrected?.getUTCDate() === 1;

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

	let eventDescriptionDynamicCss = css``;
	$: {
		if (upgradedEvent) {
			eventDescriptionDynamicCss = css`
				${upgradedEvent?.type === jdgTimelineEventKeys.article ? 'font-style: italic;' : ''}
			`;
		}
	}

	// Get event label and convert to sentence case for hover text
	$: eventLabel = timelineEventTypes[upgradedEvent?.type]?.label ?? upgradedEvent?.type;
	$: sentenceCaseLabel = eventLabel
		? eventLabel.charAt(0) + eventLabel.slice(1).toLowerCase()
		: eventLabel;
</script>

<div
	class="timeline-event-row {eventRowCss} {eventRowDynamicCss}"
	role="button"
	tabindex="0"
	on:click={onClickTimelineEvent}
	on:keydown={onClickTimelineEvent}
	bind:this={eventRowDivRef}
>
	<div class="timeline-event-content-wrapper">
		<!-- Date and year above content -->
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
				<div class="timeline-event-year-content">
					<div class="timeline-event-year-number">
						{eventDateCorrected?.toString() !== 'Invalid Date'
							? eventDateCorrected?.getUTCFullYear()
							: 'Year?'}
					</div>
					{#if upgradedEvent?.isApprxDate}
						<div class="timeline-event-year-apprx">(apprx.)</div>
					{/if}
				</div>
			</div>
		</div>
		<!-- Content below date/year -->
		<div class="timeline-event-content-outer-container {eventRowContainerCss}">
			<div class="timeline-event-title-bar {eventTitleBarCss}">
				<!-- event icon -->
				<i
					class="fa-solid {timelineEventTypes[upgradedEvent?.type]?.icon} {eventFaIconCss}"
					title="{sentenceCaseLabel} event"
				/>
				<!-- hide age if this is the birth event or if there's no age to display -->
				{#if upgradedEvent?.type !== timelineEventTypes.birth.type && eventAgeDisplay}
					<div class="timeline-event-age {eventAgeCss}">
						{eventAgeDisplay}
						{isEventAgePositive ? eventAgeSuffixPositive : eventAgeSuffixNegative}
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
				<div class="timeline-event-description {eventDescriptionCss} {eventDescriptionDynamicCss}">
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
</div>

<style>
	.timeline-event-row {
		max-width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.timeline-event-content-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		/* Only take the space needed, not full width */
	}

	.timeline-event-date-year-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 8px;
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

	.timeline-event-year-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
	}

	.timeline-event-year-number {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timeline-event-year-apprx {
		font-size: 0.5em;
		font-weight: normal;
		margin-top: 2px;
	}

	.timeline-event-title-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px 5px 10px;
		/* Only take the space needed, not full width */
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
		/* Only take the space needed, not full width */
	}

	.timeline-event-content {
		padding: 0px 8px 0px 8px;
	}

	.timeline-event-description {
		padding: 8px 0px 8px 0px;
		white-space: pre-line;
	}

	.timeline-event-image-preview {
		padding-bottom: 8px;
		/* Constrain width to prevent iOS flexbox overflow issues */
		max-width: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timeline-event-reference-info {
		display: flex;
	}
</style>
