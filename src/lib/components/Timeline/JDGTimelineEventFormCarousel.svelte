<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';
	import { JDGButton, JDGTimelineEventForm } from '$lib/index.js';

	export let events = [];
	export let eventStore;

	// Pass-through props for the form
	export let isEditable = false;
	export let isEditing = false;

	// Single source of truth for arrow button/column width; used for column width and form side padding
	export let arrowColumnWidth = '4rem';

	$: carouselStyles = css`
		--carousel-arrow-column-width: ${arrowColumnWidth};
		display: flex;
		flex-direction: row;
		align-items: stretch;
		width: 100%;
		min-height: 0;

		.arrow-column {
			flex-shrink: 0;
			width: ${arrowColumnWidth};
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 0;
			overflow: visible;
		}

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
</script>

<div class={carouselStyles}>
	<div class="arrow-column arrow-column-left">
		<JDGButton
			label={null}
			faIcon="fa-chevron-left"
			onClickFunction={goPrev}
			isEnabled={canGoPrev}
			isPrimary={false}
			doForceSquareAspect={true}
			tooltip="Previous event"
			paddingLeftRight="10px"
			paddingTopBottom="10px"
		/>
	</div>

	<div class="form-container">
		<JDGTimelineEventForm {eventStore} {isEditable} {isEditing}/>
	</div>

	<div class="arrow-column arrow-column-right">
		<JDGButton
			label={null}
			faIcon="fa-chevron-right"
			onClickFunction={goNext}
			isEnabled={canGoNext}
			isPrimary={false}
			doForceSquareAspect={true}
			tooltip="Next event"
			paddingLeftRight="10px"
			paddingTopBottom="10px"
		/>
	</div>
</div>
