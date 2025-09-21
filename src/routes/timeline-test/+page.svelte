<script>
	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes, {
		JDGTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		isAdminMode,
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGSelect,
		JDGTimeline
	} from '$lib/index.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';

	// all event types for previewing
	const instantiatedEventSchemas = Object.entries(jdgTimelineEventTypes)
		.filter(([key, def]) => !def.isContextual) // optional: skip contextual types
		.map(([key, def]) => ({
			key,
			label: key,
			instance: instantiateObject(key)
		}));
	const eventSchemaOptionsGroup = {
		allEvents: {
			label: 'All Event Types',
			...Object.fromEntries(
				instantiatedEventSchemas.map(({ key, label }) => [key, { value: key, label }])
			)
		}
	};
	let selectedEventTypeKey = JDGTimelineEventKeys.birth;
	$: selectedEventType = instantiateTimelineEvent(selectedEventTypeKey);

	const ccmTimelineHost = instantiateObject(jdgTimelineHost);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGBodyCopy>
			<h3>Timeline Event Schema Preview</h3>
			<JDGSelect optionsGroup={eventSchemaOptionsGroup} bind:inputValue={selectedEventTypeKey} />
			<div class="timeline-event-schema-preview">
				<pre>{JSON.stringify(selectedEventType, null, 2)}</pre>
			</div>
		</JDGBodyCopy>
		<JDGTimeline
			timelineHost={ccmTimelineHost}
			allowEditing={$isAdminMode}
			onClickTimelineEvent={setTimelineEventActive}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
