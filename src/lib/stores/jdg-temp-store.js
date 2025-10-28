import { derived, writable } from 'svelte/store';

/*** ADMINISTRATION ***/
export let adminFormPassphrase = writable(undefined);

/*** SAVE STATUS ***/
export let saveStatus = writable(null);
export let saveFunction = writable(async () => {}); // what Save button should do

/*** IMAGE ***/
export let draftImageMeta = writable({});

/*** TIMELINE ***/
export let draftTimelineHostCollection = writable(undefined);
export let isTimelineHostDrafting = writable(false);
export let draftTimelineHost = writable(undefined); // the timeline host being edited
export let isTimelineEventDrafting = writable(false);
export let draftTimelineEvent = writable({}); // the timeline event being edited

// Create a combined store to display in footer dev tools
const storeMap = {
	// administration
	adminFormPassphrase,
	// save status
	saveStatus,
	// image
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
