<script>
// @ts-nocheck

	import { get, writable } from 'svelte/store';

	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';
	import jdgTimelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';
  import { extractUiFromDataSchema } from '$lib/jdg-timeline-management.js';

	import { JDGCheckbox, JDGDatePicker, JDGTextArea, JDGTextInput } from '$lib/index.js';

	// Read from and write to this store
	export let eventStore;

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

	$: typeSchema = jdgTimelineEventTypes[$eventStore.type];
	$: contentSchema = typeSchema?.additionalContent ?? {};
	$: mergedSchema = { ...baseFieldSchema, ...contentSchema };

	$: renderFields = Object.entries(mergedSchema)
		.filter(([key]) => key !== 'isApprxDate')
		.map(([key, def]) => {
			const isAdditional = key in contentSchema;
			const target = isAdditional ? localAdditionalStore : localEventStore;
			return { key, def, target };
		});

	function saveToStore() {
		eventStore.set({
			...localEventStore,
			additionalContent: { ...localAdditionalStore }
		});
	}
</script>

<div class="jdg-timeline-form">
	{#each renderFields as { key, def, target } (key)}
		<div class="form-group">
			<label for={key}>{def.label}</label>

			{#if def.inputType === JDG_INPUT_TYPES.DATE}
				<div class="date-with-checkbox">
					<JDGDatePicker bind:inputValue={target[key]} />
					<JDGCheckbox label="Is approximate?" bind:isChecked={localEventStore.isApprxDate} />
				</div>
			{:else if def.inputType === JDG_INPUT_TYPES.TEXT}
				<JDGTextInput bind:inputValue={$localAdditionalStore[key]} />
			{:else if def.inputType === JDG_INPUT_TYPES.TEXTAREA}
				<JDGTextArea bind:inputValue={$localAdditionalStore[key]} />
			{:else if def.inputType === JDG_INPUT_TYPES.CHECKBOX}
				<JDGCheckbox bind:isChecked={$localAdditionalStore[key]} />
			{:else if def.inputType === JDG_INPUT_TYPES.SELECT}
				<select id={key} bind:value={$localAdditionalStore[key]}>
					{#each def.options as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			{:else if def.inputType === JDG_INPUT_TYPES.IMAGE_LIST}
				<div>[...]</div>
			{:else}
				<JDGTextInput bind:inputValue={target[key]} />
			{/if}
		</div>
	{/each}

	<button on:click={saveToStore}>Save</button>
</div>

<style>
	.jdg-timeline-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
