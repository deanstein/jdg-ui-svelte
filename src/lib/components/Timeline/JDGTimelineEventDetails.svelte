<script>
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import jdgTimelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';

	import {
		doShowDeleteModal,
		customDeleteMessage,
		postDeleteFunction
	} from '$lib/stores/jdg-ui-store.js';

	import {
		addOrReplaceTimelineEvent,
		deleteTimelineEvent,
		getTimelineEventById
	} from '$lib/jdg-timeline-management.js';
	import {
		getObjectByKeyValue,
		instantiateObject,
		getIsDateValid,
		areObjectsEqual
	} from '$lib/jdg-utils.js';
	import { requireAdminMode } from '$lib/jdg-ui-management.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGDatePicker,
		JDGGridLayout,
		JDGImageThumbnailGroup,
		JDGInputContainer,
		JDGModal,
		JDGModalActionsBar,
		JDGSelect,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';

	// get the event data
	let eventType = get(timelineEventDraft).type;

	let isNewEvent = false; // if true, this event was not found in this person's events
	let isValidDate = false; // if true, the current date in the field is valid
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always

	// modal title changes based on the event type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue;
	let eventDateApprxValue;
	let eventTypeInputValue;
	let eventDescriptionInputValue;
	let birthdateInputValue;
	let birthdateApprxInputValue;
	let birthtimeInputValue;
	let birthplaceInputValue;
	let deathDateInputValue;
	let deathDateApprxInputValue;
	let deathPlaceInputValue;
	let deathTimeInputValue;
	let deathCauseInputValue;

	// dynamic styles
	let mediaContentContainerCss;

	// used for checking against latest event and setting unsaved changes flag to true
	let originalEventContent;

	onMount(() => {
		originalEventContent = get(timelineEventDraft);
		syncAllInputs();
	});

	const onClickEditButton = () => {
		isTimelineEventInEditMode.set(true);
	};

	// cancel, but when used for editing an existing event
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		syncAllInputs();
		isTimelineEventInEditMode.set(false);
		isNodeEditActive.set(false);
	};
	// cancel, but when used for creating a new event
	const onClickCancelNewEventButton = () => {
		showTimelineEventDetailsModal.set(false);
		isTimelineEventInEditMode.set(false);
		timelineEditEvent.set(undefined);
		isNodeEditActive.set(false);
	};

	const onClickDoneButton = () => {
		saveAllInputs();
		if (
			!areObjectsEqual(
				originalEventContent,
				getTimelineEventById(get(activePerson).id, get(timelineEditEvent).eventId)
			)
		) {
			hasUnsavedChanges.set(true);
		}
		isTimelineEventInEditMode.set(false);
		isNodeEditActive.set(false);

		// close modal if this action was creating a new event
		if (isNewEvent) {
			showTimelineEventDetailsModal.set(false);
		}
	};

	const onClickDeleteButton = () => {
		// if there are images, need to show the confirmation dialog
		// because this action will require automatically saving the tree
		if (get(timelineEditEvent).eventContent?.images?.length > 0) {
			requireAdminMode(() => {
				// show the modal with a custom message
				showDeleteModal.set(true);
				customDeleteMessage.set(
					'This event contains images which require deletion on the server.\n\nDeleting this event will save all changes and cannot be undone.'
				);
				// set the function to run after delete is confirmed
				postDeleteFunction.set(() => deleteThisTimelineEvent);
			});
		}
		// otherwise, delete directly
		// this doesn't require admin mode since it doesn't require a save
		else {
			deleteThisTimelineEvent();
		}
	};

	// runs after the deletion is confirmed, if necessary
	const deleteThisTimelineEvent = () => {
		deleteTimelineEvent(get(timelineEditEvent));
		isTimelineEventInEditMode.set(false);
		timelineEditEvent.set(undefined);
		hasUnsavedChanges.set(true);
		showTimelineEventDetailsModal.set(false);
	};

	const onClickCloseButton = () => {
		showTimelineEventDetailsModal.set(false);
		timelineEditEvent.set(undefined);
		isNodeEditActive.set(false);
	};

	const onClickAddImageButton = () => {
		const newTimelineEventImage = instantiateObject(timelineEventImage);
		newTimelineEventImage.id = uuidv4();
		newTimelineEventImage.eventId = get(timelineEditEvent).eventId;
		imageEditContent.set(newTimelineEventImage);
		isNewImage.set(true);
		showTimelineEventImageDetailModal.set(true);
	};

	// checks whether the value in the date input field is valid
	// critical to enable or disable the Done button depending on whether the date is good
	const getIsDateInputValid = (event) => {
		eventDateInputValue = event.target.value;
		isValidDate = getIsDateValid(eventDateInputValue);
	};

	const getModalTitleByEventType = (eventType) => {
		switch (eventType) {
			case jdgTimelineEventTypes.birth.type:
				return isNewEvent
					? 'New ' + timelineEventStrings.birthEventModalTitle
					: timelineEventStrings.birthEventModalTitle;
			case jdgTimelineEventTypes.death.type:
				return timelineEventStrings.deathEventModalTitle;
			default:
				return isNewEvent
					? 'New ' + timelineEventStrings.textEventModalTitle
					: timelineEventStrings.textEventModalTitle;
		}
	};

	const filteredEventTypes = Object.values(jdgTimelineEventTypes).filter(
		(type) => !type.isContextual
	);

	const timelineEventOptions = {
		label: 'Event types:',
		filteredEventTypes
	};

	$: {
		isValidDate = getIsDateValid(eventDateInputValue);
		modalTitle = getModalTitleByEventType(eventType);
		isBirthOrDeathEvent =
			eventType === jdgTimelineEventTypes.birth.type ||
			eventType === jdgTimelineEventTypes.death.type;
		isNewEvent = !getObjectByKeyValueInArray(
			get(activePerson)?.timelineEvents,
			'eventId',
			get(timelineEditEvent)?.eventId
		)
			? true
			: false;

		mediaContentContainerCss = css`
			border: 2px solid
				${$isTimelineEventInEditMode ? stylingConstants.colors.activeColor : 'transparent'};
			border-radius: ${$isTimelineEventInEditMode
				? '0px'
				: stylingConstants.sizes.bioFieldBorderRadius};
		`;
	}
</script>

<JDGModal
	showModal={$showTimelineEventDetailsModal}
	title={modalTitle}
	height={stylingConstants.sizes.modalFormHeight}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div class="edit-timeline-event-modal-content" slot="modal-content-slot">
		<!-- modal content will depend on the event type -->

		<!-- birth -->
		{#if eventType === jdgTimelineEventTypes.birth.type}
			<JDGGridLayout>
				<JDGInputContainer label={timelineEventStrings.birthdate}>
					<JDGDatePicker
						bind:inputValue={birthdateInputValue}
						isEnabled={$isTimelineEventInEditMode}
						onInputFunction={getIsDateInputValid}
					/>
				</JDGInputContainer>
				<JDGInputContainer label={timelineEventStrings.birthtime}>
					<JDGTextInput
						bind:inputValue={birthtimeInputValue}
						isEnabled={$isTimelineEventInEditMode}
					/>
				</JDGInputContainer>
			</JDGGridLayout>
			<div class="approximate-date-row">
				<JDGCheckbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={birthdateApprxInputValue}
				/>
			</div>
			<JDGInputContainer label={timelineEventStrings.birthplace}>
				<JDGTextInput
					bind:inputValue={birthplaceInputValue}
					isEnabled={$isTimelineEventInEditMode}
				/>
			</JDGInputContainer>

			<!-- death -->
		{:else if eventType === jdgTimelineEventTypes.death.type}
			<JDGGridLayout>
				<JDGInputContainer label={timelineEventStrings.deathDate}>
					<JDGDatePicker
						bind:inputValue={deathDateInputValue}
						isEnabled={$isTimelineEventInEditMode}
					/>
				</JDGInputContainer>
				<JDGInputContainer label={timelineEventStrings.deathTime}>
					<JDGTextInput
						bind:inputValue={deathTimeInputValue}
						isEnabled={$isTimelineEventInEditMode}
					/>
				</JDGInputContainer>
			</JDGGridLayout>
			<div class="approximate-date-row">
				<JDGCheckbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={deathDateApprxInputValue}
				/>
			</div>
			<JDGInputContainer label={timelineEventStrings.deathPlace}>
				<JDGTextInput
					bind:inputValue={deathPlaceInputValue}
					isEnabled={$isTimelineEventInEditMode}
				/>
			</JDGInputContainer>
			<JDGInputContainer label={timelineEventStrings.deathCause}>
				<JDGTextInput
					bind:inputValue={deathCauseInputValue}
					isEnabled={$isTimelineEventInEditMode}
				/>
			</JDGInputContainer>
			<!-- standard content box if no event type or generic type -->
		{:else}
			<JDGGridLayout>
				<JDGInputContainer label="Date">
					<JDGDatePicker
						isEnabled={$isTimelineEventInEditMode}
						bind:inputValue={eventDateInputValue}
					/>
				</JDGInputContainer>
				<JDGInputContainer label="Type">
					<JDGSelect
						isEnabled={$isTimelineEventInEditMode}
						bind:inputValue={eventTypeInputValue}
						optionsGroup={timelineEventOptions}
						optionValueKey="type"
						optionLabelKey="label"
					/>
				</JDGInputContainer>
			</JDGGridLayout>
			<div class="approximate-date-row">
				<JDGCheckbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={eventDateApprxValue}
				/>
			</div>
			<JDGInputContainer label="Description">
				<JDGTextArea
					isEnabled={$isTimelineEventInEditMode}
					bind:inputValue={eventDescriptionInputValue}
				/>
			</JDGInputContainer>
			<JDGInputContainer label="Images">
				<div class="media-content-container {mediaContentContainerCss}">
					<JDGImageThumbnailGroup
						allowEdit={$isTimelineEventInEditMode}
						imageArray={$timelineEditEvent?.eventContent?.images ?? []}
						showGroupTitle={false}
						showAddButton={$isTimelineEventInEditMode}
						onClickAddButton={onClickAddImageButton}
					/>
				</div>
			</JDGInputContainer>
			<JDGInputContainer label="With" grow={true}>
				<div class="media-content-container {mediaContentContainerCss}">
					<AssociatedPersonNodeGroup
						showGroupTitle={false}
						showAddButton={$isTimelineEventInEditMode}
						enabled={$isTimelineEventInEditMode}
						associatedPeopleIds={$timelineEditEvent?.eventContent?.associatedPeopleIds}
					/>
				</div>
			</JDGInputContainer>
		{/if}
	</div>
	<div slot="modal-toolbar-slot">
		<JDGModalActionsBar>
			{#if !$isTimelineEventInEditMode}
				<JDGButton
					buttonText={'Edit'}
					onClickFunction={onClickEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorPrimary}
				/>
				<JDGButton
					buttonText={'Close'}
					onClickFunction={onClickCloseButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
			{:else}
				{#if !isNewEvent && !isBirthOrDeathEvent}
					<JDGButton
						buttonText="Delete"
						onClickFunction={onClickDeleteButton}
						overrideColor={stylingConstants.colors.buttonColorDelete}
						overrideBackgroundColor="transparent"
						overrideBackgroundColorHover="{stylingConstants.colors.buttonColorDelete};"
					/>
				{/if}
				<JDGButton
					buttonText={'Cancel'}
					onClickFunction={isNewEvent && !isBirthOrDeathEvent
						? onClickCancelNewEventButton
						: onClickCancelEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<JDGButton
					buttonText="Done"
					isEnabled={isValidDate}
					onClickFunction={onClickDoneButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				/>
			{/if}
		</JDGModalActionsBar>
	</div>
</JDGModal>

<style>
	.edit-timeline-event-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1svh;
	}

	.media-content-container {
		display: flex;
		flex-direction: column;
		padding: 10px;
		background-color: white;
	}

	.approximate-date-row {
		width: -webkit-fill-available;
		padding-bottom: 10px;
		margin-top: -10px;
	}
</style>
