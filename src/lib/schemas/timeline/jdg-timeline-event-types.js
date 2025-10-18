import { JDG_INPUT_TYPES } from './jdg-input-types.js';

// the various types of timeline events and the additionalContent they can display
// this is used for upgrading timeline events
// to ensure no errors when new data is supported

export const timelineEventStrings = {
	birthEventModalTitle: 'Birth Event Details',
	deathEventModalTitle: 'Death Event Details',
	deceased: 'Deceased',
	childEventModalTitle: 'Child Event Details',
	residenceEventModalTitle: 'Residence Event Details',
	vehicleEventModalTitle: 'Vehicle Event Details',
	textEventModalTitle: 'Event Details'
};

const jdgTimelineEventTypes = {
	birth: {
		label: 'Birth',
		icon: 'fa-wand-magic-sparkles',
		additionalContent: {
			birthplace: {
				default: '',
				label: 'Place of Birth',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			birthtime: {
				default: '',
				label: 'Time of Birth',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			additionalContext: {
				default: '',
				label: 'Additional Context',
				inputType: JDG_INPUT_TYPES.TEXTAREA
			}
		}
	},

	death: {
		label: 'Death',
		icon: 'fa-umbrella-beach',
		additionalContent: {
			deathPlace: {
				default: '',
				label: 'Place of Death',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			deathTime: {
				default: '',
				label: 'Time of Death',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			deathCause: {
				default: '',
				label: 'Cause of Death',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			disposition: {
				default: '',
				label: 'Disposition Details',
				inputType: JDG_INPUT_TYPES.TEXT
			}
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
		additionalContent: {
			year: {
				default: '',
				label: 'Year',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			make: {
				default: '',
				label: 'Manufacturer',
				inputType: JDG_INPUT_TYPES.TEXT
			},
			model: {
				default: '',
				label: 'Model',
				inputType: JDG_INPUT_TYPES.TEXT
			}
		}
	},

	relationship: {
		label: 'Relationship',
		icon: 'fa-heart'
	},

	// This is only used when
	// no inception event is set, and there are no other events
	inception: {
		label: 'Inception',
		icon: 'fa-wand-magic-sparkles',
		description: 'Inception',
		isContextual: true
	},

	// Contextual types:
	// Not selectable in drop-down selectors or clickable in Timelines
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
	},
	today: {
		icon: 'fa-sun',
		isContextual: true,
		description: 'Today'
	}
};

// All top-level keys from the schema above
export const jdgTimelineEventKeys = Object.fromEntries(
	Object.keys(jdgTimelineEventTypes).map((key) => [key, key])
);

export default jdgTimelineEventTypes;
