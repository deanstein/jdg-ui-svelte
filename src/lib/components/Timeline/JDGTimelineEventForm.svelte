<script>
	// @ts-nocheck

	import { getContext, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { css } from '@emotion/css';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import JDG_INPUT_TYPES from '$lib/schemas/jdg-input-types.js';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import jdgTimelineEventTypes, {
		jdgTimelineEventKeys
	} from '$lib/schemas/timeline/jdg-timeline-event-types.js';
	import jdgTimelineEvent from '$lib/schemas/timeline/jdg-timeline-event.js';

	import {
		isAdminMode,
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
		formatTimelineEventDateLong,
		formatAgeDisplayWithRounding,
		getIsObjectInArray,
		getYearsAndMonthsBetweenDates,
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
		JDGMissingImageKeys,
		JDGNotificationBanner,
		JDGSelect,
		JDGTextArea,
		JDGTextInput
	} from '$lib/index.js';
	import { jdgColors, jdgBreakpoints } from '$lib/jdg-shared-styles.js';

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

	// Helper function to get missing image keys (for display in edit mode)
	function getMissingImageKeys(imageKeys, registry) {
		if (!isEditing || !registry || !Array.isArray(imageKeys)) return [];
		return imageKeys.filter((key) => typeof key === 'string' && !getImageMetaByKey(registry, key));
	}

	// Function to get image display data for a given field key
	// Returns resolved images and missing image keys
	function getImageDisplayData(fieldKey) {
		const imageKeys = $localEventStore[fieldKey] || [];
		const resolvedImages = resolveImageMetaKeys(imageKeys, imageMetaRegistry);
		const missingImageKeys = getMissingImageKeys(imageKeys, imageMetaRegistry);
		return { resolvedImages, missingImageKeys };
	}

	// Display values for description and source - use image data if isMediaWrapper is true
	$: displayDescription =
		$localEventStore.isMediaWrapper && firstImageMeta?.caption
			? firstImageMeta.caption
			: $localEventStore.description ?? '';
	$: displaySource =
		$localEventStore.isMediaWrapper && firstImageMeta?.attribution
			? firstImageMeta.attribution
			: $localEventStore.source ?? '';

	// When event is a media wrapper, use image date/isApprxDate if they exist; otherwise use event values (same as JDGTimelineEvent)
	$: effectiveDate =
		$localEventStore.isMediaWrapper && firstImageMeta?.date != null
			? firstImageMeta.date
			: $localEventStore.date ?? '';
	$: effectiveIsApprxDate =
		$localEventStore.isMediaWrapper && firstImageMeta?.isApprxDate != null
			? firstImageMeta.isApprxDate
			: $localEventStore.isApprxDate ?? false;

	// Reactive computed values for checkbox visibility
	// Checkbox should appear if type supports it, regardless of isMediaWrapper value
	// The isMediaWrapper flag only controls whether the checkbox is checked, not visibility
	// Only show when editing and if type supports it
	// Only evaluate if store has been populated (type is defined)
	$: isArticleType = $localEventStore?.type === jdgTimelineEventKeys.article;
	$: isMediaType = $localEventStore?.type === jdgTimelineEventKeys.media;
	$: shouldShowCheckbox =
		isEditing &&
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

	// Resolve combobox/select value to friendly label for read-only display
	function getLabelForValue(value, options) {
		if (!value) return '';
		if (!options || !Array.isArray(options)) return value;
		const option = options.find((opt) => opt.value === value);
		return option ? option.label : value;
	}

	// Responsive styles using jdgBreakpoints (match JDGTimelineEvent eventAgeCss / eventFaIconCss / eventDescriptionCss)
	const bp0 = jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit;
	const bp1 = jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit;

	const eventHeaderViewCss = css`
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.7rem;
		@media (min-width: ${bp0}) and (max-width: ${bp1}) {
			font-size: 0.8rem;
		}
		@media (min-width: ${bp1}) {
			font-size: 0.9rem;
		}
	`;

	const eventHeaderIconCss = css`
		font-size: 0.8rem;
		@media (min-width: ${bp0}) and (max-width: ${bp1}) {
			font-size: 0.9rem;
		}
		@media (min-width: ${bp1}) {
			font-size: 1rem;
		}
	`;

	const readoutTextCss = css`
		color: inherit;
		font-size: 0.8rem;
		@media (min-width: ${bp0}) and (max-width: ${bp1}) {
			font-size: 0.9rem;
		}
		@media (min-width: ${bp1}) {
			font-size: 1rem;
		}
	`;

	const readoutApproximateCss = css`
		font-size: 0.75rem;
		@media (min-width: ${bp0}) and (max-width: ${bp1}) {
			font-size: 0.75rem;
		}
		@media (min-width: ${bp1}) {
			font-size: 0.8rem;
		}
	`;
</script>

<JDGForm bind:containerRef={parentRef}>
	<!-- Image Meta Registry indicator (locked to timeline's registry); admin only -->
	<JDGNotificationBanner
		showBanner={!!registryRepoName && $isAdminMode}
		notificationType={jdgNotificationTypes.information}
		message={`Image Meta Registry: ${registryLabel}`}
	/>

	<!-- Event type and age header -->
	<div class="event-header">
		<div class="event-header-age {eventHeaderViewCss}">
			<i
				class="fa-solid {currentTypeIcon} {eventHeaderIconCss}"
				title="{sentenceCaseLabel} event"
			/>
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
				hint="Optionally use date, description, and source from the media item in this event"
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
		<!-- Source field only shows when editing or when it has content, or when isMediaWrapper is checked and first media has source -->
		<!-- Images field only shows when editing or when the event has at least one image -->
		{#if (key !== 'source' || isEditing || $localEventStore.source || ($localEventStore.isMediaWrapper && firstImageMeta?.attribution)) && (key !== 'images' || isEditing || hasImages)}
			<JDGInputContainer label={def.label}>
				{#if def.inputType === JDG_INPUT_TYPES.DATE}
					<div class="date-with-checkbox">
						{#if isEditing}
							{#if isAdditional}
								<JDGDatePicker bind:inputValue={$localAdditionalStore[key]} isEnabled={true} />
							{:else if key === 'date'}
								<!-- Key must not include the live date (or other values that change while typing): remounting would steal focus. Only isMediaWrapper swaps disabled+image date vs editable store date. -->
								{#key $localEventStore.isMediaWrapper}
									{#if $localEventStore.isMediaWrapper}
										<JDGDatePicker inputValue={effectiveDate} isEnabled={false} />
									{:else}
										<JDGDatePicker bind:inputValue={$localEventStore.date} isEnabled={true} />
									{/if}
								{/key}
							{:else}
								<JDGDatePicker bind:inputValue={$localEventStore[key]} isEnabled={true} />
							{/if}
							{#if key === 'date'}
								{#key `${$localEventStore.isMediaWrapper}-${effectiveIsApprxDate}`}
									{#if $localEventStore.isMediaWrapper}
										<JDGCheckbox
											label="Is approximate?"
											isChecked={effectiveIsApprxDate}
											isEnabled={false}
										/>
									{:else}
										<JDGCheckbox
											label="Is approximate?"
											bind:isChecked={$localEventStore.isApprxDate}
											isEnabled={true}
										/>
									{/if}
								{/key}
							{/if}
						{:else}
							<!-- Read-only: simple text date readout -->
							{#if isAdditional}
								<span class={readoutTextCss}
									>{formatTimelineEventDateLong($localAdditionalStore[key])}</span
								>
							{:else if key === 'date'}
								<span class={readoutTextCss}
									>{formatTimelineEventDateLong(effectiveDate, effectiveIsApprxDate)}</span
								>
								{#if effectiveIsApprxDate}
									<span class="readout-approximate {readoutApproximateCss}">(approximate)</span>
								{/if}
							{:else}
								<span class={readoutTextCss}
									>{formatTimelineEventDateLong($localEventStore[key])}</span
								>
							{/if}
						{/if}
					</div>
				{:else if def.inputType === JDG_INPUT_TYPES.TEXT}
					{#if isEditing}
						{#if isAdditional}
							<JDGTextInput bind:inputValue={$localAdditionalStore[key]} isEnabled={true} />
						{:else if key === 'description'}
							<JDGTextInput bind:inputValue={$localEventStore.description} isEnabled={true} />
						{:else if key === 'source'}
							<JDGTextInput bind:inputValue={$localEventStore.source} isEnabled={true} />
						{:else}
							<JDGTextInput bind:inputValue={$localEventStore[key]} isEnabled={true} />
						{/if}
					{:else}
						<!-- Read-only: simple text readout -->
						{#if isAdditional}
							<div class="readout-description {readoutTextCss}">
								{$localAdditionalStore[key] || ''}
							</div>
						{:else if key === 'description'}
							<div class="readout-description {readoutTextCss}">{displayDescription || ''}</div>
						{:else if key === 'source'}
							<div class={readoutTextCss}>{getLabelForValue(displaySource, def.options) || ''}</div>
						{:else}
							<div class={readoutTextCss}>{$localEventStore[key] || ''}</div>
						{/if}
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.COMBOBOX}
					{#if isEditing}
						{#if isAdditional}
							<JDGCombobox
								bind:inputValue={$localAdditionalStore[key]}
								options={def.options || []}
								isEnabled={true}
							/>
						{:else if key === 'source'}
							<JDGCombobox
								bind:inputValue={$localEventStore.source}
								options={def.options || []}
								isEnabled={true}
							/>
						{:else}
							<JDGCombobox
								bind:inputValue={$localEventStore[key]}
								options={def.options || []}
								isEnabled={true}
							/>
						{/if}
					{:else}
						<!-- Read-only: simple text readout -->
						{#if isAdditional}
							<div class={readoutTextCss}>
								{getLabelForValue($localAdditionalStore[key], def.options) || ''}
							</div>
						{:else if key === 'source'}
							<div class={readoutTextCss}>{getLabelForValue(displaySource, def.options) || ''}</div>
						{:else}
							<div class={readoutTextCss}>
								{getLabelForValue($localEventStore[key], def.options) || ''}
							</div>
						{/if}
					{/if}
				{:else if def.inputType === JDG_INPUT_TYPES.TEXTAREA}
					{#if isEditing}
						{#if isAdditional}
							<JDGTextArea bind:inputValue={$localAdditionalStore[key]} isEnabled={true} />
						{:else if key === 'description'}
							<JDGTextArea bind:inputValue={$localEventStore.description} isEnabled={true} />
						{:else}
							<JDGTextArea bind:inputValue={$localEventStore[key]} isEnabled={true} />
						{/if}
					{:else}
						<!-- Read-only: simple text readout with pleasant line spacing -->
						{#if isAdditional}
							<div class="readout-description {readoutTextCss}">
								{$localAdditionalStore[key] || ''}
							</div>
						{:else if key === 'description'}
							<div class="readout-description {readoutTextCss}">{displayDescription || ''}</div>
						{:else}
							<div class="readout-description {readoutTextCss}">{$localEventStore[key] || ''}</div>
						{/if}
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
						{#if true}
							{@const imageDisplayData = getImageDisplayData(key)}
							{#if imageDisplayData.resolvedImages?.length > 0 || imageDisplayData.missingImageKeys.length > 0}
								<div class="image-list-display">
									{#if imageDisplayData.resolvedImages?.length > 0}
										<JDGImageThumbnailGroup
											imageMetaSet={imageDisplayData.resolvedImages}
											maxImageHeight={'30svh'}
										/>
									{/if}
									{#if imageDisplayData.missingImageKeys.length > 0 && isEditing}
										<div class="missing-images-actions">
											<JDGButton
												label="Remove all dead references"
												faIcon="fa-trash"
												onClickFunction={() => {
													localEventStore.update((store) => {
														const currentImages = store[key] || [];
														const missingSet = new Set(imageDisplayData.missingImageKeys);
														const updatedImages = currentImages.filter(
															(imgKey) => !missingSet.has(imgKey)
														);
														return { ...store, [key]: updatedImages };
													});
												}}
												paddingLeftRight="12px"
												paddingTopBottom="6px"
												fontSize="13px"
												backgroundColor={jdgColors.delete}
												tooltip="Remove all image keys that are not in the registry from this event"
											/>
										</div>
										<JDGMissingImageKeys
											missingImageKeys={imageDisplayData.missingImageKeys}
											onRemoveImage={(missingKey) => {
												localEventStore.update((store) => {
													const currentImages = store[key] || [];
													const updatedImages = currentImages.filter(
														(imgKey) => imgKey !== missingKey
													);
													return { ...store, [key]: updatedImages };
												});
											}}
										/>
									{/if}
								</div>
							{/if}
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

	.event-header-type-label {
		font-weight: 500;
	}

	.event-header-separator {
		color: #999;
		font-weight: 300;
	}

	.event-header-age {
		color: #666;
	}

	.form-store-preview {
		margin-top: 20px;
	}

	.image-list-display {
		margin-bottom: 12px;
	}

	.missing-images-actions {
		margin-bottom: 8px;
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

	.date-with-checkbox {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.readout-approximate {
		color: #888;
		display: block;
		margin-top: -3px;
	}

	.readout-description {
		line-height: 1.6;
		white-space: pre-wrap;
		max-height: 16em;
		overflow-y: auto;
		text-wrap: balance;
	}
</style>
