<script>
	import { getContext, setContext, onDestroy, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';

	import timelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import getJdgImageMetaRegistry from '$lib/jdg-image-meta-registry.js';

	import {
		draftImageMeta,
		draftTimelineEvent,
		draftTimelineHost,
		timelineEventsOrdered,
		draftImageMetaRegistry,
		draftImageRegistryRepo
	} from '$lib/stores/jdg-temp-store.js';
	import { get } from 'svelte/store';
	import {
		imageViewerMeta,
		isAdminMode,
		isTimelineEventModalEditable,
		modalGradientColors,
		repoName as currentRepoName,
		showImageEditButtons,
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
		getDecadeStartYearFromTimelineEvent,
		getEarliestTimelineEvent,
		updateTimelineRowItems
	} from '$lib/jdg-ui-management.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGComposeToolbar,
		JDGFlyout,
		JDGImageAvatar,
		JDGInputContainer,
		JDGLoadingSpinner,
		JDGModal,
		JDGPortal,
		JDGRandomGradient,
		JDGSaveStateBanner,
		JDGSlider,
		JDGTextInput,
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

	// Timeline host contains events and event references.
	// Three-state prop:
	//   undefined (default) → data not yet available → shows loading spinner
	//   null → explicitly no data → shows "No timeline data" message
	//   object → timeline host data → renders the timeline
	export let timelineHost;
	// Allowed event type keys for this timeline (fallback when TIMELINE_EVENT_TYPE_KEYS context is unset); mirrors JDGTimelineEventForm
	export let eventTypeKeys = jdgTimelineEventKeys;
	// Optionally include contextual events
	export let contextEvents = timelineHost?.contextualEvents;
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
	// Set true when this instance is the one rendered inside the full-screen modal (do not set from outside; used by svelte:self)
	export let isInModal = false;
	// Insert decade labels (e.g. 1960s) when the calendar decade changes between visible rows
	export let showDecadeHeadings = true;
	// Decade labels: `none` uses neutral gray; site palettes tint the label
	export let decadeHeadingAccentPalette = 'none';
	/** @type {'start' | 'center' | 'end'} — text alignment inside the year column (matches event years) */
	export let decadeHeadingJustify = 'center';

	// Effective preview mode (from parent prop; controls overlay and open-in-modal behavior)
	$: effectivePreviewOnly = previewOnly;

	export let onClickInceptionEvent = () => {};
	export let addClickAddEvent = () => {};
	// Called when a new avatar is selected (passes the new image key)
	export let onAvatarChange = undefined;

	/** Same normalization as {@link JDGTimelineEventForm} (array or object of allowed keys). */
	function normalizeEventTypeKeys(keys) {
		const k = keys ?? jdgTimelineEventKeys;
		if (Array.isArray(k)) {
			return Object.fromEntries(k.map((key) => [key, key]));
		}
		return k;
	}

	/** Selectable (non-contextual) types allowed by context/prop — matches event form type dropdown. */
	function visibleMapForSelectableKeys(effectiveKeys) {
		return Object.fromEntries(
			Object.keys(timelineEventTypes)
				.filter((key) => effectiveKeys[key] && !timelineEventTypes[key]?.isContextual)
				.map((typeKey) => [typeKey, true])
		);
	}

	const contextEventTypeKeys = getContext(JDG_CONTEXTS.TIMELINE_EVENT_TYPE_KEYS);

	// State for hover overlay and modal
	let isHovering = false;
	let showTimelineModal = false;

	// Show loading overlay when timelineHost is undefined (not yet provided)
	// or when the image registry fetch is in progress
	$: showLoadingOverlay = timelineHost === undefined || registryFetchInProgress;

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

	// Slider track color for options flyout (~30% darker than default #ddd)
	$: optionsSliderTrackColor = (() => {
		const c = darkenColor('#dddddd', 0.2);
		return typeof c === 'string' ? c : `rgb(${c.r}, ${c.g}, ${c.b})`;
	})();

	// set up the inception and cessation events
	let emptyStateEvent;
	let todayEvent;

	// Get the app-level image registry from context (for when timeline uses same repo as current website)
	const contextImageMetaRegistry = getContext(JDG_CONTEXTS.IMAGE_META_REGISTRY);

	// Timeline image registry - either from context (same repo) or fetched (different repo)
	let timelineImageMetaRegistry = undefined;
	let lastFetchedRegistryRepoName = undefined;
	let registryFetchInProgress = false;

	async function loadTimelineImageMetaRegistry(registryRepoName) {
		if (!registryRepoName) {
			timelineImageMetaRegistry = undefined;
			lastFetchedRegistryRepoName = undefined;
			registryFetchInProgress = false;
			return;
		}

		// If the timeline uses the same repo as the current website, use the already-loaded context registry (or fetch if context is missing)
		if (registryRepoName === $currentRepoName && contextImageMetaRegistry !== undefined) {
			timelineImageMetaRegistry = contextImageMetaRegistry;
			lastFetchedRegistryRepoName = registryRepoName;
			registryFetchInProgress = false;
			return;
		}

		if (registryRepoName === lastFetchedRegistryRepoName && timelineImageMetaRegistry) {
			registryFetchInProgress = false;
			return; // Already loaded
		}
		lastFetchedRegistryRepoName = registryRepoName;
		registryFetchInProgress = true;
		timelineImageMetaRegistry = undefined; // show loading and avoid showing stale registry for previous host
		try {
			// Same-repo but no context: fetch. Different repo: fetch. fetchImageMetaRegistry caches results.
			timelineImageMetaRegistry = await fetchImageMetaRegistry(registryRepoName);
		} catch (err) {
			console.error('Failed to fetch timeline registry:', err);
			timelineImageMetaRegistry = undefined;
		} finally {
			// Only clear in-progress if this fetch is still the one we care about (host may have changed)
			if (lastFetchedRegistryRepoName === registryRepoName) {
				registryFetchInProgress = false;
			}
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
			draftImageMetaRegistry.set(timelineImageMetaRegistry);
			draftImageRegistryRepo.set(timelineHost?.imageMetaRegistryRepo);
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

	// Filter events by description (substring, case-insensitive)
	let eventDescriptionFilter = '';
	$: eventDescriptionFilterTrimmed = eventDescriptionFilter.trim();
	/** When filtering, force sequential / even layout (ignore relative spacing UI). */
	$: relativeSpacingLayoutActive =
		useRelativeSpacing && timelineZoom > 0 && !eventDescriptionFilterTrimmed;

	function getTimelineEventDescriptionText(event) {
		if (!event) return '';
		const d = event.description;
		return typeof d === 'string' ? d : '';
	}

	function eventDescriptionFilterMatches(event, trimmedFilter) {
		if (!trimmedFilter) return true;
		const text = getTimelineEventDescriptionText(event).toLowerCase();
		return text.includes(trimmedFilter.toLowerCase());
	}

	$: effectiveEventTypeKeys = normalizeEventTypeKeys(contextEventTypeKeys ?? eventTypeKeys);

	$: selectableEventTypeKeysSorted = Object.keys(timelineEventTypes)
		.filter((key) => effectiveEventTypeKeys[key] && !timelineEventTypes[key]?.isContextual)
		.sort((a, b) => timelineEventTypes[a].label.localeCompare(timelineEventTypes[b].label));

	// Which selectable event types are shown (toggled in visibility flyout); contextual row types are not listed and stay visible
	let visibleTimelineEventTypes = visibleMapForSelectableKeys(
		normalizeEventTypeKeys(contextEventTypeKeys ?? eventTypeKeys)
	);

	/** User-driven only — avoid JDGCheckbox here (its reactive sync + new inline handlers per row causes an infinite loop). */
	function setTimelineEventTypeVisible(typeKey, checked) {
		visibleTimelineEventTypes = { ...visibleTimelineEventTypes, [typeKey]: checked };
	}

	function setAllSelectableInTimelineTypesVisible(keys, checked) {
		const next = { ...visibleTimelineEventTypes };
		for (const key of keys) {
			next[key] = checked;
		}
		visibleTimelineEventTypes = next;
	}

	// Auto-scroll state (only available in admin mode)
	let isAutoScrolling = false;
	let autoScrollSpeed = 1; // Speed multiplier (0.1 to 6)
	let autoScrollDelay = '2'; // Delay in seconds before starting scroll (as string for input)
	let autoScrollAnimationFrame = null;
	let autoScrollDelayTimeout = null;
	let previousShowImageEditButtons = true; // Store the previous value to restore it

	// EVENT GRADIENTS
	// Number of gradient points per event (default: 3)
	const gradientPointsCount = 3;
	// Each event gradients between its normal color
	// and a color this far toward the other color
	const gradientMirrorFactor = 2.5;

	// Row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	$: eventTypeCountsInTimeline = (() => {
		const counts = {};
		for (const r of timelineRowItems) {
			const t = r.event?.type;
			if (typeof t === 'string') {
				counts[t] = (counts[t] || 0) + 1;
			}
		}
		return counts;
	})();

	$: selectableEventTypeKeysInTimelineSorted = selectableEventTypeKeysSorted.filter(
		(key) => (eventTypeCountsInTimeline[key] || 0) > 0
	);

	let eventTypesFlyoutMasterInput;

	$: eventTypesFlyoutMasterChecked =
		selectableEventTypeKeysInTimelineSorted.length > 0 &&
		selectableEventTypeKeysInTimelineSorted.every((k) => visibleTimelineEventTypes[k] !== false);

	$: eventTypesFlyoutMasterIndeterminate =
		selectableEventTypeKeysInTimelineSorted.length > 0 &&
		!selectableEventTypeKeysInTimelineSorted.every((k) => visibleTimelineEventTypes[k] !== false) &&
		!selectableEventTypeKeysInTimelineSorted.every((k) => visibleTimelineEventTypes[k] === false);

	$: if (eventTypesFlyoutMasterInput) {
		eventTypesFlyoutMasterInput.indeterminate = eventTypesFlyoutMasterIndeterminate;
	}

	// Timeline events will each have a slightly different color
	// along a gradient defined here
	let timelineEventColors = [];

	// Preview overlay handlers
	let previewOverlayTimeout;

	// Show the overlay
	const showPreviewOverlay = () => {
		if (effectivePreviewOnly && !showTimelineModal) {
			if (previewOverlayTimeout) {
				clearTimeout(previewOverlayTimeout);
				previewOverlayTimeout = null;
			}
			isHovering = true;
		}
	};

	// Hide the overlay after a delay
	const hidePreviewOverlayAfterDelay = () => {
		if (effectivePreviewOnly && isHovering) {
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

	// Track last scroll position to detect manual scrolling
	let lastScrollTop = 0;
	let isProgrammaticScroll = false;
	let userScrollTimeout = null;

	// Handle manual scroll detection
	const handleScroll = () => {
		if (!scrollingCanvasDivRef || !isAutoScrolling) return;
		// Ignore scroll events caused by programmatic scrolling
		if (isProgrammaticScroll) return;

		const currentScrollTop = scrollingCanvasDivRef.scrollTop;
		// If scroll position changed significantly, it might be manual
		const scrollDelta = Math.abs(currentScrollTop - lastScrollTop);
		if (scrollDelta > 5) {
			// Clear any existing timeout
			if (userScrollTimeout) {
				clearTimeout(userScrollTimeout);
			}
			// Check after a short delay to confirm it was manual
			userScrollTimeout = setTimeout(() => {
				// If scroll position changed significantly and we're still auto-scrolling, stop it
				const newScrollTop = scrollingCanvasDivRef?.scrollTop;
				if (
					newScrollTop !== undefined &&
					Math.abs(newScrollTop - lastScrollTop) > 5 &&
					isAutoScrolling
				) {
					stopAutoScroll();
				}
				userScrollTimeout = null;
			}, 150);
		}
		lastScrollTop = currentScrollTop;
	};

	// Auto-scroll functions
	const startAutoScroll = () => {
		if (isAutoScrolling || !scrollingCanvasDivRef) return;
		isAutoScrolling = true;
		isProgrammaticScroll = false;
		lastScrollTop = scrollingCanvasDivRef.scrollTop;

		// Hide image edit buttons while auto-scrolling
		previousShowImageEditButtons = $showImageEditButtons;
		showImageEditButtons.set(false);

		// Wait for the delay before starting to scroll
		const delaySeconds = parseFloat(autoScrollDelay) || 0;
		const delayMs = Math.max(0, delaySeconds) * 1000; // Convert seconds to milliseconds
		autoScrollDelayTimeout = setTimeout(() => {
			autoScrollDelayTimeout = null;
			const baseSpeed = 0.5; // Base pixels per frame
			const scroll = () => {
				if (!isAutoScrolling || !scrollingCanvasDivRef) {
					autoScrollAnimationFrame = null;
					isProgrammaticScroll = false;
					return;
				}
				const scrollAmount = baseSpeed * autoScrollSpeed;
				const previousScrollTop = scrollingCanvasDivRef.scrollTop;
				// Mark that we're about to do programmatic scrolling
				isProgrammaticScroll = true;
				scrollingCanvasDivRef.scrollTop += scrollAmount;
				// Reset flag after a brief moment (allows scroll event to be ignored)
				setTimeout(() => {
					isProgrammaticScroll = false;
				}, 10);
				// Check if scroll actually happened (might be at bottom)
				if (Math.abs(scrollingCanvasDivRef.scrollTop - previousScrollTop) < 0.1) {
					// Can't scroll further, stop
					stopAutoScroll();
				} else {
					lastScrollTop = scrollingCanvasDivRef.scrollTop;
					// Check if we've reached the bottom
					const maxScroll = scrollingCanvasDivRef.scrollHeight - scrollingCanvasDivRef.clientHeight;
					if (scrollingCanvasDivRef.scrollTop >= maxScroll - 1) {
						// Reached bottom, stop scrolling
						stopAutoScroll();
					} else {
						autoScrollAnimationFrame = requestAnimationFrame(scroll);
					}
				}
			};
			autoScrollAnimationFrame = requestAnimationFrame(scroll);
		}, delayMs);
	};

	const stopAutoScroll = () => {
		isAutoScrolling = false;
		isProgrammaticScroll = false;
		// Restore image edit buttons
		showImageEditButtons.set(previousShowImageEditButtons);
		// Clear delay timeout if it exists
		if (autoScrollDelayTimeout !== null) {
			clearTimeout(autoScrollDelayTimeout);
			autoScrollDelayTimeout = null;
		}
		// Clear animation frame if it exists
		if (autoScrollAnimationFrame !== null) {
			cancelAnimationFrame(autoScrollAnimationFrame);
			autoScrollAnimationFrame = null;
		}
	};

	const toggleAutoScroll = () => {
		if (isAutoScrolling) {
			stopAutoScroll();
		} else {
			startAutoScroll();
		}
	};

	const onAutoScrollSpeedChange = (newValue) => {
		autoScrollSpeed = newValue;
	};

	// Clean up animation frame on component destroy
	onDestroy(() => {
		stopAutoScroll();
	});

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
		eventDescriptionFilter = '';
		visibleTimelineEventTypes = visibleMapForSelectableKeys(effectiveEventTypeKeys);
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

	const timelineWrapperCss = css`
		width: ${width};
	`;

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

	const eventTypeFilterRowCss = css`
		display: flex;
		align-items: center;
		gap: 0.35em;
		cursor: pointer;
		user-select: none;
	`;

	const eventTypeFilterCheckboxCss = css`
		appearance: none;
		-webkit-appearance: none;
		width: 1.3em;
		height: 1.3em;
		margin: 0;
		border: 2px solid ${jdgColors.activeSecondary};
		border-radius: 3px;
		background-color: white;
		cursor: pointer;
		position: relative;
		flex-shrink: 0;

		&:checked {
			background-color: ${jdgColors.activeSecondary};
			border-color: ${jdgColors.activeSecondary};
		}

		&:checked::after {
			content: '';
			position: absolute;
			left: 50%;
			top: 45%;
			width: 30%;
			height: 55%;
			border: solid white;
			border-width: 0 2.5px 2.5px 0;
			transform: translate(-50%, -50%) rotate(45deg);
		}
	`;

	const eventTypeFilterLabelCss = css`
		font-size: 14px;
		line-height: normal;
		color: ${jdgColors.text};
	`;

	const decadeHeadingPaletteKeys = {
		ccp: 'accentColorsCCP',
		ccpRose: 'accentColorsCCPRose',
		jdg: 'accentColorsJDG',
		pmx: 'accentColorsPMX'
	};

	/** Padding matches {@link JDGTimelineEvent} `eventRowCss`; column width matches `.timeline-event-year`. */
	const timelineDecadeRowCss = css`
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		user-select: none;
		-webkit-user-select: none;
		cursor: default;
		padding-top: 0.35rem;
		padding-bottom: 0.15rem;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 4 + jdgSizes.timelineUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding-left: ${jdgSizes.nTimelineEventGapSize / 2 + jdgSizes.timelineUnit};
		}
	`;

	const timelineDecadeYearColumnCss = css`
		flex-shrink: 0;
		box-sizing: border-box;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.timelineEventYearWidthSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			width: ${jdgSizes.timelineEventYearWidthMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.timelineEventYearWidthLg};
		}
	`;

	$: decadeHeadingPaletteName = decadeHeadingPaletteKeys[decadeHeadingAccentPalette];
	$: decadeHeadingPaletteTriple =
		decadeHeadingPaletteName && jdgColors[decadeHeadingPaletteName]
			? jdgColors[decadeHeadingPaletteName]
			: null;

	$: decadeHeadingLabelColor =
		decadeHeadingAccentPalette !== 'none' &&
		Array.isArray(decadeHeadingPaletteTriple) &&
		decadeHeadingPaletteTriple.length >= 3
			? lightenColor(decadeHeadingPaletteTriple[2], 0.48)
			: lightenColor(jdgColors.textLight, 0.35);

	let timelineDecadeLabelCss = css``;
	$: {
		const textAlign =
			decadeHeadingJustify === 'center'
				? 'center'
				: decadeHeadingJustify === 'end'
					? 'right'
					: 'left';
		timelineDecadeLabelCss = css`
			font-weight: 600;
			letter-spacing: 0.04em;
			line-height: 1.15;
			margin: 0;
			width: 100%;
			box-sizing: border-box;
			color: ${decadeHeadingLabelColor};
			text-align: ${textAlign};
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				font-size: 1.15rem;
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				font-size: 1.4rem;
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				font-size: 1.65rem;
			}
		`;
	}

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

		if (!relativeSpacingLayoutActive) {
			// Static spacing: fixed gap, space-between alignment
			// Checkbox off, zoom at 0, or description filter active
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
	// Include spacing mode, zoom, and filter as dependencies to recalculate when changed
	$: {
		if (!timelineHost) {
			emptyStateEvent = undefined;
			todayEvent = undefined;
			timelineRowItems = [];
		} else {
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
			// When relative spacing is on AND zoom > 0 (and not filtering), keep proportional indices
			// Otherwise use sequential indices for even distribution
			let rowItems = updateTimelineRowItems(
				generateTimelineRowItems(timelineHost, contextEvents, earliestOrInceptionDate),
				!relativeSpacingLayoutActive // use sequential indices when NOT using relative spacing
			);

			// If using relative spacing with zoom > 0, scale the indices by zoom to multiply the spacing effect
			// This makes items that are farther apart in time move even farther apart visually
			if (relativeSpacingLayoutActive) {
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
	}

	// Read visibleTimelineEventTypes here (not only inside a helper) so Svelte invalidates when checkboxes change
	$: visibleTimelineRowItems = timelineRowItems.filter((r) => {
		const t = r.event?.type;
		if (typeof t === 'string' && visibleTimelineEventTypes[t] === false) return false;
		if (
			eventDescriptionFilterTrimmed &&
			!eventDescriptionFilterMatches(r.event, eventDescriptionFilterTrimmed)
		) {
			return false;
		}
		return true;
	});
	$: showFilteredInception =
		!!emptyStateEvent &&
		(typeof emptyStateEvent.type !== 'string' ||
			visibleTimelineEventTypes[emptyStateEvent.type] !== false) &&
		(!eventDescriptionFilterTrimmed ||
			eventDescriptionFilterMatches(emptyStateEvent, eventDescriptionFilterTrimmed));
	$: hasTodayBand =
		todayEvent && (timelineHost?.cessationDate === '' || !timelineHost?.cessationDate);
	$: showFilteredToday =
		hasTodayBand &&
		(typeof todayEvent.type !== 'string' || visibleTimelineEventTypes[todayEvent.type] !== false) &&
		(!eventDescriptionFilterTrimmed ||
			eventDescriptionFilterMatches(todayEvent, eventDescriptionFilterTrimmed));
	$: totalTimelineEventSlots =
		timelineRowItems.length + (emptyStateEvent ? 1 : 0) + (hasTodayBand ? 1 : 0);
	$: visibleTimelineEventCount =
		visibleTimelineRowItems.length + (showFilteredInception ? 1 : 0) + (showFilteredToday ? 1 : 0);

	// Compute the todayEvent row index based on spacing mode
	// Sequential mode: place after all events
	// Relative mode: place at the end of the proportional grid (row 1001)
	let todayEventRowIndex;
	$: {
		todayEventRowIndex = relativeSpacingLayoutActive
			? jdgQuantities.initialTimelineRowCount + 1
			: timelineRowItems.length + (emptyStateEvent ? 1 : 0) + 1;
	}

	$: {
		// Generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			(timelineHost?.timelineEvents?.length ?? 0) +
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

	// Scroll the timeline to the event currently shown in the TimelineEventModal (when modal is open or just closed)
	function scrollToEventInTimeline() {
		if (!scrollingCanvasDivRef || !timelineHost) return;
		const draftEvent = get(draftTimelineEvent);
		const draftHost = get(draftTimelineHost);
		if (!draftEvent || draftHost?.id !== timelineHost.id) return;

		let scrollIdToFind = null;
		if (draftEvent.type === jdgTimelineEventKeys.inception) {
			scrollIdToFind = 'inception';
		} else if (draftEvent.type === jdgTimelineEventKeys.today) {
			scrollIdToFind = 'today';
		} else {
			const idx = timelineRowItems.findIndex(
				(r) => r.event === draftEvent || (r.event.id && r.event.id === draftEvent.id)
			);
			if (idx >= 0) {
				const ev = timelineRowItems[idx].event;
				scrollIdToFind = ev.id || `idx-${idx}`;
			}
		}
		if (scrollIdToFind == null) return;

		const el = scrollingCanvasDivRef.querySelector(
			`[data-timeline-scroll-id="${CSS.escape(String(scrollIdToFind))}"]`
		);
		if (el) {
			isProgrammaticScroll = true;
			el.scrollIntoView({ block: 'center', behavior: 'smooth' });
			setTimeout(() => {
				isProgrammaticScroll = false;
			}, 400);
		}
	}

	// When the event modal is open and the current event changes, scroll the timeline in the background
	// (no scroll on close — timeline is already in position from the last event change)
	// Use $store so Svelte re-runs this when draftTimelineEvent / draftTimelineHost change (e.g. carousel nav)
	$: if (
		$showTimelineEventModal &&
		timelineHost &&
		$draftTimelineHost?.id === timelineHost.id &&
		$draftTimelineEvent
	) {
		tick().then(scrollToEventInTimeline);
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	bind:this={timelineWrapperRef}
	class="timeline-wrapper {timelineWrapperCss} {effectivePreviewOnly
		? 'preview-only'
		: ''} {showLoadingOverlay ? 'loading-overlay-visible' : ''}"
	on:mouseenter={showPreviewOverlay}
	on:mouseleave={hidePreviewOverlayAfterDelay}
	on:touchstart={showPreviewOverlay}
	on:touchend={hidePreviewOverlayAfterDelay}
	on:touchcancel={hidePreviewOverlayAfterDelay}
	role={effectivePreviewOnly ? 'button' : 'region'}
	tabindex={effectivePreviewOnly ? 0 : undefined}
>
	{#if showLoadingOverlay}
		<div class="timeline-loading-overlay" aria-busy="true" aria-label="Loading timeline">
			<div class="timeline-loading-content">
				<JDGLoadingSpinner strokeColor={jdgColors.text} spinnerHeightPx={40} strokeWidthPx={3} />
				<span class="timeline-loading-text">Loading…</span>
			</div>
		</div>
	{/if}
	{#if timelineHost}
		<JDGSaveStateBanner scrollOnStatusChange={false} />
		<!-- Hover overlay for previewOnly mode -->
		{#if effectivePreviewOnly && isHovering}
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
				style="position: relative; z-index: 10;"
			>
				<div class="timeline-event-count {timelineEventCountCss}">
					{#if eventDescriptionFilterTrimmed}
						Showing {visibleTimelineEventCount} of {totalTimelineEventSlots} timeline events
					{:else}
						Showing {totalTimelineEventSlots} timeline events
					{/if}
				</div>
				<div class="timeline-description-filter">
					<JDGTextInput
						bind:inputValue={eventDescriptionFilter}
						borderRadius="9999px"
						inputPadding="5px 12px"
						leadingFaIcon="fa-magnifying-glass"
						showClearButton={true}
						fontSizeOverride="14px"
						ariaLabel="Filter timeline events by description"
					/>
				</div>
				<!-- Event type visibility (between search and view options) -->
				<JDGFlyout
					tooltip="Show or hide event types"
					faIcon="fa-tag"
					flyoutTitle="EVENT TYPES"
					flyoutPosition="bottom-left"
					buttonBackgroundColor={jdgColors.activeSecondary}
				>
					<div class="timeline-event-type-filter-list">
						{#if selectableEventTypeKeysInTimelineSorted.length === 0}
							<span class="timeline-event-type-filter-empty {eventTypeFilterLabelCss}">
								No selectable event types in this timeline yet.
							</span>
						{:else}
							<label class={eventTypeFilterRowCss}>
								<input
									bind:this={eventTypesFlyoutMasterInput}
									type="checkbox"
									class={eventTypeFilterCheckboxCss}
									checked={eventTypesFlyoutMasterChecked}
									on:change={(e) =>
										setAllSelectableInTimelineTypesVisible(
											selectableEventTypeKeysInTimelineSorted,
											e.currentTarget.checked
										)}
								/>
								<span class={eventTypeFilterLabelCss}>All</span>
							</label>
							<div class="timeline-event-type-filter-divider" />
							{#each selectableEventTypeKeysInTimelineSorted as typeKey (typeKey)}
								<label class={eventTypeFilterRowCss}>
									<input
										type="checkbox"
										class={eventTypeFilterCheckboxCss}
										checked={visibleTimelineEventTypes[typeKey] !== false}
										on:change={(e) => setTimelineEventTypeVisible(typeKey, e.currentTarget.checked)}
									/>
									<span class={eventTypeFilterLabelCss}>
										{timelineEventTypes[typeKey].label} ({eventTypeCountsInTimeline[typeKey]})
									</span>
								</label>
							{/each}
						{/if}
					</div>
				</JDGFlyout>
				<!-- Timeline Options Flyout -->
				<JDGFlyout
					tooltip="Timeline options"
					flyoutTitle="VIEW OPTIONS"
					flyoutPosition="bottom-left"
					buttonBackgroundColor={jdgColors.activeSecondary}
				>
					<div class="timeline-options-controls">
						{#if !previewOnly && !isInModal}
							<JDGButton
								label="Open in full-screen"
								faIcon="fa-expand"
								onClickFunction={openTimelineModal}
								fontSize="14px"
								paddingLeftRight="12px"
								paddingTopBottom="6px"
								backgroundColor={jdgColors.activeSecondary}
							/>
							<div class="timeline-options-divider" />
						{/if}
						<JDGCheckbox
							isEnabled={!eventDescriptionFilterTrimmed}
							showLabel={true}
							label="Relative spacing"
							isChecked={useRelativeSpacing}
							onCheckAction={onCheckRelativeSpacing}
							onUncheckAction={onUncheckRelativeSpacing}
							labelFontSize="14px"
							checkboxBackgroundColor={jdgColors.activeSecondary}
						/>
						<JDGSlider
							label="Spacing multiplier"
							bind:value={timelineZoom}
							min={0}
							max={1}
							step={0.01}
							onChange={onZoomChange}
							isEnabled={useRelativeSpacing && !eventDescriptionFilterTrimmed}
							handleColor={jdgColors.activeSecondary}
							trackColor={optionsSliderTrackColor}
						/>
						{#if $isAdminMode}
							<div class="timeline-options-divider" />
							<div class="auto-scroll-section">
								<div class="auto-scroll-title">Auto Scroll</div>
								<JDGInputContainer label="Delay (seconds)">
									<JDGTextInput
										bind:inputValue={autoScrollDelay}
										isEnabled={!isAutoScrolling}
										placeholder="2"
									/>
								</JDGInputContainer>
								<div class="auto-scroll-buttons">
									<JDGButton
										label={isAutoScrolling ? 'Pause' : 'Start'}
										faIcon={isAutoScrolling ? 'fa-pause' : 'fa-play'}
										onClickFunction={toggleAutoScroll}
										fontSize="14px"
										paddingLeftRight="12px"
										paddingTopBottom="6px"
										backgroundColor={isAutoScrolling ? jdgColors.cancel : jdgColors.active}
									/>
								</div>
								<JDGSlider
									label="Scroll speed"
									bind:value={autoScrollSpeed}
									min={0.1}
									max={6}
									step={0.1}
									onChange={onAutoScrollSpeedChange}
									isEnabled={true}
									handleColor={jdgColors.activeSecondary}
									trackColor={optionsSliderTrackColor}
								/>
							</div>
						{/if}
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
				<div
					class="timeline-scrolling-canvas"
					bind:this={scrollingCanvasDivRef}
					on:scroll={handleScroll}
				>
					<!-- The grid containing all timeline events -->
					<div class="timeline-event-grid {timelineEventGridCss}">
						<!-- If there are no events, make an empty state event at the top -->
						{#if emptyStateEvent && showFilteredInception && eventColorPairs.length > 0}
							<div class="timeline-grid-row-slot" style:grid-row={0}>
								{#if showDecadeHeadings}
									{@const inceptionDecade = getDecadeStartYearFromTimelineEvent(emptyStateEvent)}
									{#if inceptionDecade !== null}
										<div
											class="timeline-decade-heading {timelineDecadeRowCss}"
											role="group"
											aria-label={`${inceptionDecade}s`}
										>
											<div class="timeline-decade-heading__year {timelineDecadeYearColumnCss}">
												<p class="timeline-decade-heading__label {timelineDecadeLabelCss}">
													{inceptionDecade}s
												</p>
											</div>
										</div>
									{/if}
								{/if}
								<JDGTimelineEvent
									{timelineHost}
									timelineEvent={emptyStateEvent}
									scrollId="inception"
									onClickTimelineEvent={isInteractive && allowEditing
										? onClickInceptionEvent
										: () => {}}
									isInteractive={isInteractive && allowEditing && $isAdminMode}
									rowIndex={0}
									gradientColor1={eventColorPairs[0].backgroundColor}
									gradientColor2={eventColorPairs[0].gradientMirrorColor}
									{gradientPointsCount}
								/>
							</div>
						{/if}
						<!-- All timeline events saved to the host -->
						{#each visibleTimelineRowItems as timelineRowItem, i}
							{@const fullIndex = timelineRowItems.indexOf(timelineRowItem)}
							{@const colorPairIndex = (emptyStateEvent ? 1 : 0) + fullIndex}
							{@const prevEventForDecade =
								i > 0
									? visibleTimelineRowItems[i - 1].event
									: showFilteredInception && emptyStateEvent
										? emptyStateEvent
										: null}
							{@const rowDecade = getDecadeStartYearFromTimelineEvent(timelineRowItem.event)}
							{@const prevRowDecade = prevEventForDecade
								? getDecadeStartYearFromTimelineEvent(prevEventForDecade)
								: null}
							<div class="timeline-grid-row-slot" style:grid-row={timelineRowItem.index}>
								<!-- Use a key to ensure the UI reacts when these values change -->
								{#key `${timelineHost.id}-${timelineRowItem.event.id}`}
									{#if showDecadeHeadings && rowDecade !== null && rowDecade !== prevRowDecade}
										<div
											class="timeline-decade-heading {timelineDecadeRowCss}"
											role="group"
											aria-label={`${rowDecade}s`}
										>
											<div class="timeline-decade-heading__year {timelineDecadeYearColumnCss}">
												<p class="timeline-decade-heading__label {timelineDecadeLabelCss}">
													{rowDecade}s
												</p>
											</div>
										</div>
									{/if}
									<JDGTimelineEvent
										{timelineHost}
										timelineEvent={timelineRowItem.event}
										scrollId={timelineRowItem.event.id || `idx-${fullIndex}`}
										onClickTimelineEvent={() => {
											// Only promote the host into the global draft store when this timeline is in an
											// editing context (allowEditing). Otherwise every event click would set
											// draftTimelineHost — e.g. timeline-test uses allowEditing={$draftTimelineHost}
											// and would treat the host as "in draft" after the first click even when the user
											// never used "Set to Editing Store". Carousel still works via timelineEventsOrdered +
											// draftTimelineEvent; image registry comes from timeline context.
											if (allowEditing) {
												draftTimelineHost.set(timelineHost);
											}
											draftTimelineEvent.set(timelineRowItem.event);
											timelineEventsOrdered.set(timelineRowItems.map((r) => r.event));
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
							</div>
						{/each}
						<!-- Show the today event if there's no cessation date provided -->
						{#if showFilteredToday && eventColorPairs.length > 0}
							{@const todayColorPairIndex = eventColorPairs.length - 1}
							<div class="timeline-grid-row-slot" style:grid-row={todayEventRowIndex}>
								{#if showDecadeHeadings}
									{@const prevEventBeforeToday =
										visibleTimelineRowItems.length > 0
											? visibleTimelineRowItems[visibleTimelineRowItems.length - 1].event
											: showFilteredInception && emptyStateEvent
												? emptyStateEvent
												: null}
									{@const todayDecade = getDecadeStartYearFromTimelineEvent(todayEvent)}
									{@const prevDecadeBeforeToday = prevEventBeforeToday
										? getDecadeStartYearFromTimelineEvent(prevEventBeforeToday)
										: null}
									{#if todayDecade !== null && todayDecade !== prevDecadeBeforeToday}
										<div
											class="timeline-decade-heading {timelineDecadeRowCss}"
											role="group"
											aria-label={`${todayDecade}s`}
										>
											<div class="timeline-decade-heading__year {timelineDecadeYearColumnCss}">
												<p class="timeline-decade-heading__label {timelineDecadeLabelCss}">
													{todayDecade}s
												</p>
											</div>
										</div>
									{/if}
								{/if}
								<JDGTimelineEvent
									{timelineHost}
									timelineEvent={todayEvent}
									scrollId="today"
									rowIndex={todayEventRowIndex}
									gradientColor1={eventColorPairs[todayColorPairIndex].backgroundColor}
									gradientColor2={eventColorPairs[todayColorPairIndex].gradientMirrorColor}
									{gradientPointsCount}
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{:else if timelineHost === null}
		<p class="timeline-empty">No timeline data available.</p>
	{:else}
		<!-- timelineHost === undefined: same title bar + container box model as loaded state so total
		     height is from real CSS (min/max on .timeline-container), not a guessed rem reserve. -->
		{#if showTitleBar}
			<div
				class="timeline-title-bar {timelineTitleBarCss} timeline-title-bar--host-pending"
				aria-hidden="true"
			>
				<div
					class="timeline-title-bar-placeholder-avatar"
					style:width={avatarHeight}
					style:height={avatarHeight}
				></div>
				<!-- Ensure title bar still takes up height during loading -->
				<div class="timeline-title">&#8203;</div>
			</div>
		{/if}
		<div
			class="timeline-container {timelineContainerCss} timeline-container--host-pending"
			aria-hidden="true"
		></div>
	{/if}
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
					{eventTypeKeys}
					{showDecadeHeadings}
					{decadeHeadingAccentPalette}
					{decadeHeadingJustify}
					width="100%"
					minHeight="70dvh"
					maxHeight="75dvh"
					isInModal
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
		display: flex;
		flex-direction: column;
		/* Parents like JDGContentBoxFloating use flex column + align-items:center — children shrink to
		   content width on the cross axis. Stretch so the timeline uses the full content width. */
		align-self: stretch;
		min-width: 0;
		height: -webkit-fill-available;
	}

	/*
	 * Only allow flex-shrinking to zero when NOT loading.
	 * During loading the overlay is position:absolute and contributes
	 * no intrinsic height, so min-height:0 would collapse the wrapper.
	 */
	.timeline-wrapper:not(.loading-overlay-visible) {
		min-height: 0;
	}

	.timeline-wrapper.loading-overlay-visible {
		align-self: stretch;
		min-width: 0;
	}

	/* Prevent internal timeline scrolling when in preview-only mode */
	.timeline-wrapper.preview-only .timeline-scrolling-canvas {
		overflow: hidden;
	}

	.timeline-loading-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(4px);
		z-index: 20;
		border-radius: 10px;
	}

	.timeline-loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.timeline-loading-text {
		font-size: 1rem;
		color: var(--jdg-color-text, #2c2c2c);
	}

	.timeline-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		margin: 0;
		color: var(--jdg-color-text-secondary, #666);
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
		z-index: 20;
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

	.timeline-title-bar--host-pending {
		pointer-events: none;
	}

	.timeline-title-bar-placeholder-avatar {
		flex-shrink: 0;
		visibility: hidden;
	}

	.timeline-container--host-pending {
		pointer-events: none;
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
		min-width: 0;
	}

	.timeline-description-filter {
		flex: 0 1 11rem;
		min-width: 7rem;
		max-width: 14rem;
		align-self: center;
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

	/* One grid row per slot: optional decade heading + event share the same grid-row */
	.timeline-grid-row-slot {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		min-width: 0;
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
		padding: 8px 0 16px 0;
	}

	.timeline-options-divider {
		height: 0;
		border: none;
		border-top: 1px solid rgba(127, 124, 124, 0.767);
		margin: 4px 0;
	}

	.auto-scroll-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 8px;
		border-top: 1px solid rgba(200, 200, 200, 0.5);
	}

	.auto-scroll-title {
		font-weight: bold;
		font-size: 1.05rem;
		margin-bottom: 4px;
	}

	.auto-scroll-buttons {
		display: flex;
		justify-content: center;
	}

	.timeline-event-type-filter-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: min(60vh, 420px);
		overflow-y: auto;
		padding-right: 4px;
	}

	.timeline-event-type-filter-divider {
		height: 0;
		border: none;
		border-top: 1px solid rgba(127, 124, 124, 0.45);
		margin: 2px 0 4px 0;
	}

	.timeline-event-type-filter-empty {
		opacity: 0.75;
		font-style: italic;
		padding: 4px 0;
	}
</style>
