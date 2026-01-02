<script>
	// @ts-nocheck

	import { getContext } from 'svelte';
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
		extractUiFromDataSchema
	} from '$lib/jdg-timeline-management.js';
	import {
		addOrReplaceObjectByKeyValue,
		deleteObjectByKeyValue,
		getYearsAndMonthsBetweenDates,
		formatAgeDisplayWithRounding,
		getIsObjectInArray,
		instantiateObject,
		resolveImageMetaKeys
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

	// Sync when parent store changes
	$: {
		const snapshot = get(eventStore);
		localEventStore.set({ ...snapshot });
		localAdditionalStore.set({ ...snapshot.additionalContent });
		// Also sync the previousType when parent changes
		previousType = snapshot.type;
	}

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
		.filter(([key]) => key !== 'isApprxDate')
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
			<i class="fa-solid {currentTypeIcon} event-header-icon" title="{currentTypeLabel} event" />
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
					{#if isAdditional}
						<!-- Image display - keyed to update when selection changes -->
						{#key $localAdditionalStore[key]?.length}
							{#if resolveImageMetaKeys($localAdditionalStore[key] || [], imageMetaRegistry)?.length > 0}
								<div class="image-list-display">
									<JDGImageThumbnailGroup
										imageMetaSet={resolveImageMetaKeys(
											$localAdditionalStore[key] || [],
											imageMetaRegistry
										)}
									/>
								</div>
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
										: ($localAdditionalStore[key]?.length || 0) > 0
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
										selectedImages={$localAdditionalStore[key] || []}
										isEnabled={isEditing}
										{registryRepoName}
										requireRegistry={true}
										onSelectionChange={(newSelection) => {
											localAdditionalStore.update((store) => ({
												...store,
												[key]: newSelection
											}));
										}}
									/>
								</div>
							{/if}
						{/if}
					{:else}
						<!-- Image display - keyed to update when selection changes -->
						{#key $localEventStore[key]?.length}
							{#if resolveImageMetaKeys($localEventStore[key] || [], imageMetaRegistry)?.length > 0}
								<div class="image-list-display">
									<JDGImageThumbnailGroup
										imageMetaSet={resolveImageMetaKeys(
											$localEventStore[key] || [],
											imageMetaRegistry
										)}
										maxImageHeight={'15svh'}
									/>
								</div>
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
		background-color: rgba(240, 240, 240, 0.5);
		border-radius: 8px;
		margin-bottom: 12px;
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
