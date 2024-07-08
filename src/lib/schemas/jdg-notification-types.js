const jdgNotificationTypes = {
	error: {
		id: 'error',
		color: '#DB7093',
		message: 'An error occurred.',
		icon: 'error-icon'
	},
	warning: {
		id: 'warning',
		color: '#FFFFE0',
		message: 'This is a warning.',
		icon: 'warning-icon'
	},
	information: {
		id: 'information',
		color: '#ADD8E6',
		message: 'This is an information message.',
		icon: 'info-icon'
	},
	inProgress: {
		id: 'inProgress',
		color: '#FFFF00',
		message: 'Operation in progress.',
		icon: 'progress-icon'
	},
	success: {
		id: 'success',
		color: '#77FF16',
		message: 'Operation successful.',
		icon: 'success-icon'
	}
};

export default jdgNotificationTypes;
