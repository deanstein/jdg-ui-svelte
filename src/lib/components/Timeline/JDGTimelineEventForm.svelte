<script>
	// @ts-nocheck

	import { get, writable } from 'svelte/store';

	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';
	import {
		extractDataSchemaFields,
		extractUiFromDataSchema
	} from '$lib/jdg-timeline-management.js';

	import {
		instantiateObject,
		JDGCheckbox,
		JDGDatePicker,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';
	import JDGSelect from '../Input/JDGSelect.svelte';
	import JDGComposeToolbar from '../Compose/JDGComposeToolbar.svelte';

	// Read from and write to this store
	export let eventStore = writable(instantiateObject(jdgTimelineEvent));
	// The types of events to show
	export let eventTypeKeys = jdgTimelineEventKeys;
	// Editing
	export let isEditable = true; // show compose toolbar if true
	export let isEditing = false; // fields are in edit state if true
	// For debugging
	export let doShowLocalStore = true;

	let parentRef; // for positioning the compose toolbar

	// Local writable stores for editing
	let localEventStore = writable({});
	let localAdditionalStore = writable({});

	// Sync when parent store changes
	$: {
		const snapshot = get(eventStore);
		localEventStore.set({ ...snapshot });
		localAdditionalStore.set({ ...snapshot.additionalContent });
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
	<JDGSelect
		optionsGroup={timelineEventOptionsGroup(eventTypeKeys)}
		bind:inputValue={$localEventStore.type}
		isEnabled={isEditing}
	/>
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
			onClickCompose={() => {
				isEditing = true;
			}}
			onClickDone={() => {
				saveToStore();
				isEditing = false;
			}}
			onClickCancel={() => {
				isEditing = false;
			}}
		/>
	{/if}
</div>
{#if doShowLocalStore}
	<div class="form-store-preview">
		TEMPORARY FORM STORE:
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
