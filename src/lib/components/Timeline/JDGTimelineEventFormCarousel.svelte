<script>
	import { get } from 'svelte/store';
	import { JDGButton, JDGTimelineEventForm } from '$lib/index.js';

	/** @type {Array<Record<string, unknown>>} */
	export let events = [];
	/** @type {import('svelte/store').Writable<Record<string, unknown>>} */
	export let eventStore;

	// Pass-through props for the form
	export let isEditable = true;
	export let isEditing = false;

	// Arrow button padding from viewport edge (e.g. 16px or 1rem)
	export let edgePadding = '1rem';

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
</script>

<div class="carousel-wrapper">
	{#if canGoPrev}
		<div class="arrow arrow-left" style="left: {edgePadding};">
			<JDGButton
				label={null}
				faIcon="fa-chevron-left"
				onClickFunction={goPrev}
				isPrimary={false}
				doForceSquareAspect={true}
				tooltip="Previous event"
			/>
		</div>
	{/if}

	<div class="form-container">
		<JDGTimelineEventForm
			{eventStore}
			{isEditable}
			{isEditing}
		/>
	</div>

	{#if canGoNext}
		<div class="arrow arrow-right" style="right: {edgePadding};">
			<JDGButton
				label={null}
				faIcon="fa-chevron-right"
				onClickFunction={goNext}
				isPrimary={false}
				doForceSquareAspect={true}
				tooltip="Next event"
			/>
		</div>
	{/if}
</div>

<style>
	.carousel-wrapper {
		position: relative;
		width: 100%;
		min-height: 0;
		display: flex;
		align-items: stretch;
		justify-content: center;
	}

	.form-container {
		flex: 1 1 auto;
		min-width: 0;
	}

	.arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		flex-shrink: 0;
	}

</style>
