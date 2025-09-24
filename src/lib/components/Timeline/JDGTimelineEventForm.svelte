<script>
	import { writable } from 'svelte/store';
	// @ts-nocheck
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';
	import jdgTimelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { JDGCheckbox, JDGDatePicker, JDGTextArea, JDGTextInput } from '$lib/index.js';
	import { JDG_INPUT_TYPES } from '$lib/schemas/timeline/jdg-input-types.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';

	export let eventStore;
	$: event = $eventStore;

	// Extract base schema fields
	const baseFieldSchema = Object.fromEntries(
		Object.entries(jdgTimelineEvent).filter(
			([key, def]) => typeof def === 'object' && def !== null && 'inputType' in def
		)
	);

	// Reactive schema merging
	$: typeSchema = jdgTimelineEventTypes[event.type];
	$: contentSchema = typeSchema?.additionalContent ?? {};
	$: mergedSchema = { ...baseFieldSchema, ...contentSchema };

	// Build renderable field list
	$: renderFields = Object.entries(mergedSchema)
		.filter(([key]) => key !== 'isApprxDate') // exclude from default rendering
		.map(([key, def]) => {
			const isAdditional = key in contentSchema;
			const value = isAdditional ? event.additionalContent[key] : event[key];
			return { key, def, value, isAdditional };
		});

	function handleChange(e, key, isAdditional) {
		const val = e.target?.value ?? e.detail;
		timelineEventDraft.update((ev) => {
			if (isAdditional) {
				//@ts-expect-error
				ev.additionalContent[key] = val;
			} else {
				ev[key] = val;
			}
			return { ...ev };
		});
	}
</script>

<div class="jdg-timeline-form">
	{#each renderFields as { key, def, value, isAdditional } (key)}
		<div class="form-group">
			<label for={key}>{def.label}</label>

			{#if def.inputType === JDG_INPUT_TYPES.DATE}
				<div class="date-with-checkbox">
					<JDGDatePicker bind:inputValue={value} />
					<JDGCheckbox label="Is approximate?" bind:isChecked={value} />
				</div>
			{:else if def.inputType === JDG_INPUT_TYPES.TEXT}
				<JDGTextInput bind:inputValue={value} />
			{:else if def.inputType === JDG_INPUT_TYPES.TEXTAREA}
				<JDGTextArea bind:inputValue={value} />
			{:else if def.inputType === JDG_INPUT_TYPES.CHECKBOX}
				<JDGCheckbox bind:isChecked={value} />
			{:else if def.inputType === JDG_INPUT_TYPES.SELECT}
				<select id={key} bind:value>
					{#each def.options as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			{:else if def.inputType === JDG_INPUT_TYPES.IMAGE_LIST}
				<div>[...]</div>
			{:else}
				<JDGTextInput bind:inputValue={value} />
			{/if}
		</div>
	{/each}
</div>

<style>
	.jdg-timeline-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
