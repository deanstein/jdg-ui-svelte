<script>
	// @ts-nocheck
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';
	import jdgTimelineEventTypes from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { JDGFieldRenderer } from '$lib/index.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';

	let event = instantiateTimelineEvent(jdgTimelineEventTypes.generic);
	$: event = $timelineEventDraft;

	// Extract base schema fields (excluding meta and additionalContent)
	const baseFieldSchema = Object.fromEntries(
		Object.entries(jdgTimelineEvent).filter(
			([key, def]) => typeof def === 'object' && def !== null && 'inputType' in def
		)
	);

	// Extract type-specific schema
	$: typeSchema = jdgTimelineEventTypes[event.type];
	$: contentSchema = typeSchema?.additionalContent ?? {};

	// Merge schemas
	$: mergedSchema = { ...baseFieldSchema, ...contentSchema };
</script>

{#each Object.entries(mergedSchema) as [key, fieldDef] (key)}
	<JDGFieldRenderer
		fieldKey={key}
		{fieldDef}
		value={key === 'additionalContent' ? event.additionalContent[key] : event[key]}
		onChange={(e) => {
			const val = e.target?.value ?? e.detail;
			timelineEventDraft.update((ev) => {
				if (key in contentSchema) {
					ev.additionalContent[key] = val;
				} else {
					ev[key] = val;
				}
				return { ...ev };
			});
		}}
	/>
{/each}
