<script>
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';

	import { jdgTimelineEventKeys } from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import getJdgImageMetaRegistry from '$lib/jdg-image-meta-registry.js';

	import {
		draftImageMeta,
		draftTimelineEvent,
		draftTimelineImageMetaRegistry,
		draftTimelineImageRegistryRepo
	} from '$lib/stores/jdg-temp-store.js';
	import {
		imageViewerMeta,
		isAdminMode,
		isTimelineEventModalEditable,
		modalGradientColors,
		repoName as currentRepoName,
		showImageMetaModal,
		showTimelineEventModal,
		showImageViewerModal,
		timelineEventModalInceptionDate
	} from '$lib/stores/jdg-ui-store.js';

	import {
		generateGradient,
		getImageMetaByKey,
		getNumDaysBetweenDates,
		lightenColor,
		darkenColor
	} from '$lib/jdg-utils.js';
	import { fetchImageMetaRegistry } from '$lib/jdg-persistence-management.js';
	import { instantiateTimelineEvent } from '$lib/jdg-timeline-management.js';
	import {
		generateTimelineRowItems,
		getEarliestTimelineEvent,
		updateTimelineRowItems
	} from '$lib/jdg-ui-management.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGComposeToolbar,
		JDGFlyout,
		JDGImageAvatar,
		JDGModal,
		JDGPortal,
		JDGRandomGradient,
		JDGSaveStateBanner,
		JDGSlider,
		JDGTimelineEvent,
		JDGTimelineEventModal
	} from '$lib/index.js';
	import {
		jdgBreakpoints,
		jdgColors,
		jdgDurations,
		jdgQuantities,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';

	// Timeline host contains events and event references
	export let timelineHost;
	// Optionally include contextual events
	export let contextEvents = timelineHost.contextualEvents;
	// Whether to show the name of the timeline host at the top
	export let showTitleBar = true;
	// Whether the ComposeToolbar is shown
	export let allowEditing = true;
	// If true, users can click TimelineEvents to see more detail
	export let isInteractive = true;
	// Width and height for timeline interface
	export let width = '100%';
	export let minHeight = '50svh';
	export let maxHeight = '50svh';
	// When true, this timeline is a preview
	// with a button to open it in a modal for a better experience
	export let previewOnly = false;
	// The duration of the preview overlay in milliseconds
	export let previewOverlayDuration = 500;

	export let onClickInceptionEvent = () => {};
	export let addClickAddEvent = () => {};
	// Called when a new avatar is selected (passes the new image key)
	export let onAvatarChange = undefined;

	// State for hover overlay and modal
	let isHovering = false;
	let showTimelineModal = false;

	/*** Eventually needed, but not developed yet ***/
	// export let onClickEventRefHost = () => {};
	// export let onClickAssociatedHost = () => {};

	const rowHeightEmptyPx = 3;
	const rowHeightFilledPx = 80;

	const timelineBackgroundColor = 'rgba(225, 225, 225, 1)';

	// Calculate gradient colors based on background color
	// Lighter gray -> current gray -> darker gray
	$: timelineGradientColor1 = lightenColor(timelineBackgroundColor, 0.15); // lighter
	$: timelineGradientColor2 = timelineBackgroundColor; // current (middle)
	$: timelineGradientColor3 = darkenColor(timelineBackgroundColor, 0.15); // darker

	// set up the inception and cessation events
	let emptyStateEvent;
	let todayEvent;

	// Get the app-level image registry from context (for when timeline uses same repo as current website)
	const contextImageMetaRegistry = getContext(JDG_CONTEXTS.IMAGE_META_REGISTRY);

	// Timeline image registry - either from context (same repo) or fetched (different repo)
	let timelineImageMetaRegistry = undefined;
	let lastFetchedRegistryRepoName = undefined;

	async function loadTimelineImageMetaRegistry(registryRepoName) {
		if (!registryRepoName) {
			timelineImageMetaRegistry = undefined;
			lastFetchedRegistryRepoName = undefined;
			return;
		}

		// If the timeline uses the same repo as the current website, use the already-loaded context registry
		if (registryRepoName === $currentRepoName) {
			timelineImageMetaRegistry = contextImageMetaRegistry;
			lastFetchedRegistryRepoName = registryRepoName;
			return;
		}

		if (registryRepoName === lastFetchedRegistryRepoName && timelineImageMetaRegistry) {
			return; // Already loaded
		}
		lastFetchedRegistryRepoName = registryRepoName;
		try {
			// fetchImageMetaRegistry caches results, so this is efficient even for repeated calls
			timelineImageMetaRegistry = await fetchImageMetaRegistry(registryRepoName);
		} catch (err) {
			console.error('Failed to fetch timeline registry:', err);
			timelineImageMetaRegistry = undefined;
		}
	}

	// Fetch the timeline's registry when the host's registry repo is set/changes
	$: if (timelineHost?.imageMetaRegistryRepo) {
		loadTimelineImageMetaRegistry(timelineHost.imageMetaRegistryRepo);
	}

	// Create a store for the timeline's registry and set it as context
	// This allows child components to access the registry once loaded
	const timelineImageRegistryStore = writable(undefined);
	setContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY, timelineImageRegistryStore);

	// Also set the registry repo name as context for JDGImage to use when opening ImageMetaModal
	const timelineImageRegistryRepoStore = writable(undefined);
	setContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY_REPO, timelineImageRegistryRepoStore);

	// Update the context stores when registry loads
	$: timelineImageRegistryStore.set(timelineImageMetaRegistry);
	$: timelineImageRegistryRepoStore.set(timelineHost?.imageMetaRegistryRepo);

	// Resolve avatar image from timelineHost's avatarImage key using the timeline registry
	$: avatarImageMeta =
		timelineHost?.avatarImage && timelineImageMetaRegistry
			? getImageMetaByKey(timelineImageMetaRegistry, timelineHost.avatarImage) ||
				getJdgImageMetaRegistry().jdg_avatar_placeholder
			: getJdgImageMetaRegistry().jdg_avatar_placeholder;

	const avatarHeight = '30px';
	const onClickAvatar = () => {
		if ($isAdminMode) {
			draftImageMeta.set(avatarImageMeta);
			// Set the timeline's registry context for the ImageMetaModal
			draftTimelineImageMetaRegistry.set(timelineImageMetaRegistry);
			draftTimelineImageRegistryRepo.set(timelineHost?.imageMetaRegistryRepo);
			showImageMetaModal.set(true);
		} else {
			imageViewerMeta.set(avatarImageMeta);
			showImageViewerModal.set(true);
		}
	};

	let timelineWrapperRef;
	let timelineContainerRef;
	let scrollingCanvasDivRef;

	// Whether relative spacing is enabled
	let useRelativeSpacing = false;
	// Spacing multiplier (zoom) value from 0 to 1
	// Only applies when useRelativeSpacing is true
	// Multiplies the relative spacing effect
	let timelineZoom = 0;
	// Remember the last zoom value before unchecking, so we can restore it
	let lastZoomValue = 0;

	// EVENT GRADIENTS
	// Number of gradient points per event (default: 3)
	const gradientPointsCount = 3;
	// Each event gradients between its normal color
	// and a color this far toward the other color
	const gradientMirrorFactor = 2.5;

	// Row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// Timeline events will each have a slightly different color
	// along a gradient defined here
	let timelineEventColors = [];

	// Preview overlay handlers
	let previewOverlayTimeout;

	// Show the overlay
	const showPreviewOverlay = () => {
		if (previewOnly && !showTimelineModal) {
			if (previewOverlayTimeout) {
				clearTimeout(previewOverlayTimeout);
				previewOverlayTimeout = null;
			}
			isHovering = true;
		}
	};

	// Hide the overlay after a delay
	const hidePreviewOverlayAfterDelay = () => {
		if (previewOnly && isHovering) {
			if (previewOverlayTimeout) {
				clearTimeout(previewOverlayTimeout);
			}
			previewOverlayTimeout = setTimeout(() => {
				isHovering = false;
				previewOverlayTimeout = null;
			}, previewOverlayDuration);
		}
	};

	// Open the modal (clicking the overlay button)
	const openTimelineModal = () => {
		if (previewOverlayTimeout) {
			clearTimeout(previewOverlayTimeout);
			previewOverlayTimeout = null;
		}
		showTimelineModal = true;
		isHovering = false;
	};

	const onZoomChange = (newValue) => {
		timelineZoom = newValue;
	};

	const onCheckRelativeSpacing = () => {
		useRelativeSpacing = true;
		// Restore the last zoom value, or use the calculated default if we don't have one
		if (lastZoomValue > 0) {
			timelineZoom = lastZoomValue;
		} else {
			// Recalculate default zoom if we don't have a saved value
			const calculatedZoom = calculateDefaultZoom();
			if (calculatedZoom !== undefined && calculatedZoom > 0) {
				timelineZoom = Math.min(0.9, Math.max(0, calculatedZoom));
				lastZoomValue = timelineZoom;
			}
		}
	};

	const onUncheckRelativeSpacing = () => {
		// Save the current zoom value before disabling
		if (timelineZoom > 0) {
			lastZoomValue = timelineZoom;
		}
		useRelativeSpacing = false;
		// Reset zoom to 0 when relative spacing is disabled (but we saved it in lastZoomValue)
		timelineZoom = 0;
	};

	// Track the last timelineHost ID to detect when it changes
	let lastTimelineHostId = null;

	// Calculate zoom based on event count
	const calculateDefaultZoom = () => {
		if (!timelineHost) return 0;

		// Count events from the raw timelineHost data
		const rawEventCount =
			(timelineHost.timelineEvents?.length || 0) +
			(timelineHost.timelineEventReferences?.length || 0);

		// Account for inception and today events
		const earliestEvent = getEarliestTimelineEvent(timelineHost.timelineEvents);
		const hasInceptionEvent =
			timelineHost.timelineEvents.length === 0 ||
			getNumDaysBetweenDates(timelineHost.inceptionDate, earliestEvent?.date) > 0;
		const hasTodayEvent = !timelineHost?.cessationDate || timelineHost.cessationDate === '';
		const totalEvents = rawEventCount + (hasInceptionEvent ? 1 : 0) + (hasTodayEvent ? 1 : 0);

		// Skip if no events
		if (totalEvents === 0) {
			return 0;
		}

		// Calculate zoom based purely on event count
		// Formula: 100 events → 0.5 zoom
		// For small counts (< 5), use zoom = 0
		// For 5-100 events: zoom scales linearly from 0 to 0.5
		// For 100+ events: zoom scales from 0.5 to 0.9

		if (totalEvents < 5) {
			return 0;
		} else if (totalEvents <= 100) {
			// Linear from 5 events (zoom 0) to 100 events (zoom 0.5)
			// zoom = 0.5 * ((totalEvents - 5) / (100 - 5))
			return 0.5 * ((totalEvents - 5) / 95);
		} else {
			// For 100+ events, scale from 0.5 to 0.9
			// Using a range: 100 events = 0.5, 200 events = 0.9
			const excessOver100 = totalEvents - 100;
			const additionalZoom = 0.4 * Math.min(1, excessOver100 / 100);
			return 0.5 + additionalZoom;
		}
	};

	// Reset and recalculate zoom when timelineHost changes
	// Watch the timelineHost ID to detect changes
	$: currentTimelineHostId = timelineHost?.id;
	$: if (timelineHost && currentTimelineHostId !== lastTimelineHostId) {
		lastTimelineHostId = currentTimelineHostId;
		const calculatedZoom = calculateDefaultZoom();
		if (calculatedZoom !== undefined) {
			const newZoom = Math.min(0.9, Math.max(0, calculatedZoom));
			timelineZoom = newZoom;
			lastZoomValue = newZoom; // Save the calculated zoom value
			// Enable relative spacing if zoom > 0
			useRelativeSpacing = calculatedZoom > 0;
		}
	}

	// DYNAMIC STYLES

	const timelineContainerCss = css`
		width: ${width};
		min-height: ${minHeight};
		max-height: ${maxHeight};
		background-color: ${timelineBackgroundColor};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
	`;

	const timelineTitleBarCss = css`
		background-color: ${lightenColor(timelineBackgroundColor, 0.03)};
	`;

	const timelineEventCountCss = css`
		margin-left: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
	`;

	// font sizing for number of events, timeline options
	const timelineSupportingTextCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyXSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodySm};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodySm};
		}
	`;

	// Timeline spine styling
	let spineContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 4 +
			jdgSizes.ntimelineEventYearWidthSm +
			jdgSizes.nTimelineSpineWidth +
			jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 4 +
			jdgSizes.ntimelineEventYearWidthMd +
			jdgSizes.nTimelineSpineWidth +
			jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			margin-left: ${jdgSizes.nTimelineEventGapSize / 2 +
			jdgSizes.ntimelineEventYearWidthLg +
			jdgSizes.nTimelineSpineWidth * 2 +
			jdgSizes.timelineUnit};
		}
	`;

	let spineColumnCss = css`
		width: ${jdgSizes.timelineSpineWidth};
	`;

	// Keep timeline event grid updated
	let timelineEventGridCss;
	$: {
		// Ensure custom css is kept updated
		// If relative spacing is off OR zoom is 0, use static spacing
		// If relative spacing is on AND zoom > 0, use zoom to multiply the spacing effect
		const staticGap = 20;
		const baseRelativeGap = rowHeightEmptyPx; // 3px

		if (!useRelativeSpacing || timelineZoom === 0) {
			// Static spacing: fixed gap, space-between alignment
			// This happens when checkbox is unchecked OR slider is at 0
			timelineEventGridCss = css`
				row-gap: ${staticGap}px;
				align-content: space-between;
			`;
		} else {
			// Relative spacing: gap scales with zoom, start alignment
			// As zoom increases, gap increases: 3px * (1 + zoom * 2) = 3px to 9px
			const blendedGap = baseRelativeGap * (1 + timelineZoom * 2);
			timelineEventGridCss = css`
				row-gap: ${blendedGap}px;
				align-content: start;
			`;
		}
	}

	// Keep emptyState and today events updated
	// Include useRelativeSpacing and timelineZoom as dependencies to recalculate when changed
	$: {
		// Use relative spacing if checkbox is checked
		// Zoom only applies when relative spacing is enabled

		// Use whichever is earlier: the inception date or the earliest event date
		// This handles cases where events (like planning) occur before the inception date
		const earliestEvent = getEarliestTimelineEvent(timelineHost.timelineEvents);
		let earliestOrInceptionDate;
		if (!timelineHost?.inceptionDate || timelineHost.inceptionDate === '') {
			// No inception date, use earliest event
			earliestOrInceptionDate = earliestEvent?.date;
		} else if (!earliestEvent?.date) {
			// No events, use inception date
			earliestOrInceptionDate = timelineHost.inceptionDate;
		} else {
			// Both exist - use whichever is earlier
			const inceptionTime = new Date(timelineHost.inceptionDate).getTime();
			const earliestEventTime = new Date(earliestEvent.date).getTime();
			earliestOrInceptionDate =
				earliestEventTime < inceptionTime ? earliestEvent.date : timelineHost.inceptionDate;
		}

		// If there are no timeline events,
		// or if there's no event on the inception date,
		// show an inception event
		if (
			timelineHost.timelineEvents.length === 0 ||
			getNumDaysBetweenDates(timelineHost.inceptionDate, earliestEvent.date) > 0
		) {
			emptyStateEvent = instantiateTimelineEvent(jdgTimelineEventKeys.inception);
			emptyStateEvent.date = timelineHost.inceptionDate;
		} else {
			emptyStateEvent = undefined;
		}

		// If there's no cessation date, show a Today event
		if (timelineHost?.cessationDate === '' || !timelineHost?.cessationDate) {
			todayEvent = instantiateTimelineEvent(jdgTimelineEventKeys.today);
			todayEvent.type = jdgTimelineEventKeys.today;
		} else {
			todayEvent = undefined;
		}

		// Convert events to timeline row items
		// When relative spacing is on AND zoom > 0, keep proportional indices for date-based spacing
		// When off OR zoom is 0, use sequential indices for even distribution
		const shouldUseRelativeSpacing = useRelativeSpacing && timelineZoom > 0;
		let rowItems = updateTimelineRowItems(
			generateTimelineRowItems(timelineHost, contextEvents, earliestOrInceptionDate),
			!shouldUseRelativeSpacing // use sequential indices when NOT using relative spacing
		);

		// If using relative spacing with zoom > 0, scale the indices by zoom to multiply the spacing effect
		// This makes items that are farther apart in time move even farther apart visually
		if (shouldUseRelativeSpacing) {
			// Scale indices: zoom 0 = no scaling, zoom 1 = full scaling
			// Use a multiplier that increases spacing (e.g., 1 + zoom means 2x spacing at max zoom)
			const spacingMultiplier = 1 + timelineZoom;
			const firstIndex = rowItems.length > 0 ? rowItems[0].index : 1;
			for (let i = 0; i < rowItems.length; i++) {
				// Scale the index relative to the first index to preserve relative spacing
				const relativeIndex = rowItems[i].index - firstIndex;
				rowItems[i].index = firstIndex + Math.round(relativeIndex * spacingMultiplier);
			}
		}

		timelineRowItems = rowItems;
	}

	// Compute the todayEvent row index based on spacing mode
	// Sequential mode: place after all events
	// Relative mode: place at the end of the proportional grid (row 1001)
	let todayEventRowIndex;
	$: {
		const shouldUseRelativeSpacing = useRelativeSpacing && timelineZoom > 0;
		todayEventRowIndex = shouldUseRelativeSpacing
			? jdgQuantities.initialTimelineRowCount + 1
			: timelineRowItems.length + (emptyStateEvent ? 1 : 0) + 1;
	}

	$: {
		// Generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			timelineHost?.timelineEvents?.length +
				(emptyStateEvent ? 1 : 0) +
				(todayEvent ? 2 : 0) /* account for birth and death */,
			jdgColors.timelineEventColorGradient1,
			jdgColors.timelineEventColorGradient2,
			jdgColors.timelineEventColorGradient3
		);
	}

	// Pre-calculate all event colors and their mirror colors
	let eventColorPairs = [];
	$: {
		if (timelineEventColors.length === 0) {
			eventColorPairs = [];
		} else {
			const pairs = [];
			const middleIndex = Math.floor(timelineEventColors.length / 2);
			const spectrumIncrement = Math.max(
				1,
				Math.round(gradientMirrorFactor * (timelineEventColors.length / 10))
			);

			// Calculate color pair for emptyStateEvent (if exists)
			if (emptyStateEvent) {
				const colorIndex = 0;
				const targetIndex =
					colorIndex < middleIndex
						? Math.min(colorIndex + spectrumIncrement, timelineEventColors.length - 1)
						: Math.max(colorIndex - spectrumIncrement, 0);
				pairs.push({
					backgroundColor: timelineEventColors[colorIndex],
					gradientMirrorColor: timelineEventColors[targetIndex]
				});
			}

			// Calculate color pairs for all timeline row items
			for (let i = 0; i < timelineRowItems.length; i++) {
				const colorIndex = (emptyStateEvent ? 1 : 0) + i;
				const targetIndex =
					colorIndex < middleIndex
						? Math.min(colorIndex + spectrumIncrement, timelineEventColors.length - 1)
						: Math.max(colorIndex - spectrumIncrement, 0);
				pairs.push({
					backgroundColor: timelineEventColors[colorIndex],
					gradientMirrorColor: timelineEventColors[targetIndex]
				});
			}

			// Calculate color pair for todayEvent (if exists)
			if (todayEvent) {
				const colorIndex = timelineEventColors.length - 1;
				const targetIndex =
					colorIndex < middleIndex
						? Math.min(colorIndex + spectrumIncrement, timelineEventColors.length - 1)
						: Math.max(colorIndex - spectrumIncrement, 0);
				pairs.push({
					backgroundColor: timelineEventColors[colorIndex],
					gradientMirrorColor: timelineEventColors[targetIndex]
				});
			}

			eventColorPairs = pairs;
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={timelineWrapperRef}
	class="timeline-wrapper {previewOnly ? 'preview-only' : ''}"
	on:mouseenter={showPreviewOverlay}
	on:mouseleave={hidePreviewOverlayAfterDelay}
	on:touchstart={showPreviewOverlay}
	on:touchend={hidePreviewOverlayAfterDelay}
	on:touchcancel={hidePreviewOverlayAfterDelay}
	role={previewOnly ? 'button' : 'region'}
	tabindex={previewOnly ? 0 : undefined}
>
	<JDGSaveStateBanner scrollOnStatusChange={false} />
	<!-- Hover overlay for previewOnly mode -->
	{#if previewOnly && isHovering}
		<div
			class="timeline-hover-overlay"
			transition:fade={{ duration: jdgDurations.default }}
			on:click={openTimelineModal}
			on:keydown={(e) => e.key === 'Enter' && openTimelineModal()}
			role="button"
			tabindex="0"
		>
			<JDGButton
				onClickFunction={openTimelineModal}
				label="Open timeline"
				faIcon="fa-expand"
				shadow={true}
			/>
		</div>
	{/if}
	<!-- Title Bar-->
	{#if showTitleBar}
		<div class="timeline-title-bar {timelineTitleBarCss}">
			<!-- Avatar -->
			<JDGImageAvatar
				registryRepoName={timelineHost?.imageMetaRegistryRepo}
				imageMeta={avatarImageMeta}
				imageKey={timelineHost?.avatarImage || ''}
				size={avatarHeight}
				onClickFunction={onClickAvatar}
				allowEditing={allowEditing && onAvatarChange !== undefined}
				onImageSelect={onAvatarChange}
			/>
			<div class="timeline-title">
				{timelineHost.name}
			</div>
		</div>
	{/if}
	<div bind:this={timelineContainerRef} class="timeline-container {timelineContainerCss}">
		<!-- Background gradient -->
		<div class="timeline-background-gradient">
			<JDGRandomGradient
				numberOfPoints={3}
				edgeBufferRatio={0.1}
				color1={timelineGradientColor1}
				color2={timelineGradientColor2}
				color3={timelineGradientColor3}
			/>
		</div>
		<!-- ComposeToolbar if editing is allowed -->
		{#if allowEditing}
			<JDGComposeToolbar
				parentRef={timelineWrapperRef}
				composeButtonFaIcon={'fa-plus fa-fw'}
				composeButtonTooltip={'Add a new event'}
				onClickCompose={addClickAddEvent}
				zIndex={10}
			/>
		{/if}
		<!-- Actions Bar -->
		<div
			class="timeline-actions-bar {timelineSupportingTextCss}"
			style="position: relative; z-index: 1;"
		>
			<div class="timeline-event-count {timelineEventCountCss}">
				Showing {timelineRowItems.length + (emptyStateEvent ? 1 : 0) + (todayEvent ? 1 : 0)} timeline
				events
			</div>
			<!-- Timeline Options Flyout -->
			<JDGFlyout
				tooltip="Timeline options"
				flyoutTitle="Timeline Options"
				flyoutPosition="bottom-left"
			>
				<div class="timeline-options-controls">
					<JDGCheckbox
						isEnabled={true}
						showLabel={true}
						label="Relative spacing"
						isChecked={useRelativeSpacing}
						onCheckAction={onCheckRelativeSpacing}
						onUncheckAction={onUncheckRelativeSpacing}
						labelFontSize="14px"
					/>
					<JDGSlider
						label="Spacing multiplier"
						bind:value={timelineZoom}
						min={0}
						max={1}
						step={0.01}
						onChange={onZoomChange}
						isEnabled={useRelativeSpacing}
					/>
				</div>
			</JDGFlyout>
		</div>
		<!-- Timeline: A collection of TimelineEvents shown chronologically -->
		<div class="timeline-content-container" style="position: relative; z-index: 1;">
			<div class="timeline-spine {spineContainerCss}">
				<div class="timeline-spine-line-column {spineColumnCss}">
					<div class="timeline-spine-line" />
				</div>
			</div>
			<div class="timeline-scrolling-canvas" bind:this={scrollingCanvasDivRef}>
				<!-- The grid containing all timeline events -->
				<div class="timeline-event-grid {timelineEventGridCss}">
					<!-- If there are no events, make an empty state event at the top -->
					{#if emptyStateEvent && eventColorPairs.length > 0}
						<JDGTimelineEvent
							{timelineHost}
							timelineEvent={emptyStateEvent}
							onClickTimelineEvent={isInteractive && allowEditing
								? onClickInceptionEvent
								: () => {}}
							isInteractive={isInteractive && allowEditing && $isAdminMode}
							rowIndex={0}
							gradientColor1={eventColorPairs[0].backgroundColor}
							gradientColor2={eventColorPairs[0].gradientMirrorColor}
							{gradientPointsCount}
						/>
					{/if}
					<!-- All timeline events saved to the host -->
					{#each timelineRowItems as timelineRowItem, i}
						{@const colorPairIndex = (emptyStateEvent ? 1 : 0) + i}
						<!-- Use a key to ensure the UI reacts when these values change -->
						{#key `${timelineHost.id}-${timelineRowItem.event.id}`}
							<JDGTimelineEvent
								{timelineHost}
								timelineEvent={timelineRowItem.event}
								onClickTimelineEvent={() => {
									draftTimelineEvent.set(timelineRowItem.event);
									// Store the gradient colors for this event's modal
									const colorPair = eventColorPairs[colorPairIndex];
									if (colorPair) {
										modalGradientColors.set({
											color1: colorPair.backgroundColor,
											color2: colorPair.gradientMirrorColor,
											color3: colorPair.backgroundColor
										});
									}
									showTimelineEventModal.set(true);
									isTimelineEventModalEditable.set(allowEditing);
									timelineEventModalInceptionDate.set(timelineHost.inceptionDate);
								}}
								rowIndex={timelineRowItem.index}
								gradientColor1={eventColorPairs[colorPairIndex]?.backgroundColor}
								gradientColor2={eventColorPairs[colorPairIndex]?.gradientMirrorColor}
								eventReference={timelineRowItem.eventReference}
								isInteractive={isInteractive || $isAdminMode}
								{gradientPointsCount}
							/>
						{/key}
					{/each}
					<!-- Show the today event if there's no cessation date provided -->
					{#if (timelineHost.cessationDate === '' || (!timelineHost?.cessationDate && todayEvent)) && eventColorPairs.length > 0}
						{@const todayColorPairIndex = eventColorPairs.length - 1}
						<JDGTimelineEvent
							{timelineHost}
							timelineEvent={todayEvent}
							rowIndex={todayEventRowIndex}
							gradientColor1={eventColorPairs[todayColorPairIndex].backgroundColor}
							gradientColor2={eventColorPairs[todayColorPairIndex].gradientMirrorColor}
							{gradientPointsCount}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal for full timeline view - portaled to JDGAppContainer for proper positioning -->
{#if showTimelineModal}
	<JDGPortal>
		<JDGModal
			title={null}
			subtitle={null}
			onClickCloseButton={() => (showTimelineModal = false)}
			backgroundColor="rgba(245, 245, 245, 1)"
			width="90vw"
			height="85dvh"
			maxWidth="none"
			overflow={'hidden'}
		>
			<div slot="modal-content-slot" class="timeline-modal-content">
				<svelte:self
					{timelineHost}
					{contextEvents}
					{showTitleBar}
					{allowEditing}
					{isInteractive}
					width="100%"
					minHeight="70dvh"
					maxHeight="75dvh"
					{onClickInceptionEvent}
					{addClickAddEvent}
					{gradientPointsCount}
				/>
			</div>
		</JDGModal>
	</JDGPortal>
{/if}

<!-- Timeline Event Modal - rendered here so it can access timeline context -->
<!-- Portal renders DOM at body level while preserving component hierarchy for context -->
{#if $showTimelineEventModal}
	<JDGPortal>
		<JDGTimelineEventModal />
	</JDGPortal>
{/if}

<style>
	.timeline-wrapper {
		position: relative;
		height: -webkit-fill-available;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	/* Prevent internal timeline scrolling when in preview-only mode */
	.timeline-wrapper.preview-only .timeline-scrolling-canvas {
		overflow: hidden;
	}

	.timeline-hover-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(2px);
		z-index: 10;
		border-radius: 10px;
		cursor: pointer;
	}

	.timeline-modal-content {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.timeline-title-bar {
		padding: 10px 10px 20px 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px 10px 0 0;
		margin-bottom: -10px;
		gap: 10px;
	}

	.timeline-container {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 0.5rem;
		box-sizing: border-box;
		border-radius: 10px;
		overflow: hidden;
	}

	.timeline-background-gradient {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.timeline-actions-bar {
		display: flex;
		justify-content: right;
		column-gap: 0.5rem;
	}

	.timeline-event-count {
		display: flex;
		flex-grow: 1;
		align-items: center;
	}

	.timeline-content-container {
		position: relative;
		display: flex;
		/* Use flex: 1 with min-height: 0 for proper iOS flex shrinking */
		flex: 1 1 0%;
		min-height: 0;
		overflow: hidden;
	}

	.timeline-scrolling-canvas {
		position: relative;
		/* Use flex: 1 with min-height: 0 for proper iOS scrolling */
		flex: 1 1 0%;
		min-height: 0;

		display: flex;
		overflow: auto;
		/* Ensure iOS respects the scroll container bounds */
		-webkit-overflow-scrolling: touch;
	}

	.timeline-event-grid {
		display: grid;
		grid-template-columns: 1fr;
		flex-grow: 1;
		/* align-content is set dynamically based on timelineZoom */
	}

	.timeline-spine {
		position: absolute;
		display: flex;
		/* Use top/bottom instead of height: inherit for flex parent compatibility */
		top: 0;
		bottom: 0;
		background: linear-gradient(
			to bottom,
			rgba(255, 0, 0, 0) 0%,
			rgba(200, 200, 200, 0.75) 20px,
			rgba(200, 200, 200, 0.7) calc(100% - 20px),
			rgba(255, 0, 0, 0) 100%
		);
	}

	.timeline-spine-line-column {
		display: flex;
	}

	.timeline-options-controls {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding: 8px 0;
	}
</style>
