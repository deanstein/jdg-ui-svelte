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
	}
};

export default jdgSaveStatus;
