<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuid } from 'uuid';

	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import {
		buildingDataCollectionKey,
		familyTreeDataCollectionKey,
		fetchJsonFileList,
		jdgBuildingDataRepoName,
		jdgRepoOwner,
		readJsonFileFromRepo,
		writeJsonFileToRepo
	} from '$lib/jdg-persistence-management.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import {
		timelineCollectionFileDraft,
		timelineEventDraft,
		timelineHostDraft
	} from '$lib/stores/jdg-temp-store.js';
	import {
		doAllowTextSelection,
		doShowTimelineEventDetailsModal,
		isAdminMode,
		isMobileBreakpoint,
		isTabletBreakpoint
	} from '$lib/stores/jdg-ui-store.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { addOrReplaceObjectByKeyValue, instantiateObject } from '$lib/jdg-utils.js';

	import {
		JDGBodyCopy,
		JDGButton,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGH3H4,
		JDGInputContainer,
		JDGJumpTo,
		JDGModalActionsBar,
		JDGSelect,
		JDGTextInput,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Ensure this page allows text selection
	doAllowTextSelection.set(true);

	/*** TIMELINE HOST COLLECTION ***/
	// Get the available Building Data files from the repo
	let timelineHostFiles;
	// Formatted for the JDGSelect
	let timelineHostCollectionOptionsGroup;
	// The selected Building Data file
	let selectedHostFileName;
	// The content of the file from the server
	let selectedHostCollection;
	// The key for accessing a timeline host collection
	let selectedHostCollectionKey;
	// Update the Select with available files
	$: {
		if (timelineHostFiles && Array.isArray(timelineHostFiles)) {
			timelineHostCollectionOptionsGroup = {
				default: Object.fromEntries(
					timelineHostFiles.map((filename) => [
						filename, // key
						{ value: filename, label: filename } // value
					])
				)
			};
		}
	}
	// Update the output of the selected file
	$: if (selectedHostFileName && selectedHostCollectionKey) {
		(async () => {
			selectedHostCollection = await readJsonFileFromRepo(
				jdgRepoOwner,
				jdgBuildingDataRepoName,
				selectedHostFileName
			);
		})();
	}

	/*** TIMELINE HOST ***/
	// Create a new host as an option
	const newTimelineHost = instantiateObject(jdgTimelineHost);
	newTimelineHost.id = uuid();
	newTimelineHost.name = 'New Timeline Host';
	// This is the store we have locally, not a draft
	let localTimelineHostStore = writable();
	// Draft input value stores
	let draftTimelineHostNameStore = writable();
	// Create Select options,
	// including the new host and hosts from the selected collection
	let timelineHostOptionsGroup;
	$: {
		timelineHostOptionsGroup = {
			default: [
				newTimelineHost,
				...(selectedHostCollection?.[selectedHostCollectionKey] ?? [])
			].reduce((group, item, index) => {
				group[`opt${index}`] = {
					value: item,
					label: item.name
				};
				return group;
			}, {})
		};
	}
	// Manage draft fields
	$: {
		if ($localTimelineHostStore !== undefined && $timelineHostDraft === undefined) {
			draftTimelineHostNameStore.set($localTimelineHostStore.name);
		}
	}

	/*** TIMELINE EVENT ***/
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
	const localTimelineEventStore = writable();
	$: {
		const instantiatedEvent = instantiateTimelineEvent(selectedEventTypeKey);
		localTimelineEventStore.set(instantiatedEvent);
	}

	onMount(async () => {
		/*** TIMELINE HOST COLLECTION ***/
		// Get the available Building Data files from the repo
		// and update the JDGSelect
		timelineHostFiles = await fetchJsonFileList(jdgRepoOwner, jdgBuildingDataRepoName);
		// Set the initial default. [1] is the test file
		selectedHostFileName = timelineHostFiles[1];
	});
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGJumpTo />
	<!-- CLOUD COLLECTIONS -->
	<JDGContentBoxFloating
		title={'CLOUD COLLECTIONS'}
		subtitle={'TimelineHost collections from GitHub'}
	>
		<JDGBodyCopy>
			<JDGH3H4 h3String="Choose Timeline Host Collection" paddingBottom="20px" />
			<JDGInputContainer label="JSON file">
				<JDGSelect
					optionsGroup={timelineHostCollectionOptionsGroup}
					bind:inputValue={selectedHostFileName}
					isEnabled={true}
				/>
			</JDGInputContainer>
			<JDGInputContainer label="Collection key">
				<JDGSelect
					optionsGroup={{
						default: {
							building: { value: buildingDataCollectionKey, label: buildingDataCollectionKey },
							family: { value: familyTreeDataCollectionKey, label: familyTreeDataCollectionKey }
						}
					}}
					bind:inputValue={selectedHostCollectionKey}
					isEnabled={true}
				/>
			</JDGInputContainer>
		</JDGBodyCopy>

		<JDGGridLayout>
			<JDGInputContainer label="Timeline Host Collection from Repo">
				{#if selectedHostCollection && selectedHostCollectionKey}
					<pre>{JSON.stringify(selectedHostCollection[selectedHostCollectionKey], null, 2)}</pre>
				{/if}
			</JDGInputContainer>
			<JDGInputContainer label="Timeline Host Collection Draft">
				<pre>{JSON.stringify($timelineCollectionFileDraft, null, 2)}</pre>
			</JDGInputContainer>
		</JDGGridLayout>

		<JDGBodyCopy>
			<JDGModalActionsBar>
				{#if $timelineCollectionFileDraft === undefined}
					<JDGButton
						label="Pull from Repo"
						faIcon="fa-arrow-circle-down"
						onClickFunction={async () => {
							selectedHostCollection = await readJsonFileFromRepo(
								jdgRepoOwner,
								jdgBuildingDataRepoName,
								selectedHostFileName
							);
						}}
						isEnabled={$timelineCollectionFileDraft === undefined}
					/>
				{:else}
					<JDGButton
						label={'Cancel'}
						faIcon={'fa-circle-xmark'}
						backgroundColor={jdgColors.cancel}
						onClickFunction={() => {
							timelineCollectionFileDraft.set(undefined);
						}}
					/>
				{/if}
				<JDGButton
					label={$timelineCollectionFileDraft ? 'Save to Repo' : 'Set to Editing Store'}
					faIcon={$timelineCollectionFileDraft ? 'fa-floppy-disk' : 'fa-pen-to-square'}
					backgroundColor={$timelineCollectionFileDraft ? jdgColors.done : jdgColors.active}
					onClickFunction={$timelineCollectionFileDraft === undefined
						? () => {
								timelineCollectionFileDraft.set(selectedHostCollection);
							}
						: async () => {
								await writeJsonFileToRepo(
									jdgRepoOwner,
									jdgBuildingDataRepoName,
									selectedHostFileName,
									$timelineCollectionFileDraft
								);
								timelineCollectionFileDraft.set(undefined);
							}}
				/>
			</JDGModalActionsBar>
		</JDGBodyCopy>
	</JDGContentBoxFloating>

	<!-- TIMELINE HOST -->
	<JDGContentBoxFloating title={'TIMELINE HOST'} subtitle={'For people and buildings'}>
		<JDGBodyCopy>
			<JDGInputContainer label="Choose timeline host from collection">
				<JDGSelect
					bind:inputValue={$localTimelineHostStore}
					optionsGroup={timelineHostOptionsGroup}
				/>
			</JDGInputContainer>
		</JDGBodyCopy>
		<div
			class:is-mobile={$isMobileBreakpoint || $isTabletBreakpoint}
			class="tri-column-demo-container"
		>
			<div class="tri-column-demo-left-right">
				<div>
					<JDGH3H4 h3String="Timeline Host Schema" h4String="As local store" paddingBottom="15px" />
					<pre>{JSON.stringify($localTimelineHostStore, null, 2)}</pre>
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
				<JDGH3H4 h3String="Timeline Host Form" h4String="Reads and writes local store" />
				<div class="timeline-host-form">
					<JDGInputContainer label="Name">
						<JDGTextInput
							bind:inputValue={$draftTimelineHostNameStore}
							isEnabled={$timelineHostDraft !== undefined}
						/>
					</JDGInputContainer>
				</div>
			</div>
		</div>
		<JDGBodyCopy>
			<JDGModalActionsBar>
				{#if $timelineHostDraft}
					<JDGButton
						label={'Cancel'}
						faIcon={'fa-circle-xmark'}
						backgroundColor={jdgColors.cancel}
						onClickFunction={() => {
							timelineHostDraft.set(undefined);
						}}
					/>
				{/if}
				<JDGButton
					label={$timelineHostDraft ? 'Update in Host Collection' : 'Set to Editing Store'}
					faIcon={$timelineHostDraft ? 'fa-floppy-disk' : 'fa-pen-to-square'}
					backgroundColor={$timelineHostDraft ? jdgColors.done : jdgColors.active}
					onClickFunction={$timelineHostDraft === undefined
						? () => {
								// Start editing a collection draft
								timelineCollectionFileDraft.set(selectedHostCollection);
								// Start editing a host draft
								timelineHostDraft.set($localTimelineHostStore);
								timelineCollectionFileDraft.update((current) => {
									const arr = current[selectedHostCollectionKey] ?? [];
									addOrReplaceObjectByKeyValue(
										arr,
										'id',
										$timelineHostDraft.id,
										$timelineHostDraft
									);
									return {
										...current,
										[selectedHostCollectionKey]: arr
									};
								});
							}
						: () => {
								// Add the current draft to the host collection
								timelineCollectionFileDraft.update((currentValue) => {
									addOrReplaceObjectByKeyValue(
										currentValue[selectedHostCollectionKey],
										'id',
										$localTimelineHostStore.id,
										$localTimelineHostStore
									);
									return currentValue;
								});
								// Set the current draft to the local store
								localTimelineHostStore.update((currentValue) => {
									currentValue.name = $draftTimelineHostNameStore;
									return currentValue;
								});
								timelineHostDraft.set(undefined);
							}}
				/>
			</JDGModalActionsBar>
		</JDGBodyCopy>

		<JDGH3H4 h3String="Timeline" paddingBottom="15px" />
		<JDGTimeline
			timelineHost={newTimelineHost}
			allowEditing={$isAdminMode}
			onClickTimelineEvent={setTimelineEventActive}
			onClickAddEventButton={() => {
				doShowTimelineEventDetailsModal.set(true);
				timelineEventDraft.set(instantiateTimelineEvent(jdgTimelineEventKeys.generic));
			}}
		/>
	</JDGContentBoxFloating>

	<!-- TIMELINE EVENT -->
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

	.timeline-host-form {
		padding: 20px;
	}
</style>
