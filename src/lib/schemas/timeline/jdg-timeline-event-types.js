// the various types of timeline events and the additionalContent they can display
// this is used for upgrading timeline events
// to ensure no errors when new data is supported

export const JDG_INPUT_TYPES = {
	TEXT: 'text',
	TEXTAREA: 'textarea',
	TIME: 'time',
	DATE: 'date',
	NUMBER: 'number',
	SELECT: 'select',
	MULTISELECT: 'multiSelect',
	CHECKBOX: 'checkbox',
	IMAGE_LIST: 'imageList',
	OBJECT: 'object'
};

export const timelineEventStrings = {
	birthEventModalTitle: 'Birth Event Details',
	deathEventModalTitle: 'Death Event Details',
	deceased: 'Deceased',
	deathDate: 'Date of Death',
	deathPlace: 'Place of Death',
	deathTime: 'Time of Death',
	deathCause: 'Cause of Death',
	childEventModalTitle: 'Child Event Details',
	residenceEventModalTitle: 'Residence Event Details',
	vehicleEventModalTitle: 'Vehicle Event Details',
	textEventModalTitle: 'Event Details',
	additionalContext: 'Additional Context'
};

const jdgTimelineEventTypes = {
	today: {
		icon: 'fa-sun'
	},

	birth: {
		id: 'birth',
		label: 'Birth Event',
		icon: 'fa-wand-magic-sparkles',
		additionalContent: {
			birthdate: {
				default: '',
				label: 'Date of Birth',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			birthtime: {
				default: '',
				label: 'Time of Birth',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			birthplace: {
				default: '',
				label: 'Place of Birth',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			additionalContext: ''
		}
	},

	death: {
		icon: 'fa-umbrella-beach',
		additionalContent: {
			deathTime: '',
			deathPlace: '',
			deathCause: '',
			disposition: ''
		}
	},

	generic: {
		label: 'Generic',
		icon: 'fa-rectangle-list'
	},

	media: {
		label: 'Media',
		icon: 'fa-image'
	},

	education: {
		label: 'Education',
		icon: 'fa-graduation-cap'
	},

	residence: {
		label: 'Residence',
		icon: 'fa-house'
	},

	workplace: {
		label: 'Workplace',
		icon: 'fa-building'
	},

	vehicle: {
		label: 'Vehicle',
		icon: 'fa-car',
		additionaladditionalContent: {
			make: '',
			model: '',
			year: ''
		}
	},

	relationship: {
		label: 'Relationship',
		icon: 'fa-heart'
	},

	/*** contextual types, don't show in type selector dropdown ***/
	context: {
		label: 'Contextual Event',
		icon: 'fa-globe',
		isContextual: true
	},
	reference: {
		label: 'Event Reference',
		icon: 'fa-asterisk',
		isContextual: true
	},
	childBirth: {
		label: 'Child Born',
		icon: 'fa-child-reaching',
		isContextual: true,
		additionalContent: {
			childId: ''
		}
	},
	parentDeath: {
		label: 'Parent Death',
		icon: 'fa-feather',
		isContextual: true,
		additionalContent: {
			parentId: ''
		}
	},
	world: {
		label: 'World Event',
		icon: 'fa-globe',
		isContextual: true
	}
};

// All top-level keys from the schema above
export const JDGTimelineEventKeys = Object.fromEntries(
	Object.keys(jdgTimelineEventTypes).map((key) => [key, key])
);

export default jdgTimelineEventTypes;
