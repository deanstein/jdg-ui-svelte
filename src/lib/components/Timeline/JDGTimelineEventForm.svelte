<script>
	// @ts-nocheck

	import { getContext, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import JDG_INPUT_TYPES from '$lib/schemas/jdg-input-types.js';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';

	import {
		timelineEventModalInceptionDate,
		showTimelineEventModal
	} from '$lib/stores/jdg-ui-store.js';
	import { draftTimelineEvent, draftTimelineHost } from '$lib/stores/jdg-temp-store.js';

	import { getImageMetaRegistryLabel } from '$lib/jdg-persistence-management.js';
	import {
		extractDataSchemaFields,
		extractUiFromDataSchema,
		upgradeTimelineEvent
	} from '$lib/jdg-timeline-management.js';
	import {
		addOrReplaceObjectByKeyValue,
		deleteObjectByKeyValue,
		getYearsAndMonthsBetweenDates,
		formatAgeDisplayWithRounding,
		getIsObjectInArray,
		instantiateObject,
		resolveImageMetaKeys,
		getImageMetaByKey
	} from '$lib/jdg-utils.js';

	import {
		JDGButton,
		JDGCheckbox,
		JDGCombobox,
		JDGComposeToolbar,
		JDGDatePicker,
		JDGForm,
		JDGImageSelector,
		JDGImageThumbnailGroup,
		JDGInputContainer,
		JDGNotificationBanner,
		JDGSelect,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Read from and write to this store
	export let eventStore = writable(instantiateObject(jdgTimelineEvent));
	// The types of events to show (fallback if context not provided)
	export let eventTypeKeys = jdgTimelineEventKeys;

	// Get event type keys from context (set by parent components like +page.svelte)
	// Falls back to prop if context not available
	// Context can be either an array of key strings or an object like jdgTimelineEventKeys
	const contextEventTypeKeys = getContext(JDG_CONTEXTS.TIMELINE_EVENT_TYPE_KEYS);

	// Get age suffixes from context (set by parent components)
	// Falls back to default values if context not available
	const eventAgeSuffixPositive = getContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_POSITIVE) ?? 'old';
	const eventAgeSuffixNegative = getContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_NEGATIVE) ?? 'old';
	// Get show months setting from context (default is false)
	const eventAgeShowMonths = getContext(JDG_CONTEXTS.EVENT_AGE_SHOW_MONTHS) ?? false;

	// Normalize event type keys: convert array to object format if needed
	$: effectiveEventTypeKeys = (() => {
		const keys = contextEventTypeKeys ?? eventTypeKeys;
		// If it's an array, convert to object format
		if (Array.isArray(keys)) {
			return Object.fromEntries(keys.map((key) => [key, key]));
		}
		// Otherwise, assume it's already in object format
		return keys;
	})();
	// Editing
	export let isEditable = true; // show compose toolbar if true
	export let isEditing = false; // fields are in edit state if true
	// For debugging
	export let showLocalStore = false;

	// Get the registry repo name from the draft timeline host
	$: registryRepoName = $draftTimelineHost?.imageMetaRegistryRepo;
	$: registryLabel = getImageMetaRegistryLabel(registryRepoName);

	const noImageMessage = 'No images in this event';

	// Get the timeline's image registry from context (set by parent JDGTimeline)
	const timelineImageRegistryStore = getContext(JDG_CONTEXTS.TIMELINE_IMAGE_REGISTRY);
	$: imageMetaRegistry = $timelineImageRegistryStore;

	let parentRef; // For positioning the compose toolbar

	let isNewEvent; // If true, this event wasn't found in the draft timeline host

	// Local writable stores for editing
	let localEventStore = writable({});
	let localAdditionalStore = writable({});

	// Track whether image selector is open
	let isImageSelectorOpen = false;

	// Track the previous type to detect actual type changes
	let previousType = null;

	// Check if there's exactly one image
	$: hasSingleImage =
		$localEventStore?.images &&
		Array.isArray($localEventStore.images) &&
		$localEventStore.images.length === 1;
	// Check if there's at least one image
	$: hasImages =
		$localEventStore?.images &&
		Array.isArray($localEventStore.images) &&
		$localEventStore.images.length > 0;
	// Check if event type supports image wrapper
	$: supportsImageWrapper =
		$localEventStore?.type === jdgTimelineEventKeys.media ||
		$localEventStore?.type === jdgTimelineEventKeys.article ||
		$localEventStore?.isMediaWrapper === true; // If isMediaWrapper is true, we know the type supports it
	// For media: require exactly 1 image, for article: require at least 1 image (or allow in edit mode to add images)
	$: canUseImageWrapper =
		supportsImageWrapper &&
		(($localEventStore?.type === jdgTimelineEventKeys.media && hasSingleImage) ||
			($localEventStore?.type === jdgTimelineEventKeys.article && (hasImages || isEditing)));
	// Get the first image metadata (used for both single and multiple images)
	$: firstImageMeta =
		hasImages && imageMetaRegistry && $localEventStore.images?.[0]
			? getImageMetaByKey(imageMetaRegistry, $localEventStore.images[0])
			: null;

	// Display values for description and source - use image data if isMediaWrapper is true
	// Otherwise use the stored values (which should be preserved in the database)
	$: displayDescription =
		$localEventStore.isMediaWrapper && firstImageMeta?.caption
			? firstImageMeta.caption
			: $localEventStore.description ?? '';
	$: displaySource =
		$localEventStore.isMediaWrapper && firstImageMeta?.attribution
			? firstImageMeta.attribution
			: $localEventStore.source ?? '';

	// Reactive computed values for checkbox visibility
	// Checkbox should appear if type supports it, regardless of isMediaWrapper value
	// The isMediaWrapper flag only controls whether the checkbox is checked, not visibility
	// Only evaluate if store has been populated (type is defined)
	$: isArticleType = $localEventStore?.type === jdgTimelineEventKeys.article;
	$: isMediaType = $localEventStore?.type === jdgTimelineEventKeys.media;
	$: shouldShowCheckbox =
		$localEventStore?.type &&
		((isArticleType && (hasImages || isEditing)) || (isMediaType && hasSingleImage));

	// Checkbox only toggles isMediaWrapper - display logic handles showing image data vs stored data
	// We never modify the stored description/source values - they are preserved in the database

	// Reset checkbox when in edit mode and conditions are no longer met
	// Only reset if we're sure conditions aren't met (type changed away from media/article, or no images at all)
	$: if (
		isEditing &&
		!canUseImageWrapper &&
		$localEventStore.isMediaWrapper &&
		!supportsImageWrapper
	) {
		localEventStore.update((store) => {
			return { ...store, isMediaWrapper: false };
		});
	}

	// Sync function to update local stores from eventStore
	function syncFromEventStore() {
		const snapshot = get(eventStore);
		// Upgrade the event to ensure it has all current schema fields
		const upgradedEvent = upgradeTimelineEvent(snapshot);
		localEventStore.set({ ...upgradedEvent });
		localAdditionalStore.set({ ...upgradedEvent.additionalContent });
		// Also sync the previousType when parent changes
		previousType = upgradedEvent.type;
	}

	// Initial sync on mount
	onMount(() => {
		syncFromEventStore();
		// Subscribe to eventStore changes
		const unsubscribe = eventStore.subscribe(() => {
			syncFromEventStore();
		});
		return unsubscribe;
	});

	// Consider this a new event if it's not present in the
	// editing timelineHost's events array
	$: {
		// Determine if this is a new event or not
		// If there's no draftTimelineHost, this can't be a new event (nowhere to save)
		if (!$draftTimelineHost) {
			isNewEvent = false;
		}
		// Otherwise, if there is a host draft and this isn't present in its events, it's new
		else if (!getIsObjectInArray($draftTimelineHost?.timelineEvents, $draftTimelineEvent)) {
			isNewEvent = true;
		}
	}

	// Schema prep
	const baseFieldSchema = extractUiFromDataSchema(jdgTimelineEvent);

	$: typeSchema = jdgTimelineEventTypes[$localEventStore.type];
	$: contentSchema = typeSchema?.additionalContent ?? {};
	$: mergedSchema = { ...baseFieldSchema, ...contentSchema };

	$: renderFields = Object.entries(mergedSchema)
		.filter(([key]) => key !== 'isApprxDate' && key !== 'isMediaWrapper')
		.map(([key, def]) => {
			const isAdditional = key in contentSchema;
			return { key, def, isAdditional };
		});

	function saveToStore() {
		eventStore.set({
			...$localEventStore,
			additionalContent: { ...$localAdditionalStore }
		});

		// Update the timeline host draft
		draftTimelineHost.update((currentValue) => {
			addOrReplaceObjectByKeyValue(
				currentValue.timelineEvents,
				'id',
				get(localEventStore).id,
				get(eventStore)
			);
			return currentValue;
		});
	}

	const timelineEventOptionsGroup = (eventTypeKeys) => {
		return {
			timelineTypes: Object.fromEntries(
				Object.entries(jdgTimelineEventTypes)
					.filter(([key, value]) => eventTypeKeys[key] && !value.isContextual)
					.map(([key, value]) => [
						key,
						{
							value: key,
							label: value.label ?? key
						}
					])
			),
			includedKeys: Object.keys(eventTypeKeys).filter(
				(key) => !jdgTimelineEventTypes[key]?.isContextual
			)
		};
	};

	// If the event type changes, upgrade the additionalContent schema
	// Only runs when the type actually changes (not on every store update)
	$: if ($localEventStore.type && $localEventStore.type !== previousType) {
		const newAddlContent = jdgTimelineEventTypes[$localEventStore.type]?.additionalContent ?? {};
		const dataOnlyAddlContent = extractDataSchemaFields(newAddlContent);
		// Merge existing values with new schema defaults (preserves user input)
		const currentAddl = get(localAdditionalStore);
		const mergedAddlContent = { ...dataOnlyAddlContent };
		// Preserve existing values for keys that exist in both
		for (const key of Object.keys(dataOnlyAddlContent)) {
			if (currentAddl[key] !== undefined && currentAddl[key] !== '') {
				mergedAddlContent[key] = currentAddl[key];
			}
		}
		localAdditionalStore.set(mergedAddlContent);
		previousType = $localEventStore.type;
	}

	// Keep the age and years ago values updated
	let eventAge;
	let eventAgeDisplay;
	let isEventAgePositive;
	let yearsAgo;
	let yearsAgoDisplay;
	$: {
		const eventDateCorrected = new Date($eventStore?.date);
		const ageData = getYearsAndMonthsBetweenDates(
			$timelineEventModalInceptionDate,
			eventDateCorrected
		);
		eventAge = ageData.years;
		// Format age display with rounding logic
		eventAgeDisplay = formatAgeDisplayWithRounding(
			ageData.years,
			ageData.months,
			eventAgeShowMonths
		);
		// Determine if age is positive (event after inception) or negative (event before inception)
		if (eventAgeDisplay) {
			const totalYears = ageData.years + ageData.months / 12;
			isEventAgePositive = totalYears > 0 || (totalYears === 0 && ageData.months > 0);
		} else {
			isEventAgePositive = true; // Default, won't be used if display is null
		}

		const yearsAgoData = getYearsAndMonthsBetweenDates(eventDateCorrected, new Date());
		yearsAgo = yearsAgoData.years;
		// Format years ago display with rounding logic
		yearsAgoDisplay = formatAgeDisplayWithRounding(
			yearsAgoData.years,
			yearsAgoData.months,
			eventAgeShowMonths
		);
	}

	// Get current event type info for header display
	$: currentTypeInfo = jdgTimelineEventTypes[$localEventStore.type] ?? {};
	$: currentTypeLabel = currentTypeInfo.label ?? $localEventStore.type ?? 'Event';
	$: currentTypeIcon = currentTypeInfo.icon ?? 'fa-calendar';
	$: isGenericType = $localEventStore.type === 'generic';
	// Convert label to sentence case for hover text (first letter uppercase, rest lowercase)
	$: sentenceCaseLabel = currentTypeLabel
		? currentTypeLabel.charAt(0) + currentTypeLabel.slice(1).toLowerCase()
		: currentTypeLabel;

	// Reset image selector when editing state changes
	$: if (!isEditing) {
		isImageSelectorOpen = false;
	}
</script>

<JDGForm bind:containerRef={parentRef}>
	<!-- Image Meta Registry indicator (locked to timeline's registry) -->
	<JDGNotificationBanner
		showBanner={!!registryRepoName}
		notificationType={jdgNotificationTypes.information}
		message={`Image Meta Registry: ${registryLabel}`}
	/>

	<!-- Event type and age header -->
	<div class="event-header">
		<div class="event-header-view event-header-age">
			<i class="fa-solid {currentTypeIcon} event-header-icon" title="{sentenceCaseLabel} event" />
			{#if !isGenericType}
				<span class="event-header-type-label">{currentTypeLabel}</span>
			{/if}
			{#if eventAgeDisplay}
				<span class="event-header-separator">|</span>
				<span
					>{eventAgeDisplay}
					{isEventAgePositive ? eventAgeSuffixPositive : eventAgeSuffixNegative}</span
				>
			{/if}
			{#if yearsAgoDisplay}
				<span class="event-header-separator">|</span>
				<span>{yearsAgoDisplay} ago</span>
			{/if}
		</div>
	</div>

	<!-- Type picker when editing -->
	{#if isEditing}
		<JDGInputContainer label="Type">
			<JDGSelect
				optionsGroup={timelineEventOptionsGroup(effectiveEventTypeKeys)}
				bind:inputValue={$localEventStore.type}
				isEnabled={isEditing}
			/>
		</JDGInputContainer>
	{/if}

	<!-- Checkbox to use image data for media (single image) or article (multiple images) events -->
	<!-- Show if: isMediaWrapper is true (always show if set) OR (type supports it AND conditions are met) -->
	{#if shouldShowCheckbox}
		<JDGInputContainer label="Media wrapper">
			<JDGCheckbox
				label={jdgTimelineEvent.isMediaWrapper.label}
				hint="Optionally use description and source from the first media item in this event"
				bind:isChecked={$localEventStore.isMediaWrapper}
			/>
		</JDGInputContainer>
		{#if hasImages && !firstImageMeta && imageMetaRegistry && isEditing}
			<div class="image-meta-loading-note">
				Unable to load image metadata. Please ensure the image registry is available.
			</div>
		{/if}
	{/if}

	<!-- All fields from the schema -->
	{#each renderFields as { key, def, isAdditional } (key)}
		<!-- Source field only shows when editing or when it has content -->
		{#if key !== 'source' || isEditing || $localEventStore.source}
			<JDGInputContainer label={def.label}>
				{#if def.inputType === JDG_INPUT_TYPES.DATE}
					<div class="date-with-checkbox">
						{#if isAdditional}
							<JDGDatePicker bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
						{:else}
							<JDGDatePicker bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
						{/if}
						<JDGCheckbox
							label="Is approximate?"
							bind:isChecked={$localEventStore.isApprxDate}
							isEnabled={isEditing}
						/>
					</div>
				{:else if def.inputType === JDG_INPUT_TYPES.TEXT}
					{#if isAdditional}
						<JDGTextInput bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
					{:else if key === 'description'}
						{#key $localEventStore.isMediaWrapper}
							{#if $localEventStore.isMediaWrapper}
								<JDGTextInput inputValue={displayDescription} isEnabled={false} />
							{:else}
								<JDGTextInput
									bind:inputValue={$localEventStore.description}
									isEnabled={isEditing}
								/>
							{/if}
						{/key}
					{:else if key === 'source'}
						{#key $localEventStore.isMediaWrapper}
							{#if $localEventStore.isMediaWrapper}
								<JDGTextInput inputValue={displaySource} isEnabled={false} />
							{:else}
								<JDGTextInput bind:inputValue={$localEventStore.source} isEnabled={isEditing} />
							{/if}
						{/key}
					{:else}
						<JDGTextInput bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.COMBOBOX}
					{#if isAdditional}
						<JDGCombobox
							bind:inputValue={$localAdditionalStore[key]}
							options={def.options || []}
							isEnabled={isEditing}
						/>
					{:else if key === 'source'}
						{#key `${$localEventStore.isMediaWrapper}-${displaySource}`}
							{#if $localEventStore.isMediaWrapper}
								<JDGCombobox
									inputValue={displaySource}
									options={def.options || []}
									isEnabled={false}
								/>
							{:else}
								<JDGCombobox
									bind:inputValue={$localEventStore.source}
									options={def.options || []}
									isEnabled={isEditing}
								/>
							{/if}
						{/key}
					{:else}
						<JDGCombobox
							bind:inputValue={$localEventStore[key]}
							options={def.options || []}
							isEnabled={isEditing}
						/>
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.TEXTAREA}
					{#if isAdditional}
						<JDGTextArea bind:inputValue={$localAdditionalStore[key]} isEnabled={isEditing} />
					{:else if key === 'description'}
						{#key `${$localEventStore.isMediaWrapper}-${displayDescription}`}
							{#if $localEventStore.isMediaWrapper}
								<JDGTextArea inputValue={displayDescription} isEnabled={false} />
							{:else}
								<JDGTextArea bind:inputValue={$localEventStore.description} isEnabled={isEditing} />
							{/if}
						{/key}
					{:else}
						<JDGTextArea bind:inputValue={$localEventStore[key]} isEnabled={isEditing} />
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.CHECKBOX}
					{#if isAdditional}
						<JDGCheckbox bind:isChecked={$localAdditionalStore[key]} isEnabled={isEditing} />
					{:else}
						<JDGCheckbox bind:isChecked={$localEventStore[key]} isEnabled={isEditing} />
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.SELECT}
					{#if isAdditional}
						<select id={key} bind:value={$localAdditionalStore[key]}>
							{#each def.options as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					{:else}
						<select id={key} bind:value={$localEventStore[key]}>
							{#each def.options as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.IMAGE_LIST}
					<!-- Images are only stored at the top-level timeline event, never in additionalContent -->
					<!-- Image display - keyed to update when selection changes -->
					{#key $localEventStore[key]?.length}
						{#if resolveImageMetaKeys($localEventStore[key] || [], imageMetaRegistry)?.length > 0}
							<div class="image-list-display">
								<JDGImageThumbnailGroup
									imageMetaSet={resolveImageMetaKeys(
										$localEventStore[key] || [],
										imageMetaRegistry
									)}
									maxImageHeight={'30svh'}
								/>
							</div>
							<div class="image-source-note">See each image for its source</div>
						{:else if !isEditing}
							<div class="no-images-message">{noImageMessage}</div>
						{/if}
					{/key}

					<!-- In edit mode, show button and selector (outside key block to prevent remount) -->
					{#if isEditing}
						<div class="image-selector-actions">
							<JDGButton
								label={isImageSelectorOpen
									? 'Close Image Selector'
									: ($localEventStore[key]?.length || 0) > 0
										? 'Manage Images'
										: 'Add Images'}
								faIcon={isImageSelectorOpen ? 'fa-times' : 'fa-images'}
								onClickFunction={() => {
									isImageSelectorOpen = !isImageSelectorOpen;
								}}
								fontSize="14px"
								paddingLeftRight="16px"
								paddingTopBottom="8px"
								backgroundColor={jdgColors.active}
							/>
						</div>
						{#if isImageSelectorOpen}
							<div class="image-selector-container">
								<JDGImageSelector
									selectedImages={$localEventStore[key] || []}
									isEnabled={isEditing}
									{registryRepoName}
									requireRegistry={true}
									onSelectionChange={(newSelection) => {
										localEventStore.update((store) => ({
											...store,
											[key]: newSelection
										}));
									}}
								/>
							</div>
						{/if}
					{/if}
				{:else if isAdditional}
					<JDGTextInput bind:inputValue={$localAdditionalStore[key]} />
				{:else}
					<JDGTextInput bind:inputValue={$localEventStore[key]} />
				{/if}
			</JDGInputContainer>
		{/if}
	{/each}
	{#if isEditable}
		<JDGComposeToolbar
			{parentRef}
			isEditActive={isEditing}
			composeButtonTooltip="Edit"
			onClickCompose={() => {
				isEditing = true;
			}}
			onClickDone={() => {
				saveToStore();
				showTimelineEventModal.set(false);
			}}
			onClickCancel={() => {
				if (isNewEvent) {
					showTimelineEventModal.set(false);
				} else {
					isEditing = false;
					showTimelineEventModal.set(false);
					// Reset the stores
					localEventStore.set($eventStore);
					localAdditionalStore.set($eventStore.additionalContent);
					localEventStore.update((currentValue) => ({
						...currentValue,
						type: $eventStore.type
					}));
				}
			}}
			onClickDelete={isNewEvent
				? undefined
				: () => {
						// Delete this event from the draft host
						draftTimelineHost.update((currentValue) => {
							deleteObjectByKeyValue(currentValue.timelineEvents, 'id', $localEventStore.id);
							return currentValue;
						});
						isEditing = false;
						showTimelineEventModal.set(false);
					}}
		/>
	{/if}
</JDGForm>
{#if showLocalStore}
	<div class="form-store-preview">
		FORM STORE:
		<pre>
		{JSON.stringify({ ...$localEventStore, additionalContent: { ...$localAdditionalStore } }, null, 2)}
	</pre>
	</div>
{/if}

<style>
	.event-header {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.event-header-view {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 1.1rem;
	}

	.event-header-icon {
		font-size: 1.2rem;
	}

	.event-header-type-label {
		font-weight: 500;
	}

	.event-header-separator {
		color: #999;
		font-weight: 300;
	}

	.event-header-age {
		color: #666;
		font-size: 0.8rem;
	}

	.form-store-preview {
		margin-top: 20px;
	}

	.image-list-display {
		margin-bottom: 12px;
	}

	.image-source-note {
		font-size: 0.85rem;
		font-style: italic;
		color: #666;
		text-align: left;
		margin-top: 8px;
		margin-bottom: 8px;
	}

	.no-images-message {
		font-style: italic;
		color: #999;
		text-align: left;
		margin-top: 4px;
	}

	.image-selector-actions {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 12px;
	}

	.image-selector-container {
		margin-top: 12px;
		padding: 16px;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 8px;
		border: 2px solid rgba(200, 200, 200, 0.5);
	}
</style>
