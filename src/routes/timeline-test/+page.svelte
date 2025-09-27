<script>
	import { writable } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';

	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import { timelineEventDraft, timelineHostDraft } from '$lib/stores/jdg-temp-store.js';
	import {
		doShowTimelineEventDetailsModal,
		isAdminMode,
		isMobileBreakpoint,
		isTabletBreakpoint
	} from '$lib/stores/jdg-ui-store.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGH3H4,
		JDGInputContainer,
		JDGSelect,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';

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
	// Use a temporary store for the form preview to read and write
	const localTimelineEventStore = writable();
	const tempId = uuidv4();
	$: {
		const instantiatedEvent = instantiateTimelineEvent(selectedEventTypeKey);
		instantiatedEvent.id = tempId;
		localTimelineEventStore.set(instantiatedEvent);
	}

	const ccmTimelineHost = instantiateObject(jdgTimelineHost);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating title={'TIMELINE HOST'} subtitle={'For people and buildings'}>
		<div>
			<JDGH3H4 h3String="Timeline Schema" paddingBottom="15px" />
			<pre>
					{$timelineHostDraft}
				</pre>
		</div>

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
	<JDGContentBoxFloating title={'TIMELINE EVENT'} subtitle={'For events and images in a Host'}>
		<div
			class:is-mobile={$isMobileBreakpoint || $isTabletBreakpoint}
			class="tri-column-demo-container"
		>
			<div class="tri-column-demo-left-right">
				<JDGH3H4 h3String="Timeline Event Schema" h4String="As local store" paddingBottom="15px" />
				<JDGInputContainer label="Choose schema">
					<JDGSelect
						optionsGroup={eventSchemaOptionsGroup}
						bind:inputValue={selectedEventTypeKey}
					/>
				</JDGInputContainer>
				<div class="timeline-event-schema-preview">
					<pre>{JSON.stringify($localTimelineEventStore, null, 2)}</pre>
				</div>
			</div>
			<div class="tri-column-demo-center">
				<i class={$isMobileBreakpoint ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-right'} />
				Store instantiates form
				<br /><br />
				<i class={$isMobileBreakpoint ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-left'} />
				Form writes back to store
			</div>
			<div class="tri-column-demo-left-right">
				<JDGH3H4
					h3String="Timeline Event Form"
					h4String="Reads and writes local store"
					paddingBottom="15px"
				/>
				<div class="timeline-event-form-preview">
					<JDGTimelineEventForm eventStore={localTimelineEventStore} />
				</div>
			</div>
		</div>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	pre {
		font-size: 0.9rem;
		white-space: pre-wrap;
		word-break: break-word;
		overflow-wrap: anywhere;
	}

	.tri-column-demo-container {
		display: flex;
		flex-direction: row;
		gap: 40px;
	}

	.tri-column-demo-container.is-mobile {
		flex-direction: column;
	}

	.tri-column-demo-left-right {
		flex: 1;
	}

	.tri-column-demo-center {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
