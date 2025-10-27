const workingColor = '#fff176';
const successColor = '#c8e6c9';
const failedColor = '#ffcdd2';

const jdgSaveStatus = {
	unsavedChanges: {
		color: '#fff9c4',
		label: 'You have unsaved changes.'
	},
	loading: {
		color: workingColor,
		label: 'Loading...'
	},
	loadSucccess: {
		color: successColor,
		label: 'Loaded!'
	},
	saving: {
		color: workingColor,
		label: 'Saving...'
	},
	saveFailed: {
		color: failedColor,
		label: 'Save failed :('
	},
	saveSuccess: {
		color: successColor,
		label: 'Saved!'
	}
};

export default jdgSaveStatus;
