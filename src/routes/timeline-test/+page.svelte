<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageTile,
		JDGTimeline
	} from '$lib/index.js';
	import { doShowTimelineEventDetailsModal } from '$lib/states/ui-state.js';
	import { timelineEditEvent } from '$lib/stores/jdg-temp-store.js';
	import { imageMetaCollection } from '../image-meta-collection.js';
	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGTimeline onClickTimelineEvent={setTimelineEventActive} />
	</JDGContentBoxFloating>
</JDGContentContainer>
