const jdgNotificationTypes = {
	error: {
		color: '#ff7777',
		message: 'An error occurred.',
		faIcon: 'fa-circle-xmark'
	},
	warning: {
		color: '#FFFF3C',
		message: 'This is a warning.',
		faIcon: 'fa-triangle-exclamation'
	},
	information: {
		color: '#ADD8E6',
		message: 'This is an information message.',
		faIcon: 'fa-circle-info'
	},
	inProgress: {
		color: '#EFF18C',
		message: 'Operation in progress.',
		faIcon: 'fa-spinner fa-spin'
	},
	success: {
		color: '#a7ff68',
		message: 'Operation successful.',
		faIcon: 'fa-circle-check'
	}
};

export default jdgNotificationTypes;
