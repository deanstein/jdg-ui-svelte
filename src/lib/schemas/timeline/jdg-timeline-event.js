import timelineEventContent from '$lib/schemas/timeline/jdg-timeline-event-content.js';

const jdgTimelineEvent = {
	id: '',
	type: '',
	date: '',
	isApprxDate: false,
	content: (() => {
		let content = {};
		Object.keys(timelineEventContent).forEach((element) => {
			content[element] = [];
		});
		return content;
	})(),
	version: ''
};

export default jdgTimelineEvent;
