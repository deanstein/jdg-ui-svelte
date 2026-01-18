<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { v4 as uuid } from 'uuid';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import imageMetaRegistry from '.././image-meta-registry.js';
	import getJdgImageMetaRegistry from '$lib/jdg-image-meta-registry.js';

	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import {
		buildingDataCollectionKey,
		familyTreeDataCollectionKey,
		fetchImageMetaRegistry,
		fetchJsonFileList,
		imageMetaRegistryOptions,
		jdgBuildingDataRepoName,
		jdgRepoOwner,
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
		isAdminMode,
		allowTextSelection,
		showTimelineEventModal,
		isMobileBreakpoint,
		isTabletBreakpoint,
		isTimelineEventModalEditable,
		repoName as currentRepoName
	} from '$lib/stores/jdg-ui-store.js';

	import {
		addOrReplaceObjectByKeyValue,
		areObjectsEqual,
		deleteObjectByKeyValue,
		getImageMetaByKey,
		instantiateObject
	} from '$lib/jdg-utils.js';

	import {
		JDGBodyCopy,
		JDGButton,
		JDGCheckbox,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGH3H4,
		JDGImageAvatar,
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

	// Set the age suffixes for timeline events
	setContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_POSITIVE, 'after opening');
	setContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_NEGATIVE, 'before opening');

	/*** TIMELINE EVENT TYPE CONTEXT ***/
	// Define which event types should be available in the timeline event form
	// This context will be consumed by JDGTimelineEventForm (via JDGTimelineEventModal)
	// You can provide either an array of key strings or an object like jdgTimelineEventKeys
	// Example: Filter to only building-related event types
	const allowedEventTypeKeys = [
		// Building-specific events
		jdgTimelineEventKeys.opening,
		jdgTimelineEventKeys.closure,
		jdgTimelineEventKeys.demolition,
		jdgTimelineEventKeys.construction,
		jdgTimelineEventKeys.renovation,
		jdgTimelineEventKeys.planning,
		jdgTimelineEventKeys.rebrand,
		jdgTimelineEventKeys.ownershipChange,
		jdgTimelineEventKeys.ownershipNegotiation,
		jdgTimelineEventKeys.structural,
		// Generic events
		jdgTimelineEventKeys.generic,
		jdgTimelineEventKeys.article,
		jdgTimelineEventKeys.celebration,
		jdgTimelineEventKeys.legal,
		jdgTimelineEventKeys.media,
		jdgTimelineEventKeys.memory,
		jdgTimelineEventKeys.quote,
		jdgTimelineEventKeys.statistic
	];

	// Set the context for timeline event type keys
	// This will be available to all child components, including JDGTimelineEventForm
	setContext(JDG_CONTEXTS.TIMELINE_EVENT_TYPE_KEYS, allowedEventTypeKeys);

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
		// Don't overwrite if an operation is in progress or showing success
		const isInProgressStatus =
			$saveStatus === jdgSaveStatus.saving ||
			$saveStatus === jdgSaveStatus.loading ||
			$saveStatus === jdgSaveStatus.uploading;
		const isSuccessStatus =
			$saveStatus === jdgSaveStatus.saveSuccess ||
			$saveStatus === jdgSaveStatus.loadSucccess ||
			$saveStatus === jdgSaveStatus.saveSuccessRebuilding;

		// Only show the unsaved changes status if not saving or success
		if (hasUnsavedChanges && !isInProgressStatus && !isSuccessStatus) {
			saveStatus.set(jdgSaveStatus.unsavedChanges);
		} else if (!hasUnsavedChanges && !isInProgressStatus && !isSuccessStatus) {
			// Only clear the status if no operation is in progress and no success message is being shown
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
	let draftTimelineHostImageMetaRegistryRepoNameStore = writable();

	// Show timeline as preview only?
	let previewOnly = false;

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
	// Initialize draft form fields when local store is set (but draft is not)
	$: {
		if ($localTimelineHostStore !== undefined && $draftTimelineHost === undefined) {
			draftTimelineHostNameStore.set($localTimelineHostStore.name);
			draftTimelineHostInceptionDateStore.set($localTimelineHostStore.inceptionDate);
			draftTimelineHostCessationDateStore.set($localTimelineHostStore.cessationDate);
			draftTimelineHostImageMetaRegistryRepoNameStore.set(
				$localTimelineHostStore.imageMetaRegistryRepo
			);
		}
	}

	// Get the current avatar key - prefer draft when editing, otherwise use local store
	$: currentAvatarKey =
		$draftTimelineHost?.avatarImage ?? $localTimelineHostStore?.avatarImage ?? '';

	// Track fetched registry for form's imageMetaRegistryRepo
	let formHostRegistry = undefined;
	let lastFetchedFormRegistryRepo = undefined;

	// Fetch the host's registry when the selected registry changes
	async function loadFormHostRegistry(registryRepoName) {
		if (!registryRepoName || registryRepoName === $currentRepoName) {
			formHostRegistry = undefined;
			lastFetchedFormRegistryRepo = undefined;
			return;
		}
		if (registryRepoName === lastFetchedFormRegistryRepo && formHostRegistry) {
			return; // Already loaded
		}
		lastFetchedFormRegistryRepo = registryRepoName;
		try {
			formHostRegistry = await fetchImageMetaRegistry(registryRepoName);
		} catch (err) {
			console.error('Failed to fetch form host registry:', err);
			formHostRegistry = undefined;
		}
	}

	// Trigger registry fetch when the form's registry selection changes
	$: if ($draftTimelineHostImageMetaRegistryRepoNameStore) {
		loadFormHostRegistry($draftTimelineHostImageMetaRegistryRepoNameStore);
	}

	// Use fetched registry if available, otherwise fall back to local registry
	$: effectiveFormRegistry = formHostRegistry || imageMetaRegistry;

	// Resolve avatar image key to full imageMeta for display using effective registry
	$: avatarImageMeta = currentAvatarKey
		? getImageMetaByKey(effectiveFormRegistry, currentAvatarKey) ||
			getJdgImageMetaRegistry().jdg_avatar_placeholder
		: getJdgImageMetaRegistry().jdg_avatar_placeholder;

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
		title={'TIMELINE HOST COLLECTION'}
		subtitle={'Collections of people and buildings'}
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
					isEnabled={$isAdminMode}
					label={$draftTimelineHostCollection ? 'Save to Repo' : 'Set to Editing Store'}
					faIcon={$draftTimelineHostCollection ? 'fa-floppy-disk' : 'fa-pen-to-square'}
					tooltip={'Start editing this timeline host collection (admin mode required)'}
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
	<JDGContentBoxFloating title={'TIMELINE HOST'} subtitle={'People and buildings'}>
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
					<JDGInputContainer label="Image Meta Registry">
						<JDGSelect
							optionsGroup={imageMetaRegistryOptions}
							bind:inputValue={$draftTimelineHostImageMetaRegistryRepoNameStore}
							isEnabled={$draftTimelineHost !== undefined}
						/>
					</JDGInputContainer>
					<JDGInputContainer label="Avatar Image">
						<JDGImageAvatar
							imageMeta={avatarImageMeta}
							imageKey={currentAvatarKey}
							registryRepoName={$draftTimelineHostImageMetaRegistryRepoNameStore}
							size="100px"
							allowEditing={$draftTimelineHost !== undefined}
							onImageSelect={(newKey) => {
								console.log(
									'Form onImageSelect received:',
									newKey,
									'draft exists:',
									!!$draftTimelineHost
								);
								if ($draftTimelineHost) {
									console.log('Updating draft with new avatarImage:', newKey);
									draftTimelineHost.set({ ...$draftTimelineHost, avatarImage: newKey });
								}
							}}
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
							// Avatar will automatically reset via reactive derivation
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
					isEnabled={$isAdminMode}
					label={$draftTimelineHost ? 'Update in Host Collection' : 'Set to Editing Store'}
					tooltip={'Start editing this timeline host (admin mode required)'}
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
								// Add the current draft to the host collection (use draft, not local store)
								draftTimelineHostCollection.update((currentValue) => {
									addOrReplaceObjectByKeyValue(
										currentValue[selectedHostCollectionKey],
										'id',
										$draftTimelineHost.id,
										$draftTimelineHost
									);
									return currentValue;
								});
								// Set the local store to match the draft (preserve all changes including timelineEvents)
								localTimelineHostStore.set($draftTimelineHost);
								draftTimelineHost.set(undefined);
							}}
				/>
			</JDGModalActionsBar>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title={'TIMELINE'} subtitle={'Resulting timeline from the host above'}>
		<JDGBodyCopy textAlign="center" paddingTop="0" paddingBottom="0">
			<JDGInputContainer
				label="Preview Mode"
				hint="On hover or touch, displays an overlay that forces the timeline to launch in a modal"
				justification="center"
			>
				<JDGCheckbox
					label="Enable Preview Mode"
					bind:isChecked={previewOnly}
					justifyContent="center"
				/>
			</JDGInputContainer>
		</JDGBodyCopy>
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
			onAvatarChange={(newKey) => {
				// Update the draft store directly
				console.log(
					'Timeline onAvatarChange received:',
					newKey,
					'draft exists:',
					!!$draftTimelineHost
				);
				if ($draftTimelineHost) {
					console.log('Updating draft with new avatarImage from Timeline:', newKey);
					draftTimelineHost.set({ ...$draftTimelineHost, avatarImage: newKey });
				}
			}}
			{previewOnly}
			minHeight={'70svh'}
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
