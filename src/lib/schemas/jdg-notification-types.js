const jdgNotificationTypes = {
	error: {
		color: '#DB7093',
		message: 'An error occurred.',
		faIcon: 'fa-circle-xmark'
	},
	warning: {
		color: '#FFFFE0',
		message: 'This is a warning.',
		faIcon: 'fa-triangle-exclamation'
	},
	information: {
		color: '#ADD8E6',
		message: 'This is an information message.',
		faIcon: 'fa-circle-info'
	},
	inProgress: {
		color: '#FFFF00',
		message: 'Operation in progress.',
		faIcon: 'fa-spinner fa-spin'
	},
	success: {
		color: '#77FF16',
		message: 'Operation successful.',
		faIcon: 'fa-circle-check'
	}
};

export default jdgNotificationTypes;
