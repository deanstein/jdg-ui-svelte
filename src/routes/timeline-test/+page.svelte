<script>
	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		doShowTimelineEventDetailsModal,
		isAdminMode,
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGH3H4,
		JDGInputContainer,
		JDGSelect,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import { timelineEventDraft } from '$lib/stores/jdg-temp-store.js';
	import { writable } from 'svelte/store';

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

	// The selected event type
	let selectedEventTypeKey = jdgTimelineEventKeys.birth;
	$: selectedEventType = instantiateTimelineEvent(selectedEventTypeKey);
	// Use a temporary store for the form preview to read and write
	const formPreviewEventStore = writable();
	$: {
		formPreviewEventStore.set(instantiateTimelineEvent(selectedEventTypeKey));
	}

	const ccmTimelineHost = instantiateObject(jdgTimelineHost);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating
		title={'TIMELINE TESTING'}
		subtitle={'Testing the centralized JDGTimeline component'}
	>
		<JDGGridLayout maxColumns={2} gap="30px">
			<div>
				<JDGH3H4 h3String="Timeline Event Schema Preview" paddingBottom="15px" />
				<JDGInputContainer label="Choose schema">
					<JDGSelect
						optionsGroup={eventSchemaOptionsGroup}
						bind:inputValue={selectedEventTypeKey}
					/>
				</JDGInputContainer>
				<div class="timeline-event-schema-preview">
					<pre>{JSON.stringify(selectedEventType, null, 2)}</pre>
				</div>
			</div>
			<div>
				<JDGH3H4 h3String="Timeline Event Form Preview" paddingBottom="15px" />
				<div class="timeline-event-form-preview">
					<JDGTimelineEventForm eventStore={formPreviewEventStore} />
				</div>
			</div>
		</JDGGridLayout>

		<JDGH3H4 h3String="Timeline" paddingBottom="15px" />
		<JDGTimeline
			timelineHost={ccmTimelineHost}
			allowEditing={$isAdminMode}
			onClickTimelineEvent={setTimelineEventActive}
			onClickAddEventButton={() => {
				doShowTimelineEventDetailsModal.set(true);
				timelineEventDraft.set(instantiateTimelineEvent(jdgTimelineEventKeys.generic));
			}}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	.timeline-event-schema-preview {
		font-size: 0.9rem;
	}
</style>
