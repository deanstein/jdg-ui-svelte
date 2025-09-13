// the various types of timeline events and the additionalContent they can display
// this is used for upgrading timeline events
// to ensure no errors when new data is supported
const jdgTimelineEventTypes = {
	today: {
		icon: 'fa-sun'
	},

	birth: {
		icon: 'fa-wand-magic-sparkles',
		additionalContent: {
			birthtime: '',
			birthplace: '',
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
		additionalContent: {
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

export default jdgTimelineEventTypes;
