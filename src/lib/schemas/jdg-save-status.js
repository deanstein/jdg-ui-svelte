import JDG_NOTIFICATION_TYPES from './jdg-notification-types.js';

const JDG_SAVE_STATUS = Object.freeze({
	unsavedChanges: {
		label: 'You have unsaved changes.',
		notificationType: JDG_NOTIFICATION_TYPES.warning // color, icon
	},
	loading: {
		label: 'Loading...',
		notificationType: JDG_NOTIFICATION_TYPES.inProgress // color, icon
	},
	loadSucccess: {
		label: 'Loaded!',
		notificationType: JDG_NOTIFICATION_TYPES.success // color, icon
	},
	uploading: {
		label: 'Uploading...',
		notificationType: JDG_NOTIFICATION_TYPES.inProgress // color, icon
	},
	saving: {
		label: 'Saving...',
		notificationType: JDG_NOTIFICATION_TYPES.inProgress // color, icon
	},
	saveFailed: {
		label: 'Save failed :(',
		notificationType: JDG_NOTIFICATION_TYPES.error // color, icon
	},
	saveSuccess: {
		label: 'Saved!',
		notificationType: JDG_NOTIFICATION_TYPES.success // color, icon
	},
	saveSuccessRebuilding: {
		label:
			'Saved! Website is now rebuilding with the new image metadata. Refresh to see the changes.',
		notificationType: JDG_NOTIFICATION_TYPES.successPersistent // color, icon - persistent so user remembers to refresh
	}
});

export default JDG_SAVE_STATUS;
