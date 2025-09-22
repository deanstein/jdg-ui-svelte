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
		JDGH3H4,
		JDGSelect,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';

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
	$: {
		$timelineEventDraft = selectedEventType;
		console.log($timelineEventDraft);
	}

	const ccmTimelineHost = instantiateObject(jdgTimelineHost);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating
		title={'TIMELINE TESTING'}
		subtitle={'Testing the centralized JDGTimeline component'}
	>
		<JDGBodyCopy>
			<JDGH3H4 h3String="Timeline Event Schema Preview" paddingBottom="15px" />
			<JDGSelect optionsGroup={eventSchemaOptionsGroup} bind:inputValue={selectedEventTypeKey} />
			<div class="timeline-event-schema-preview">
				<pre>{JSON.stringify(selectedEventType, null, 2)}</pre>
			</div>
			<br /><br />
			<JDGH3H4 h3String="Timeline Event Form" paddingBottom="15px" />
			<div class="timeline-event-form-preview">
				<JDGTimelineEventForm />
			</div>
		</JDGBodyCopy>
		<JDGH3H4 h3String="Timeline" paddingBottom="15px" />
		<JDGTimeline
			timelineHost={ccmTimelineHost}
			allowEditing={$isAdminMode}
			onClickTimelineEvent={setTimelineEventActive}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	.timeline-event-schema-preview {
		font-size: 0.9rem;
	}
</style>
