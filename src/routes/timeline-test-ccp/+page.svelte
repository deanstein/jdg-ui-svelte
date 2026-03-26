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
		<JDGTimeline timelineHost={$hostStore} minHeight="70vh" maxHeight="70vh" allowEditing={false} />
	</JDGContentBoxFloating>
</JDGContentContainer>
