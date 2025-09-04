import { writable } from 'svelte/store';

// timeline
export let timelineEditEvent = writable(undefined);
export let isTimelineEventInEditMode = writable(false);
