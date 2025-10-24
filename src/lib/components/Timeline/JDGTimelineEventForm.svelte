<script>
	// @ts-nocheck

	import { get, writable } from 'svelte/store';

	import { timelineEventDraft, timelineHostDraft } from '$lib/stores/jdg-temp-store.js';
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';
	import {
		extractDataSchemaFields,
		extractUiFromDataSchema
	} from '$lib/jdg-timeline-management.js';
	import { addOrReplaceObjectByKeyValue, getIsObjectInArray } from '$lib/jdg-utils.js';

	import {
		showTimelineEventModal,
		instantiateObject,
		JDGCheckbox,
		JDGDatePicker,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';
	import JDGSelect from '../Input/JDGSelect.svelte';
	import JDGComposeToolbar from '../Compose/JDGComposeToolbar.svelte';
	import JDGInputContainer from '../Input/JDGInputContainer.svelte';

	// Read from and write to this store
	export let eventStore = writable(instantiateObject(jdgTimelineEvent));
	// The types of events to show
	export let eventTypeKeys = jdgTimelineEventKeys;
	// Editing
	export let isEditable = true; // show compose toolbar if true
	export let isEditing = false; // fields are in edit state if true
	// For debugging
	export let showLocalStore = false;

	let parentRef; // for positioning the compose toolbar

	let isNewEvent; // If true, this event wasn't found in the draft timeline host

	// Local writable stores for editing
	let localEventStore = writable({});
	let localAdditionalStore = writable({});

	// Sync when parent store changes
	$: {
		const snapshot = get(eventStore);
		localEventStore.set({ ...snapshot });
		localAdditionalStore.set({ ...snapshot.additionalContent });
	}

	// Consider this a new event if it's not present in the
	// editing timelineHost's events array
	$: {
		// Determine if this is a new event or not
		// If there's no timelineHostDraft, this can't be a new event (nowhere to save)
		if (!$timelineHostDraft) {
			isNewEvent = false;
		}
		// Otherwise, if there is a host draft and this isn't present in its events, it's new
		else if (!getIsObjectInArray($timelineHostDraft?.timelineEvents, $timelineEventDraft)) {
			isNewEvent = true;
		}
	}

	// Schema prep
	const baseFieldSchema = extractUiFromDataSchema(jdgTimelineEvent);

	$: typeSchema = jdgTimelineEventTypes[$localEventStore.type];
	$: contentSchema = typeSchema?.additionalContent ?? {};
	$: mergedSchema = { ...baseFieldSchema, ...contentSchema };

	$: renderFields = Object.entries(mergedSchema)
		.filter(([key]) => key !== 'isApprxDate')
		.map(([key, def]) => {
			const isAdditional = key in contentSchema;
			return { key, def, isAdditional };
		});

	function saveToStore() {
		eventStore.set({
			...$localEventStore,
			additionalContent: { ...$localAdditionalStore }
		});

		// Update the timeline host draft
		timelineHostDraft.update((currentValue) => {
			addOrReplaceObjectByKeyValue(
				currentValue.timelineEvents,
				'id',
				get(localEventStore).id,
				get(eventStore)
			);
			return currentValue;
		});
	}

	const timelineEventOptionsGroup = (eventTypeKeys) => {
		return {
			timelineTypes: Object.fromEntries(
				Object.entries(jdgTimelineEventTypes)
					.filter(([key, value]) => eventTypeKeys[key] && !value.isContextual)
					.map(([key, value]) => [
						key,
						{
							value: key,
							label: value.label ?? key
						}
					])
			),
			includedKeys: Object.keys(eventTypeKeys).filter(
				(key) => !jdgTimelineEventTypes[key]?.isContextual
			)
		};
	};

	$: if ($localEventStore.type) {
		const newAddlContent = jdgTimelineEventTypes[$localEventStore.type]?.additionalContent ?? {};
		const freshAdditionalContent = extractDataSchemaFields(newAddlContent);
		localAdditionalStore.set(freshAdditionalContent);
	}
</script>

<div bind:this={parentRef} class="jdg-timeline-form">
	<!-- Only show Type dropdown when editing -->
	{#if isEditing}
		<JDGInputContainer label="Type">
			<JDGSelect
				optionsGroup={timelineEventOptionsGroup(eventTypeKeys)}
				bind:inputValue={$localEventStore.type}
				isEnabled={isEditing}
			/>
		</JDGInputContainer>
	{/if}
	{#each renderFields as { key, def, isAdditional } (key)}
		<div class="form-group">
			<label for={key}>{def.label}</label>

			{#if def.inputType === JDG_INPUT_TYPES.DATE}
				<div class="date-with-checkbox">
					{#if isAdditional}
						<JDGDatePicker bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
					{:else}
						<JDGDatePicker bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
					{/if}
					<JDGCheckbox
						label="Is approximate?"
						bind:isChecked={$localEventStore.isApprxDate}
						isEnabled={isEditing}
					/>
				</div>
			{:else if def.inputType === JDG_INPUT_TYPES.TEXT}
				{#if isAdditional}
					<JDGTextInput bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
				{:else}
					<JDGTextInput bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
				{/if}
			{:else if def.inputType === JDG_INPUT_TYPES.TEXTAREA}
				{#if isAdditional}
					<JDGTextArea bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
				{:else}
					<JDGTextArea bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
				{/if}
			{:else if def.inputType === JDG_INPUT_TYPES.CHECKBOX}
				{#if isAdditional}
					<JDGCheckbox bind:isChecked={$localAdditionalStore[key]} isEnabled={isEditing} />
				{:else}
					<JDGCheckbox bind:isChecked={$localEventStore[key]} isEnabled={isEditing} />
				{/if}
			{:else if def.inputType === JDG_INPUT_TYPES.SELECT}
				{#if isAdditional}
					<select id={key} bind:value={$localAdditionalStore[key]}>
						{#each def.options as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				{:else}
					<select id={key} bind:value={$localEventStore[key]}>
						{#each def.options as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				{/if}
			{:else if def.inputType === JDG_INPUT_TYPES.IMAGE_LIST}
				<div>[...]</div>
			{:else if isAdditional}
				<JDGTextInput bind:inputValue={$localAdditionalStore[key]} />
			{:else}
				<JDGTextInput bind:inputValue={$localEventStore[key]} />
			{/if}
		</div>
	{/each}
	{#if isEditable}
		<JDGComposeToolbar
			{parentRef}
			isEditActive={isEditing}
			composeButtonTooltip="Edit"
			onClickCompose={() => {
				isEditing = true;
			}}
			onClickDone={() => {
				saveToStore();
				showTimelineEventModal.set(false);
			}}
			onClickCancel={() => {
				if (isNewEvent) {
					showTimelineEventModal.set(false);
				} else {
					isEditing = false;
					// Reset the stores
					localEventStore.set($eventStore);
					localAdditionalStore.set($eventStore.additionalContent);
					localEventStore.update((current) => ({
						...current,
						type: $eventStore.type
					}));
				}
			}}
		/>
	{/if}
</div>
{#if showLocalStore}
	<div class="form-store-preview">
		FORM STORE:
		<pre>
		{JSON.stringify({ ...$localEventStore, additionalContent: { ...$localAdditionalStore } }, null, 2)}
	</pre>
	</div>
{/if}

<style>
	.jdg-timeline-form {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-width: 0;
		overflow-x: hidden;
	}

	.form-store-preview {
		margin-top: 20px;
	}
</style>
