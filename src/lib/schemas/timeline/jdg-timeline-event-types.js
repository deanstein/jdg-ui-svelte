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
	/* ========== GENERIC ========== */
	/* Base event types applicable to people, buildings, etc. */
	article: {
		label: 'Article',
		icon: 'fa-newspaper',
		additionalContent: {
			publication: {
				default: '',
				label: 'Publication',
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
	memory: {
		label: 'Memory',
		icon: 'fa-comment'
	},
	quote: {
		label: 'Quote',
		icon: 'fa-regular fa-comment',
		additionalContent: {
			attribution: {
				default: '',
				label: 'Attribution',
				inputType: JDG_INPUT_TYPES.TEXT
			}
		}
	},
	statistic: {
		label: 'Statistic',
		icon: 'fa-chart-line'
	},
	/* ========== GENERIC (CONTEXTUAL) ========== */
	/* Not selectable in selectors or clickable in Timelines */
	context: {
		label: 'Contextual Event',
		icon: 'fa-globe',
		isContextual: true
	},
	// Inception is only used when
	// no inception event is set, and there are no other events
	inception: {
		label: 'Inception',
		icon: 'fa-wand-magic-sparkles',
		description: 'Inception',
		isContextual: true
	},
	reference: {
		label: 'Event Reference',
		icon: 'fa-asterisk',
		isContextual: true
	},
	today: {
		icon: 'fa-sun',
		isContextual: true,
		description: 'Today'
	},
	world: {
		label: 'World Event',
		icon: 'fa-globe',
		isContextual: true
	},

	/* ========== PEOPLE ========== */
	/* Event types applicable to people, used in apps like Family Tree */
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
	education: {
		label: 'Education',
		icon: 'fa-graduation-cap'
	},
	relationship: {
		label: 'Relationship',
		icon: 'fa-heart'
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
	/* ========== PEOPLE (CONTEXTUAL) ========== */
	/* Not selectable in selectors or clickable in Timelines */
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

	/* ========== BUILDINGS ========== */
	/* Base event types applicable to buildings, used in apps like CCP */
	ownershipChanged: {
		label: 'Ownership Changed',
		icon: 'fa-handshake'
	},
	planning: {
		label: 'Planning',
		icon: 'fa-compass-drafting'
	},
	renovation: {
		label: 'Renovation',
		icon: 'fa-person-digging'
	},
	storeClosed: {
		label: 'Store Closed',
		icon: 'fa-store-slash'
	},
	storeOpened: {
		label: 'Store Opened',
		icon: 'fa-store'
	}
};

// All top-level keys from the schema above
export const jdgTimelineEventKeys = Object.fromEntries(
	Object.keys(jdgTimelineEventTypes).map((key) => [key, key])
);

export default jdgTimelineEventTypes;
