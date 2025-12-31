import jdgNotificationTypes from './jdg-notification-types.js';

const jdgSaveStatus = {
	unsavedChanges: {
		label: 'You have unsaved changes.',
		notificationType: jdgNotificationTypes.warning // color, icon
	},
	loading: {
		label: 'Loading...',
		notificationType: jdgNotificationTypes.inProgress // color, icon
	},
	loadSucccess: {
		label: 'Loaded!',
		notificationType: jdgNotificationTypes.success // color, icon
	},
	uploading: {
		label: 'Uploading...',
		notificationType: jdgNotificationTypes.inProgress // color, icon
	},
	saving: {
		label: 'Saving...',
		notificationType: jdgNotificationTypes.inProgress // color, icon
	},
	saveFailed: {
		label: 'Save failed :(',
		notificationType: jdgNotificationTypes.error // color, icon
	},
	saveSuccess: {
		label: 'Saved!',
		notificationType: jdgNotificationTypes.success // color, icon
	},
	saveSuccessRebuilding: {
		label:
			'Saved! Website is now rebuilding with the new image metadata. Refresh to see the changes.',
		notificationType: jdgNotificationTypes.successPersistent // color, icon - persistent so user remembers to refresh
	}
};

export default jdgSaveStatus;
