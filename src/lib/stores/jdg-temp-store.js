import { derived, writable } from 'svelte/store';

/*** ADMINISTRATION ***/
export let adminFormPassphrase = writable(undefined);

/*** SAVE STATUS ***/
// Is the app saving, loading, uploading...?
export let saveStatus = writable(null);
// When an image is saved, also do this
export let saveFunction = writable(async () => {});

/*** IMAGE ***/
// Read and write source when editing an imageMeta
export let draftImageMeta = writable(undefined);

/*** TIMELINE ***/
export let draftTimelineHostCollection = writable(undefined);
export let isTimelineHostDrafting = writable(false);
export let draftTimelineHost = writable(undefined); // the timeline host being edited
export let isTimelineEventDrafting = writable(false);
export let draftTimelineEvent = writable(); // the timeline event being edited

// Create a combined store to display in footer dev tools
const storeMap = {
	// administration
	adminFormPassphrase,
	// save status
	saveStatus,
	// image meta editing
	draftImageMeta,
	// timeline
	draftTimelineHostCollection,
	isTimelineHostDrafting,
	draftTimelineHost,
	isTimelineEventDrafting,
	draftTimelineEvent
};
const tempStoreEntries = Object.entries(storeMap);
// derived store containing all ui state values
export let allTempStoreValues = derived(
	tempStoreEntries.map(([key, store]) => store),
	($stores) => Object.fromEntries(tempStoreEntries.map(([key], index) => [key, $stores[index]]))
);
