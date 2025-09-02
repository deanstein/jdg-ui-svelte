import timelineEventContent from './timeline-event-content';

const timelineEvent = {
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

export default timelineEvent;
