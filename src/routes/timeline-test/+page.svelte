<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuid } from 'uuid';

	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import {
		buildingDataCollectionKey,
		familyTreeDataCollectionKey,
		fetchImageMetaRegistry,
		fetchJsonFileList,
		jdgBuildingDataRepoName,
		jdgRepoOwner,
		jdgUiSvelteRepoName,
		readJsonFileFromRepo,
		writeJsonFileToRepo
	} from '$lib/jdg-persistence-management.js';
	import {
		instantiateTimelineEvent,
		instantiateTimelineHost,
		upgradeTimelineHost
	} from '$lib/jdg-timeline-management.js';
	import {
		draftTimelineHostCollection,
		draftTimelineEvent,
		draftTimelineHost,
		saveStatus,
		saveFunction
	} from '$lib/stores/jdg-temp-store.js';
	import {
		allowTextSelection,
		showTimelineEventModal,
		isMobileBreakpoint,
		isTabletBreakpoint,
		isTimelineEventModalEditable
	} from '$lib/stores/jdg-ui-store.js';

	import {
		addOrReplaceObjectByKeyValue,
		areObjectsEqual,
		deleteObjectByKeyValue,
		instantiateObject
	} from '$lib/jdg-utils.js';

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
		JDGScrollBox,
		JDGSelect,
		JDGTextInput,
		JDGTimeline,
		JDGTimelineEventForm
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import JDGDatePicker from '$lib/components/Input/JDGDatePicker.svelte';
	import jdgSaveStatus from '$lib/schemas/jdg-save-status.js';

	// Ensure this page allows text selection
	allowTextSelection.set(true);

	// Save the current draft timeline host collection to the GitHub repo
	const saveToRepo = async () => {
		// Set the status to saving
		saveStatus.set(jdgSaveStatus.saving);

		// Write the collection file draft to the repo
		const writeResult = await writeJsonFileToRepo(
			jdgRepoOwner,
			jdgBuildingDataRepoName,
			selectedHostFileName,
			$draftTimelineHostCollection
		);

		// Successfully wrote the JSON file
		if (writeResult) {
			saveStatus.set(jdgSaveStatus.saveSuccess);
			// Set the local timeline host store to the draft one
			localTimelineHostStore.set($draftTimelineHost);
			// Clear the drafts
			draftTimelineHost.set(undefined);
			draftTimelineHostCollection.set(undefined);

			selectedHostCollection = await readJsonFileFromRepo(
				jdgRepoOwner,
				jdgBuildingDataRepoName,
				selectedHostFileName
			);
		} else {
			// Failure: keep draft and set failure status
			saveStatus.set(jdgSaveStatus.failure);
		}
	};

	// Check whether the draft timeline host collection is any different
	// than what's in the repo
	let hasUnsavedChanges;
	$: {
		hasUnsavedChanges =
			selectedHostCollection !== undefined &&
			$draftTimelineHostCollection !== undefined &&
			(!areObjectsEqual(selectedHostCollection, $draftTimelineHostCollection) ||
				!areObjectsEqual($localTimelineHostStore, $draftTimelineHost));
		// Set the saveStatus if unsaved changes are detected
		if (hasUnsavedChanges) {
			saveStatus.set(jdgSaveStatus.unsavedChanges);
		} else {
			saveStatus.set(null);
		}
	}

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
	const newTimelineHost = instantiateTimelineHost();
	newTimelineHost.id = uuid();
	newTimelineHost.name = 'New Timeline Host';
	// This is the store we have locally, not a draft
	let localTimelineHostStore = writable();
	let localTimelineHostInceptionDateStore = writable();
	let localTimelineHostCessationDateStore = writable();
	// Draft input value stores
	let draftTimelineHostNameStore = writable();
	let draftTimelineHostInceptionDateStore = writable();
	let draftTimelineHostCessationDateStore = writable();
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
		if ($localTimelineHostStore !== undefined && $draftTimelineHost === undefined) {
			draftTimelineHostNameStore.set($localTimelineHostStore.name);
			draftTimelineHostInceptionDateStore.set($localTimelineHostStore.inceptionDate);
			draftTimelineHostCessationDateStore.set($localTimelineHostStore.cessationDate);
		}
	}

	/*** TIMELINE EVENT ***/
	// All event types to show
	const instantiatedEventSchemas = Object.entries(jdgTimelineEventTypes)
		.filter(([key, def]) => !def.isContextual) // skip contextual types
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

		// Set the desired save function so other components can call it
		saveFunction.set(saveToRepo);
	});
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGJumpTo />
	<!-- HOST COLLECTIONS -->
	<JDGContentBoxFloating
		title={'TIMELINE HOST COLLECTIONS'}
		subtitle={'Cloud collections from GitHub'}
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
				<JDGScrollBox>
					{#if selectedHostCollection && selectedHostCollectionKey}
						<pre>{JSON.stringify(selectedHostCollection[selectedHostCollectionKey], null, 2)}</pre>
					{/if}
				</JDGScrollBox>
			</JDGInputContainer>
			<JDGInputContainer label="Timeline Host Collection Draft">
				{#if $draftTimelineHostCollection}
					<JDGScrollBox>
						<pre>{JSON.stringify(
								$draftTimelineHostCollection[selectedHostCollectionKey],
								null,
								2
							)}</pre>
					</JDGScrollBox>
				{:else}
					<pre>Start editing to see the draft!</pre>
				{/if}
			</JDGInputContainer>
		</JDGGridLayout>

		<JDGBodyCopy>
			<JDGModalActionsBar>
				{#if $draftTimelineHostCollection === undefined}
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
						isEnabled={$draftTimelineHostCollection === undefined}
					/>
				{:else}
					<JDGButton
						label={'Cancel'}
						faIcon={'fa-circle-xmark'}
						backgroundColor={jdgColors.cancel}
						onClickFunction={() => {
							draftTimelineHostCollection.set(undefined);
						}}
					/>
				{/if}
				<JDGButton
					label={$draftTimelineHostCollection ? 'Save to Repo' : 'Set to Editing Store'}
					faIcon={$draftTimelineHostCollection ? 'fa-floppy-disk' : 'fa-pen-to-square'}
					backgroundColor={$draftTimelineHostCollection ? jdgColors.done : jdgColors.active}
					onClickFunction={$draftTimelineHostCollection === undefined
						? () => {
								draftTimelineHostCollection.set(selectedHostCollection);
							}
						: async () => {
								saveToRepo();
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
					isEnabled={$draftTimelineHost === undefined}
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
					<JDGScrollBox>
						<pre>{JSON.stringify($localTimelineHostStore, null, 2)}</pre>
					</JDGScrollBox>
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
							isEnabled={$draftTimelineHost !== undefined}
						/>
					</JDGInputContainer>
					<JDGInputContainer label="Inception Date">
						<JDGDatePicker
							bind:inputValue={$draftTimelineHostInceptionDateStore}
							isEnabled={$draftTimelineHost !== undefined}
						/>
					</JDGInputContainer>
					<JDGInputContainer label="Cessation Date">
						<JDGDatePicker
							bind:inputValue={$draftTimelineHostCessationDateStore}
							isEnabled={$draftTimelineHost !== undefined}
						/>
					</JDGInputContainer>
				</div>
			</div>
		</div>
		{#if $draftTimelineHost !== undefined}
			<JDGH3H4 h3String={'Draft Timeline Host Store'} />
			<JDGBodyCopy>
				<JDGScrollBox>
					<pre>
				{JSON.stringify($draftTimelineHost, null, 2)}
			</pre>
				</JDGScrollBox>
			</JDGBodyCopy>
		{/if}
		<JDGBodyCopy>
			<JDGModalActionsBar>
				{#if $draftTimelineHost}
					<JDGButton
						label={'Cancel'}
						faIcon={'fa-circle-xmark'}
						backgroundColor={jdgColors.cancel}
						onClickFunction={() => {
							draftTimelineHost.set(undefined);
						}}
					/>
					<JDGButton
						label={'Delete Timeline Host'}
						faIcon={'fa-trash'}
						backgroundColor={jdgColors.delete}
						onClickFunction={() => {
							// Delete this host from the collection draft
							draftTimelineHostCollection.update((currentValue) => {
								deleteObjectByKeyValue(
									currentValue[selectedHostCollectionKey],
									'id',
									$localTimelineHostStore.id
								);
								return currentValue;
							});
							// Eliminate the editing host draft
							draftTimelineHost.set(undefined);
						}}
					/>
				{/if}
				<JDGButton
					label={$draftTimelineHost ? 'Update in Host Collection' : 'Set to Editing Store'}
					faIcon={$draftTimelineHost ? 'fa-floppy-disk' : 'fa-pen-to-square'}
					backgroundColor={$draftTimelineHost ? jdgColors.done : jdgColors.active}
					onClickFunction={$draftTimelineHost === undefined
						? () => {
								// Start editing a collection draft
								draftTimelineHostCollection.set(selectedHostCollection);
								// Start editing a host draft
								// Upgrade the host first
								const upgradedHost = upgradeTimelineHost($localTimelineHostStore);
								// Use instantiateObject to prevent linking of the two stores
								draftTimelineHost.set(instantiateObject(upgradedHost));
								// Update the host in the collection
								draftTimelineHostCollection.update((current) => {
									const arr = current[selectedHostCollectionKey] ?? [];
									addOrReplaceObjectByKeyValue(
										arr,
										'id',
										$draftTimelineHost.id,
										$draftTimelineHost
									);
									return {
										...current,
										[selectedHostCollectionKey]: arr
									};
								});
							}
						: () => {
								// Add the current draft to the host collection
								draftTimelineHostCollection.update((currentValue) => {
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
									currentValue.inceptionDate = $draftTimelineHostInceptionDateStore;
									currentValue.cessationDate = $draftTimelineHostCessationDateStore;
									return currentValue;
								});
								draftTimelineHost.set(undefined);
							}}
				/>
			</JDGModalActionsBar>
		</JDGBodyCopy>

		<JDGH3H4 h3String="Timeline" paddingBottom="15px" />
		<JDGTimeline
			timelineHost={$draftTimelineHost ?? $localTimelineHostStore ?? newTimelineHost}
			allowEditing={$draftTimelineHost !== undefined}
			onClickInceptionEvent={() => {
				showTimelineEventModal.set(true);
				isTimelineEventModalEditable.set(true);
				draftTimelineEvent.set(instantiateTimelineEvent(jdgTimelineEventKeys.generic));
			}}
			addClickAddEvent={() => {
				showTimelineEventModal.set(true);
				draftTimelineEvent.set(instantiateTimelineEvent(jdgTimelineEventKeys.generic));
			}}
		/>
		<JDGButton
			label="Write image-meta-registry.js"
			onClickFunction={async () => {
				const imageMetaRegistry = await fetchImageMetaRegistry(jdgUiSvelteRepoName);
				console.log(imageMetaRegistry);
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
					<JDGScrollBox>
						<pre>{JSON.stringify($localTimelineEventStore, null, 2)}</pre>
					</JDGScrollBox>
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
