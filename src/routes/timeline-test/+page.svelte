<script>
	import jdgTimelineHost from '$lib/schemas/timeline/jdg-timeline-host.js';

	import { setTimelineEventActive } from '$lib/jdg-ui-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGContentBoxFloating, JDGContentContainer, JDGTimeline } from '$lib/index.js';

	const ccmTimelineHost = instantiateObject(jdgTimelineHost);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGTimeline timelineHost={ccmTimelineHost} onClickTimelineEvent={setTimelineEventActive} />
	</JDGContentBoxFloating>
</JDGContentContainer>
