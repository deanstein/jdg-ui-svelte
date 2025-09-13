import { jdgColors } from '$lib/jdg-shared-styles.js';

const jdgComposeButtonTypes = {
	add: {
		type: 'add',
		faIcon: 'fa-plus fa-fw',
		tooltip: 'Add',
		color: jdgColors.active,
		backgroundColor: '#ffffff'
	},
	delete: {
		type: 'delete',
		faIcon: 'fa-trash fa-fw',
		tooltip: 'Delete',
		color: '#ffffff',
		backgroundColor: jdgColors.delete
	},
	edit: {
		type: 'edit',
		faIcon: 'fa-pencil fa-fw',
		tooltip: 'Edit',
		color: jdgColors.active,
		backgroundColor: '#ffffff'
	},
	confirm: {
		type: 'confirm',
		faIcon: 'fa-check fa-fw',
		tooltip: 'Confirm',
		color: '#ffffff',
		backgroundColor: jdgColors.done
	},
	cancel: {
		type: 'cancel',
		faIcon: 'fa-x fa-fw',
		tooltip: 'Cancel',
		color: jdgColors.active,
		backgroundColor: '#ffffff'
	}
};

export default jdgComposeButtonTypes;
