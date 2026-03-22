<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import JDG_CONTEXTS from '$lib/jdg-contexts.js';
	import {
		buildingDataCollectionKey,
		fetchJsonFileList,
		jdgBuildingDataRepoName,
		jdgRepoOwner,
		readJsonFileFromRepo
	} from '$lib/jdg-persistence-management.js';
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGTimeline
	} from '$lib/index.js';

	// Age-display wording for timeline events
	setContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_POSITIVE, 'after opening');
	setContext(JDG_CONTEXTS.EVENT_AGE_SUFFIX_NEGATIVE, 'before opening');

	// undefined → loading spinner; null → no data; object → render timeline
	const hostStore = writable(undefined);

	onMount(async () => {
		const files = await fetchJsonFileList(jdgRepoOwner, jdgBuildingDataRepoName);
		if (files?.length) {
			const data = await readJsonFileFromRepo(jdgRepoOwner, jdgBuildingDataRepoName, files[0]);
			const hosts = data?.[buildingDataCollectionKey];
			if (hosts?.length) {
				hostStore.set(hosts[0]);
				return;
			}
		}
		// Fetch completed but no valid host found
		hostStore.set(null);
	});
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating title="Cin City Timeline Test" animateWhenVisible={false}>
		<JDGBodyCopy textAlign="center" textWrap="balance" paddingTop="0"
			>Standalone timeline as it would appear on the Cinderella City Project website.
			<br /><br />To edit, go to <a href="/timeline-test">Timeline Test</a>.
		</JDGBodyCopy>
		<div class="timeline-area">
			<div class="timeline-slot">
				<JDGTimeline
					timelineHost={$hostStore}
					minHeight="0"
					maxHeight="100%"
					allowEditing={false}
				/>
			</div>
		</div>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	.timeline-area {
		position: relative;
		align-self: stretch; /* override parent align-items: center so we fill width */
		width: 100%;
		/* Fixed height so timeline + title bar stay inside the content box */
		height: 70vh;
		min-height: 300px;
		max-height: 70vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* Force the timeline component to fit: flex shrink + min-height 0 so it can’t overflow */
	.timeline-slot {
		flex: 1 1 0;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* Timeline root (.timeline-wrapper) must fill the slot so maxHeight="100%" works */
	.timeline-slot :global(.timeline-wrapper) {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	/* Allow wrapper to shrink when timeline content is present; loading state is handled by Timeline */

	.timeline-slot :global(.timeline-container) {
		flex: 1 1 0;
		min-height: 0;
	}

	.timeline-slot :global(.timeline-wrapper:not(.loading-overlay-visible)) {
		min-height: 0;
	}
</style>
