import { addCloudinaryUrlTransformation, upgradeImageMetaRegistry } from '$lib/jdg-utils.js';

// This registry contains all available images and their metadata
// New images with a caption must be added manually or via ImageMetaModal
const imageMetaRegistry = {
	aerial_60s70s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959961/jdg-ui-svelte/history/aerial-60s70s-1_e4hg6b.jpg',
		alt: 'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		caption:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions! Here, have some more text! Even more now.',
		attribution: 'Englewood Public Library (AI recolored)'
	},
	architecture_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959964/jdg-ui-svelte/project-tiles/architecture_gdysdx.jpg',
		alt: 'Architecture',
		caption: 'Architecture',
		attribution: 'Author'
	},
	cc_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/history/CCP1_fgtgm4.jpg',
		alt: 'The Blue Mall as seen in 1968.',
		caption: 'The Blue Mall as seen in 1968.',
		attribution: 'Englewood Public Library'
	},
	get cc_2() {
		const newImageAttributes = Object.assign({}, this.cc_1);
		newImageAttributes.caption =
			'This image is cc_2 but is a copy of cc_1 with a caption override.';
		return newImageAttributes;
	},
	ccp_ouatacc_white: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/ccp/ouatacc-white_sa1pne.png',
		alt: `Once Upon a Time at Cinderella City.`
	},
	ccp_blue_mall_60s70s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959965/jdg-ui-svelte/ccp/blue-mall-60s70s-1_kpzlxi.png',
		alt: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		caption: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		attribution: 'Englewood Public Library (AI recolored)',
		toolbarJustification: 'center'
	},
	ccp_blue_mall_80s90s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959967/jdg-ui-svelte/ccp/blue-mall-80s90s-1_kwxmgp.png',
		alt: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		caption: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		attribution: 'Englewood Public Library (AI recolored)'
	},
	ccp_gold_mall_60s70s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959968/jdg-ui-svelte/ccp/gold-mall-60s70s-1_nylla3.png',
		alt: `Cinderella City's Gold Mall, simulated in the 1968-1978 era.`
	},
	ccp_gold_mall_80s90s_1: {
		id: 'c958317e-3c70-4f01-a384-8d302b87159d',
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959969/jdg-ui-svelte/ccp/gold-mall-80s90s-1_jzmeeb.png',
		alt: "Cinderella City's Gold Mall as it appeared in the 1980s and 1990s",
		caption: "Cinderella City's Gold Mall as it appeared in the 1980s and 1990s"
	},
	lakeside_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959966/jdg-ui-svelte/history/lakeside-1_kcrblc.jpg',
		alt: 'Lakeside Mall in 1956.',
		caption:
			'Lakeside Mall in 1956. And a ton of other words to test a very long caption. Keep going. How long of a caption can we make? Possibly this long. Actually we need an even longer caption if you can believe it!',
		attribution: 'Denver Public Library'
	},
	rose_mall_60s70s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959963/jdg-ui-svelte/history/rose-mall-60s70s-1_ncv9le.jpg',
		alt: 'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		caption:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions! Even longer longer longer captions!',
		attribution: 'Denver Public Library'
	},
	rose_mall_60s70s_2: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1740202820/jdg-ui-svelte/history/rose-mall-60s70s-2.jpg',
		alt: 'Offices above Rose Mall.',
		caption: 'Offices above Rose Mall.',
		attribution: 'Denver Public Library'
	},
	fairgrounds_aerial: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg',
		caption:
			'This is a very long caption. The intent is to demonstrate an image with a caption longer than another image in the same carousel, so the expand/collapse button updates appropriately when the imageMeta change.'
	},
	speer_point_before: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg',
		caption: 'The original building at 10th and Speer in Denver.'
	},
	speer_point_after: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg',
		caption:
			'The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.',
		showBackgroundBlur: false
	},
	rose_mall_60s70s_construction_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716962804/ccp-website/rose-mall/rose-mall-60s70s-construction-1_ketke8.jpg',
		alt: 'Rose Mall during construction in 1967.',
		caption: 'Rose Mall during construction in 1967.',
		attribution: 'Englewood Public Library'
	},
	plan_60s70s_1: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716962803/ccp-website/plans/plan-60s70s-1_wkmpff.png',
		alt: 'Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.',
		caption: 'Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.',
		attribution: 'Englewood Public Library'
	},
	mindful_multifamily: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg'
	},
	mindful_multifamily_close: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg'
	},
	mindful_multifamily_highway: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg'
	},
	arch: {
		atc_elevator: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238891/jdg-website/arch/atc-elevator.jpg'
		},
		atc_escalator: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238899/jdg-website/arch/atc-escalator.jpg'
		},
		atc_food_court: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238895/jdg-website/arch/atc-food-court.jpg'
		},
		bayou_mixed_use_1: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721190776/jdg-website/arch/bayou-mixed-use-1.jpg'
		},
		bayou_mixed_use_2: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721190775/jdg-website/arch/bayou-mixed-use-2.jpg'
		},
		bayou_mixed_use_3: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721190778/jdg-website/arch/bayou-mixed-use-3.jpg'
		},
		bayou_mixed_use_4: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721190780/jdg-website/arch/bayou-mixed-use-4.jpg'
		},
		beach_chic_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195652/jdg-website/arch/beach-chic-aerial.jpg'
		},
		beach_chic_concourse: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195659/jdg-website/arch/beach-chic-concourse.jpg'
		},
		beach_chic_towers: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195656/jdg-website/arch/beach-chic-tower.jpg'
		},
		fairgrounds_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg'
		},
		fairgrounds_fountain: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195166/jdg-website/arch/fairgrounds-fountain.jpg'
		},
		fairgrounds_park: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195168/jdg-website/arch/fairgrounds-park.jpg'
		},
		fairgrounds_river: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721195172/jdg-website/arch/fairgrounds-river.jpg'
		},
		gritty_bbq_option_2: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721237165/jdg-website/arch/gritty-bbq-option-2.jpg'
		},
		gritty_bbq_option_3: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721237169/jdg-website/arch/gritty-bbq-option-3.jpg'
		},
		gritty_bbq_option_5: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721237173/jdg-website/arch/gritty-bbq-option-5.jpg'
		},
		mindful_campus_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721194603/jdg-website/arch/mindful-campus-aerial.jpg'
		},
		mindful_campus_boulevard: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721194614/jdg-website/arch/mindful-campus-boulevard.jpg'
		},
		mindful_campus_boulevard_close: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721194610/jdg-website/arch/mindful-campus-boulevard-close.jpg'
		},
		mindful_campus_plaza: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721194607/jdg-website/arch/mindful-campus-plaza.jpg'
		},
		mindful_multifamily: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg'
		},
		mindful_multifamily_close: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg'
		},
		mindful_multifamily_highway: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg'
		},
		old_orchard_close: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193084/jdg-website/arch/old-orchard-close.jpg'
		},
		old_orchard_covered: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193090/jdg-website/arch/old-orchard-covered.jpg'
		},
		old_orchard_outside: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193086/jdg-website/arch/old-orchard-outside.jpg'
		},
		otc_below: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721192359/jdg-website/arch/otc-below.jpg'
		},
		otc_column: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721192352/jdg-website/arch/otc-column.jpg'
		},
		otc_far: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721192357/jdg-website/arch/otc-far.jpg'
		},
		otc_rendering: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721192362/jdg-website/arch/otc-rendering.png'
		},
		otc_seating: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721192355/jdg-website/arch/otc-seating.jpg'
		},
		random_school_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193919/jdg-website/arch/random-school-aerial.jpg'
		},
		random_school_before_exterior: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193912/jdg-website/arch/random-school-before-exterior.jpg'
		},
		random_school_before_walkway: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193922/jdg-website/arch/random-school-before-walkway.jpg'
		},
		random_school_canopy: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193926/jdg-website/arch/random-school-canopy.jpg'
		},
		random_school_play: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193929/jdg-website/arch/random-school-play.jpg'
		},
		random_school_terrace: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721193932/jdg-website/arch/random-school-terrace.jpg'
		},
		texas_lobby: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721191975/jdg-website/arch/texas-lobby.jpg'
		}
	},
	exp: {
		broadway_southwest_before_1: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721173132/jdg-website/exp/broadway-southwest-before-1.jpg',
			caption:
				"Built in 1985 as the Broadway Southwest, the department store later became May D&F and then Foley's before Cinderella City closed in 1997."
		},
		broadway_southwest_before_2: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721173134/jdg-website/exp/broadway-southwest-before-2.jpg',
			caption:
				'After Cinderella City was demolished in 1998, the former department store was saved and converted into the Englewood Civic Center.'
		},
		broadway_southwest_concept_1_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176141/jdg-website/exp/broadway-southwest-concept-1-aerial.jpg',
			caption: 'An aerial showing Concept 1 and its design intent.'
		},
		broadway_southwest_concept_1_market: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176149/jdg-website/exp/broadway-southwest-concept-1-market.jpg',
			caption: "A farmer's market takes place in the east paseo."
		},
		broadway_southwest_concept_1_promenade: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176151/jdg-website/exp/broadway-southwest-concept-1-promenade.jpg',
			caption:
				'A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.'
		},
		broadway_southwest_concept_2_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176142/jdg-website/exp/broadway-southwest-concept-2-aerial.jpg',
			caption: 'An aerial showing Concept 1 and its design intent.'
		},
		broadway_southwest_concept_2_passage: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176145/jdg-website/exp/broadway-southwest-concept-2-passage.jpg',
			caption:
				"The new passageway could serve as a connection to the site's history, educating visitors about the park and mall that preceded the Civic Center."
		},
		broadway_southwest_concept_2_promenade: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721176146/jdg-website/exp/broadway-southwest-concept-2-promenade.jpg',
			caption:
				'A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.'
		},
		corporate_showroom_before: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-before.jpg',
			caption: 'The existing building at 15th Street and Delgany is beige, boring, and corporate.'
		},
		corporate_showroom_corner: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721076293/jdg-website/exp/1551-wewatta-corner.jpg',
			caption:
				'The new showroom and cafe adds amenities like a fireplace, improved materials, and a more pedestrian scale to the intersection.'
		},
		corporate_showroom_elevation: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-elevation.jpg',
			caption: 'The new showroom and cafe as seen through an orthographic elevation view.'
		},
		encode_campus_after: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721170481/jdg-website/exp/encode-campus-after.jpg',
			caption:
				'An urban plaza anchors the new building design in the foreground, bookended by modernized existing brick buildings on either side..'
		},
		fifteen_platte_dynamo: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721180332/jdg-website/exp/fifteen-platte-dynamo.jpg',
			caption:
				'FormIt and Dynamo working together to iterate on the exterior structural column design.'
		},
		fifteen_platte_grayscale: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-grayscale.jpg',
			caption: 'Eliminating the materials and colors for a shading study.'
		},
		fifteen_platte_sunset: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-sunset.jpg',
			caption:
				'A glassy office building gets some shade from extended floor plates and some style thanks to the angled exterior columns.'
		},
		fms_campus_before_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721091660/jdg-website/exp/fms-campus-before-aerial.jpg',
			caption: 'An abandoned Flood Middle School is seen from above in 2013.'
		},
		fms_campus_before_1: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073616/jdg-website/exp/fms-campus-before-1.jpg',
			caption: 'Flood Middle School as it appeared from Broadway during demolition in 2013.'
		},
		fms_campus_before_2: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073611/jdg-website/exp/fms-campus-before-2.jpg',
			caption: 'The northwest corner of Flood Middle School during abandonment in 2013.'
		},
		fms_campus_before_3: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073613/jdg-website/exp/fms-campus-before-3.jpg',
			caption:
				'The southeast corner of Flood Middle School at Lincoln and Kenyon as seen during abandonment in 2013.'
		},
		fms_campus_before_4: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073614/jdg-website/exp/fms-campus-before-4.jpg',
			caption: 'The northeast corner of Flood Middle School as seen during abandonment in 2013.'
		},
		fms_campus_aerial: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721090862/jdg-website/exp/fms-campus-aerial.jpg',
			caption:
				'The main school building is repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.'
		},
		fms_campus_lawn: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073527/jdg-website/exp/fms-campus-lawn.jpg',
			caption:
				'The main building of the school is kept and repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.'
		},
		fms_campus_kenyon_corner: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073526/jdg-website/exp/fms-campus-kenyon-corner.jpg',
			caption:
				'At the intersection of Kenyon and Lincoln, the former middle school entrance becomes a common entrance for the back of the walk-up townhomes. The hotel can be seen on the right.'
		},
		fms_campus_massing: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721106934/jdg-website/exp/fms-campus-massing.jpg',
			caption:
				'One possible reuse option is a mix of retail (red), office (green), townhomes (pink), apartments (teal), and hotel (gold).'
		},
		fms_campus_plaza: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073530/jdg-website/exp/fms-campus-plaza.jpg',
			caption:
				"The school's largest gym is demolished on the northwest corner to make room for a pedestrian paseo, overlooked by the original small gymnasium which has been converted to boutique office and retail."
		},
		fms_campus_paseo: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073528/jdg-website/exp/fms-campus-paseo.jpg',
			caption:
				'A new hotel augments the existing building, providing nearly 100 rooms and adding scale to the northeast corner of the school. A new paseo on the north side provides a shady plaza for food trucks and informal outdoor dining.'
		},
		fms_campus_south_wing: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721073531/jdg-website/exp/fms-campus-south-wing.jpg',
			caption:
				'On the south side of the school, an existing two-floor wing is transformed into walk-up townhomes.'
		},
		o2_research: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721184331/jdg-website/exp/o2-research-lobby.jpg',
			caption: 'A spacious and curvacious lobby, with ample foliage and gathering spaces.'
		},
		ranch_elsie_option_3: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721182476/jdg-website/exp/ranch-elsie-option-3.jpg',
			caption:
				'The layout takes advantage of the natural site topography, and the roof design was the result of computational design in Autodesk FormIt and Dynamo.'
		},
		ranch_elsie_roof_optioneering: {
			src: addCloudinaryUrlTransformation(
				'https://res.cloudinary.com/jdg-main/image/upload/v1721182479/jdg-website/exp/ranch-elsie-roof-optioneering.gif'
			),
			caption:
				'Quick roof optioneering studies made possible by the integration between Autodesk FormIt and Autodesk Dynamo.'
		},
		sixteen_pearl_before: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721154488/jdg-website/exp/sixteen-pearl-before.jpg',
			caption: 'The original apartment building in 2015.'
		},
		sixteen_pearl_corner: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-corner.jpg',
			caption:
				'New 3-story walk-up townhomes fit within the original building, with an added rooftop deck and outdoor spaces on each level.'
		},
		sixteen_pearl_interior: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-interior.jpg',
			caption:
				'A bright, glassy stairwell provides vertical access and brightens spaces throughout the units and building.'
		},
		sixteen_pearl_terrace: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-terrace.jpg',
			caption: 'Exterior spaces are added on the front and roof of each unit.'
		},
		speer_point_before: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg',
			caption: 'The original building at 10th and Speer in Denver.'
		},
		speer_point_after: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg',
			caption:
				'The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.'
		}
	},
	hst: {
		fms_2000s_plan_additions: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/fms-2000s-plan-additions.png',
			caption: 'The school complex became a mess of additions and renovations by the 2000s.',
			attribution: 'Josh Goldstein',
			showBackgroundBlur: false
		},
		ehs_1920_broadway_northeast: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/ehs-1920-broadway-northeast.jpg',
			caption:
				'Englewood High School viewed from Broadway in 1920, a year after it was constructed.',
			attribution: 'Englewood Public Library'
		},
		ehs_1936_southeast_wing: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722745253/jdg-website/hst/ehs-1936-southeast-wing.jpg',
			caption:
				'The south wing under construction in 1936. This would become the main entrance of Flood Junior High in the 1960s.',
			attribution: 'Englewood Public Library'
		},
		ehs_1950s_broadway_entrance: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722747056/jdg-website/hst/ehs-1950s-broadway-entrance.jpg',
			caption: 'The original main entrance of Englewood High School as seen in the 1950s.',
			attribution: 'Englewood Public Library'
		},
		fms_1960s_broadway_entrance: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722747053/jdg-website/hst/fms-1960s-broadway-entrance.jpg',
			caption:
				'After the 1960s remodel, little remains of the former grand entrance off of Broadway.',
			attribution: 'Englewood Public Library'
		},
		fms_1960s_broadway_entrance_renovation: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722747336/jdg-website/hst/fms-1960s-broadway-entrance-renovation.jpg',
			caption:
				"In 1965, crews began to remove ornate architectural details around the former entrance to match the district's new architectural standards.",
			attribution: 'Englewood Public Library'
		},
		fms_1968_southeast_corner_entrance: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722746162/jdg-website/hst/fms-1968-southeast-corner-entrance.jpg',
			caption:
				'The renovated south wing, new east wing, and new junior high school main entrance in the 1960s.',
			attribution: 'Englewood Public Library'
		},
		fms_2013_broadway_northeast: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/fms-2013-broadway-northeast.jpg',
			caption:
				"Flood Middle School's simplistic shell concealed the original Englewood High School building below it, as seen from Broadway during demolition in 2013.",
			attribution: 'Josh Goldstein'
		},
		ehs_1919_plan: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/ehs-1919-plan.png',
			caption: "Englewood High School's original layout in 1919.",
			attribution: 'Englewood Public Library',
			showBackgroundBlur: false
		}
	},
	ind: {
		planter_003F_1: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1726422539/pmx-website/products/003F-1.jpg',
			caption: 'Advanced Planter'
		}
	},
	swe: {
		ccp_1: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716962800/ccp-website/ccp/ccp-composite-2.jpg',
			caption:
				'A composite image of two different time periods of a mid-century modern shopping center, powered by Unity.'
		}
	},
	products_0: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1720834651/jdg-website/products/products-0.jpg',
		alt: 'Products',
		caption: 'Products'
	},
	software_0: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1720834658/jdg-website/software/software-0.jpg',
		alt: 'Software',
		caption: 'Software'
	},
	ecc_existing_north: {
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1739673653/ccp-website/save-civic-center/ecc-existing-north.jpg',
		caption:
			"The Englewood Civic Center's north side faces into plaza where it formerly attached to Cinderella City Mall.",
		attribution: 'Englewood Public Library'
	},
	new_image: {
		id: 'bc95fbce-7da3-402f-81c8-237795d56b75',
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1764447881/jdg-ui-svelte/image-testing/new-image.jpg.png'
	},
	reupload_test: {
		id: '1f8e9f97-8fe5-43fa-a316-1d370cf82cda',
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1765245473/jdg-ui-svelte/image-testing/reupload-test2.jpg',
		alt: 'This is a reupload test!',
		caption: 'This is a reupload test!',
		attribution: 'Some attribution'
	},
	new_image_2: {
			id: '9ff5a56e-da1f-4206-a8b1-785467fc78d1',
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1765342010/jdg-ui-svelte/image-testing/new-image-2.jpg',
			alt: 'This is another test image',
			caption: 'This is another test image',
			attribution: 'Some attribution'
	}
};

// Upgrade the registry - this upgrades and post-processes each imageMeta
const upgradedimageMetaRegistry = upgradeImageMetaRegistry(imageMetaRegistry);

export { upgradedimageMetaRegistry as imageMetaRegistry };
