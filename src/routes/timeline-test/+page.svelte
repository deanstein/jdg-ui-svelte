<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuid } from 'uuid';

	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import {
		fetchJsonFileList,
		jdgBuildingDataRepoName,
		jdgRepoOwner,
		readJsonFileFromRepo
	} from '$lib/jdg-persistence-management.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import { timelineEventDraft, timelineHostDraft } from '$lib/stores/jdg-temp-store.js';
	import {
		doAllowTextSelection,
		doShowTimelineEventDetailsModal,
		isAdminMode,
		isMobileBreakpoint,
		isTabletBreakpoint
	} from '$lib/stores/jdg-ui-store.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGH3H4,
		JDGInputContainer,
		JDGSelect,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';

	// Ensure this page allows text selection
	doAllowTextSelection.set(true);

	// Get the available Building Data files from the repo
	let buildingDataFiles;
	// Formatted for the JDGSelect
	let buildingDataOptionsGroup;
	// The selected Building Data file
	let selectedBuildingDataFile;
	// The content of the file from the server
	let selectedBuildingDataContents;

	// The default Timeline Host
	const exampleTimelineHost = instantiateObject(jdgTimelineHost);
	exampleTimelineHost.id = uuid();

	onMount(async () => {
		// Get the available Building Data files from the repo
		// and update the JDGSelect
		buildingDataFiles = await fetchJsonFileList(jdgRepoOwner, jdgBuildingDataRepoName);
		// Set the initial default ([1] seems to be the test)
		selectedBuildingDataFile = buildingDataFiles[1];
	});
	// Update the Select with available files
	$: {
		if (buildingDataFiles && Array.isArray(buildingDataFiles)) {
			buildingDataOptionsGroup = {
				default: Object.fromEntries(
					buildingDataFiles.map((filename) => [
						filename, // key
						{ value: filename, label: filename } // value
					])
				)
			};
		}
	}
	// Update the output of the selected file
	$: if (selectedBuildingDataFile) {
		(async () => {
			selectedBuildingDataContents = await readJsonFileFromRepo(
				jdgRepoOwner,
				jdgBuildingDataRepoName,
				selectedBuildingDataFile
			);
		})();
	}

	// All event types to show
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
	const exampleTimelineEventStore = writable();
	$: {
		const instantiatedEvent = instantiateTimelineEvent(selectedEventTypeKey);
		exampleTimelineEventStore.set(instantiatedEvent);
	}
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating title={'CLOUD DATA'} subtitle={'TimelineHost collections from GitHub'}>
		<JDGBodyCopy>
			<JDGH3H4 h3String="Choose Data Source" paddingBottom="20px" />
			<JDGInputContainer label="Timeline host collection">
				<JDGSelect
					optionsGroup={buildingDataOptionsGroup}
					bind:inputValue={selectedBuildingDataFile}
					isEnabled={true}
				/>
			</JDGInputContainer>
			<pre>{JSON.stringify(selectedBuildingDataContents, null, 2)}</pre>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title={'TIMELINE HOST'} subtitle={'For people and buildings'}>
		<div>
			<JDGH3H4 h3String="Timeline Host Schema" paddingBottom="15px" />
			<pre>{JSON.stringify(exampleTimelineHost, null, 2)}</pre>
		</div>

		<JDGH3H4 h3String="Timeline" paddingBottom="15px" />
		<JDGTimeline
			timelineHost={exampleTimelineHost}
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
					<pre>{JSON.stringify($exampleTimelineEventStore, null, 2)}</pre>
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
					<JDGTimelineEventForm eventStore={exampleTimelineEventStore} />
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
