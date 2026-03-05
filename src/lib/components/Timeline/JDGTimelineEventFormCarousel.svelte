<script>
	import { get } from 'svelte/store';
	import { onDestroy } from 'svelte';
	import { css } from '@emotion/css';
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';
	import { JDGTimelineEventForm } from '$lib/index.js';

	export let events = [];
	export let eventStore;

	// Pass-through props for the form
	export let isEditable = false;
	export let isEditing = false;

	$: carouselStyles = css`
		display: flex;
		flex-direction: row;
		align-items: stretch;
		width: 100%;
		min-height: 0;

		.form-container {
			flex: 1 1 auto;
			min-width: 0;
			padding-left: 10px;
			padding-right: 10px;
			box-sizing: border-box;
		}
	`;

	$: currentIndex = (() => {
		if (!Array.isArray(events) || events.length === 0) return 0;
		const current = get(eventStore);
		if (!current?.id) return 0;
		const idx = events.findIndex((e) => e?.id === current.id);
		return idx >= 0 ? idx : 0;
	})();

	$: canGoPrev = currentIndex > 0;
	$: canGoNext = currentIndex < events.length - 1 && events.length > 1;

	function goPrev() {
		if (!canGoPrev) return;
		const prevEvent = events[currentIndex - 1];
		if (prevEvent) eventStore.set(prevEvent);
	}

	function goNext() {
		if (!canGoNext) return;
		const nextEvent = events[currentIndex + 1];
		if (nextEvent) eventStore.set(nextEvent);
	}

	// Drive the global carousel nav store so JDGModal can show prev/next at its edges
	$: carouselNav.set({
		goPrev,
		goNext,
		canGoPrev,
		canGoNext
	});

	onDestroy(() => {
		carouselNav.set(null);
	});
</script>

<div class={carouselStyles}>
	<div class="form-container">
		<JDGTimelineEventForm {eventStore} {isEditable} {isEditing} />
	</div>
</div>
