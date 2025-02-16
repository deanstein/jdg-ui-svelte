import {
	addCloudinaryUrlTransformation,
	instantiateObject,
	postProcessImageAttributes
} from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = {
	aerial_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959961/jdg-ui-svelte/history/aerial-60s70s-1_e4hg6b.jpg',
		imgAlt:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions! Here, have some more text! Even more now.',
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	architecture_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959964/jdg-ui-svelte/project-tiles/architecture_gdysdx.jpg',
		imgAlt: 'Architecture',
		imgCaption: 'Architecture',
		imgAttribution: 'Author'
	}),
	cc_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/history/CCP1_fgtgm4.jpg',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.',
		imgAttribution: 'Englewood Public Library'
	}),
	get cc_2() {
		const newImageAttributes = Object.assign({}, this.cc_1);
		newImageAttributes.imgCaption =
			'This image is cc_2 but is a copy of cc_1 with a caption override.';
		return newImageAttributes;
	},
	ccp_ouatacc_white: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/ccp/ouatacc-white_sa1pne.png',
		imgAlt: `Once Upon a Time at Cinderella City.`
	}),
	ccp_blue_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959965/jdg-ui-svelte/ccp/blue-mall-60s70s-1_kpzlxi.png',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)',
		toolbarAlignment: 'center'
	}),
	ccp_blue_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959967/jdg-ui-svelte/ccp/blue-mall-80s90s-1_kwxmgp.png',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	ccp_gold_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959968/jdg-ui-svelte/ccp/gold-mall-60s70s-1_nylla3.png',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1968-1978 era.`
	}),
	ccp_gold_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959969/jdg-ui-svelte/ccp/gold-mall-80s90s-1_jzmeeb.png',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1987-1997 era.`
	}),
	lakeside_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959966/jdg-ui-svelte/history/lakeside-1_kcrblc.jpg',
		imgAlt: 'Lakeside Mall in 1956.',
		imgCaption:
			'Lakeside Mall in 1956. And a ton of other words to test a very long caption. Keep going. How long of a caption can we make? Possibly this long. Actually we need an even longer caption if you can believe it!',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959963/jdg-ui-svelte/history/rose-mall-60s70s-1_ncv9le.jpg',
		imgAlt:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions! Even longer longer longer captions!',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_2: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1716959964/jdg-ui-svelte/history/rose-mall-60s70s-2_k2ac9c.jpg',
		imgAlt: 'Offices above Rose Mall.',
		imgCaption: 'Offices above Rose Mall.',
		imgAttribution: 'Denver Public Library'
	}),
	fairgrounds_aerial: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg',
			imgCaption:
				'This is a very long caption. The intent is to demonstrate an image with a caption longer than another image in the same carousel, so the expand/collapse button updates appropriately when the imageAttributes change.'
		})
	),
	speer_point_before: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg',
			imgCaption: 'The original building at 10th and Speer in Denver.'
		})
	),
	speer_point_after: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg',
			imgCaption:
				'The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.',
			allowBackgroundBlur: false
		})
	),
	rose_mall_60s70s_construction_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716962804/ccp-website/rose-mall/rose-mall-60s70s-construction-1_ketke8.jpg',
		imgAlt: 'Rose Mall during construction in 1967.',
		imgCaption: 'Rose Mall during construction in 1967.',
		imgAttribution: 'Englewood Public Library'
	}),
	plan_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716962803/ccp-website/plans/plan-60s70s-1_wkmpff.png',
		imgAlt: 'Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.',
		imgCaption:
			'Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.',
		imgAttribution: 'Englewood Public Library'
	}),
	mindful_multifamily: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg'
		})
	),
	mindful_multifamily_close: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg'
		})
	),
	mindful_multifamily_highway: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg'
		})
	),
	arch: {
		atc_elevator: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238891/jdg-website/arch/atc-elevator.jpg'
			})
		),
		atc_escalator: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238899/jdg-website/arch/atc-escalator.jpg'
			})
		),
		atc_food_court: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238895/jdg-website/arch/atc-food-court.jpg'
			})
		),
		bayou_mixed_use_1: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721190776/jdg-website/arch/bayou-mixed-use-1.jpg'
			})
		),
		bayou_mixed_use_2: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721190775/jdg-website/arch/bayou-mixed-use-2.jpg'
			})
		),
		bayou_mixed_use_3: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721190778/jdg-website/arch/bayou-mixed-use-3.jpg'
			})
		),
		bayou_mixed_use_4: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721190780/jdg-website/arch/bayou-mixed-use-4.jpg'
			})
		),
		beach_chic_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195652/jdg-website/arch/beach-chic-aerial.jpg'
			})
		),
		beach_chic_concourse: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195659/jdg-website/arch/beach-chic-concourse.jpg'
			})
		),
		beach_chic_towers: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195656/jdg-website/arch/beach-chic-tower.jpg'
			})
		),
		fairgrounds_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg'
			})
		),
		fairgrounds_fountain: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195166/jdg-website/arch/fairgrounds-fountain.jpg'
			})
		),
		fairgrounds_park: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195168/jdg-website/arch/fairgrounds-park.jpg'
			})
		),
		fairgrounds_river: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721195172/jdg-website/arch/fairgrounds-river.jpg'
			})
		),
		gritty_bbq_option_2: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721237165/jdg-website/arch/gritty-bbq-option-2.jpg'
			})
		),
		gritty_bbq_option_3: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721237169/jdg-website/arch/gritty-bbq-option-3.jpg'
			})
		),
		gritty_bbq_option_5: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721237173/jdg-website/arch/gritty-bbq-option-5.jpg'
			})
		),
		mindful_campus_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721194603/jdg-website/arch/mindful-campus-aerial.jpg'
			})
		),
		mindful_campus_boulevard: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721194614/jdg-website/arch/mindful-campus-boulevard.jpg'
			})
		),
		mindful_campus_boulevard_close: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721194610/jdg-website/arch/mindful-campus-boulevard-close.jpg'
			})
		),
		mindful_campus_plaza: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721194607/jdg-website/arch/mindful-campus-plaza.jpg'
			})
		),
		mindful_multifamily: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg'
			})
		),
		mindful_multifamily_close: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg'
			})
		),
		mindful_multifamily_highway: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg'
			})
		),
		old_orchard_close: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193084/jdg-website/arch/old-orchard-close.jpg'
			})
		),
		old_orchard_covered: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193090/jdg-website/arch/old-orchard-covered.jpg'
			})
		),
		old_orchard_outside: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193086/jdg-website/arch/old-orchard-outside.jpg'
			})
		),
		otc_below: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721192359/jdg-website/arch/otc-below.jpg'
			})
		),
		otc_column: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721192352/jdg-website/arch/otc-column.jpg'
			})
		),
		otc_far: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721192357/jdg-website/arch/otc-far.jpg'
			})
		),
		otc_rendering: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721192362/jdg-website/arch/otc-rendering.png'
			})
		),
		otc_seating: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721192355/jdg-website/arch/otc-seating.jpg'
			})
		),
		random_school_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193919/jdg-website/arch/random-school-aerial.jpg'
			})
		),
		random_school_before_exterior: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193912/jdg-website/arch/random-school-before-exterior.jpg'
			})
		),
		random_school_before_walkway: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193922/jdg-website/arch/random-school-before-walkway.jpg'
			})
		),
		random_school_canopy: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193926/jdg-website/arch/random-school-canopy.jpg'
			})
		),
		random_school_play: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193929/jdg-website/arch/random-school-play.jpg'
			})
		),
		random_school_terrace: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721193932/jdg-website/arch/random-school-terrace.jpg'
			})
		),
		texas_lobby: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721191975/jdg-website/arch/texas-lobby.jpg'
			})
		)
	},
	exp: {
		broadway_southwest_before_1: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721173132/jdg-website/exp/broadway-southwest-before-1.jpg',
				imgCaption:
					"Built in 1985 as the Broadway Southwest, the department store later became May D&F and then Foley's before Cinderella City closed in 1997."
			})
		),
		broadway_southwest_before_2: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721173134/jdg-website/exp/broadway-southwest-before-2.jpg',
				imgCaption:
					'After Cinderella City was demolished in 1998, the former department store was saved and converted into the Englewood Civic Center.'
			})
		),
		broadway_southwest_concept_1_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176141/jdg-website/exp/broadway-southwest-concept-1-aerial.jpg',
				imgCaption: 'An aerial showing Concept 1 and its design intent.'
			})
		),
		broadway_southwest_concept_1_market: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176149/jdg-website/exp/broadway-southwest-concept-1-market.jpg',
				imgCaption: "A farmer's market takes place in the east paseo."
			})
		),
		broadway_southwest_concept_1_promenade: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176151/jdg-website/exp/broadway-southwest-concept-1-promenade.jpg',
				imgCaption:
					'A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.'
			})
		),
		broadway_southwest_concept_2_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176142/jdg-website/exp/broadway-southwest-concept-2-aerial.jpg',
				imgCaption: 'An aerial showing Concept 1 and its design intent.'
			})
		),
		broadway_southwest_concept_2_passage: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176145/jdg-website/exp/broadway-southwest-concept-2-passage.jpg',
				imgCaption:
					"The new passageway could serve as a connection to the site's history, educating visitors about the park and mall that preceded the Civic Center."
			})
		),
		broadway_southwest_concept_2_promenade: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721176146/jdg-website/exp/broadway-southwest-concept-2-promenade.jpg',
				imgCaption:
					'A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.'
			})
		),
		corporate_showroom_before: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-before.jpg',
				imgCaption:
					'The existing building at 15th Street and Delgany is beige, boring, and corporate.'
			})
		),
		corporate_showroom_corner: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721076293/jdg-website/exp/1551-wewatta-corner.jpg',
				imgCaption:
					'The new showroom and cafe adds amenities like a fireplace, improved materials, and a more pedestrian scale to the intersection.'
			})
		),
		corporate_showroom_elevation: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-elevation.jpg',
				imgCaption: 'The new showroom and cafe as seen through an orthographic elevation view.'
			})
		),
		encode_campus_after: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721170481/jdg-website/exp/encode-campus-after.jpg',
				imgCaption:
					'An urban plaza anchors the new building design in the foreground, bookended by modernized existing brick buildings on either side..'
			})
		),
		fifteen_platte_dynamo: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721180332/jdg-website/exp/fifteen-platte-dynamo.jpg',
				imgCaption:
					'FormIt and Dynamo working together to iterate on the exterior structural column design.'
			})
		),
		fifteen_platte_grayscale: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-grayscale.jpg',
				imgCaption: 'Eliminating the materials and colors for a shading study.'
			})
		),
		fifteen_platte_sunset: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-sunset.jpg',
				imgCaption:
					'A glassy office building gets some shade from extended floor plates and some style thanks to the angled exterior columns.'
			})
		),
		fms_campus_before_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721091660/jdg-website/exp/fms-campus-before-aerial.jpg',
				imgCaption: 'An abandoned Flood Middle School is seen from above in 2013.'
			})
		),
		fms_campus_before_1: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073616/jdg-website/exp/fms-campus-before-1.jpg',
				imgCaption: 'Flood Middle School as it appeared from Broadway during demolition in 2013.'
			})
		),
		fms_campus_before_2: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073611/jdg-website/exp/fms-campus-before-2.jpg',
				imgCaption: 'The northwest corner of Flood Middle School during abandonment in 2013.'
			})
		),
		fms_campus_before_3: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073613/jdg-website/exp/fms-campus-before-3.jpg',
				imgCaption:
					'The southeast corner of Flood Middle School at Lincoln and Kenyon as seen during abandonment in 2013.'
			})
		),
		fms_campus_before_4: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073614/jdg-website/exp/fms-campus-before-4.jpg',
				imgCaption:
					'The northeast corner of Flood Middle School as seen during abandonment in 2013.'
			})
		),
		fms_campus_aerial: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721090862/jdg-website/exp/fms-campus-aerial.jpg',
				imgCaption:
					'The main school building is repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.'
			})
		),
		fms_campus_lawn: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073527/jdg-website/exp/fms-campus-lawn.jpg',
				imgCaption:
					'The main building of the school is kept and repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.'
			})
		),
		fms_campus_kenyon_corner: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073526/jdg-website/exp/fms-campus-kenyon-corner.jpg',
				imgCaption:
					'At the intersection of Kenyon and Lincoln, the former middle school entrance becomes a common entrance for the back of the walk-up townhomes. The hotel can be seen on the right.'
			})
		),
		fms_campus_massing: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721106934/jdg-website/exp/fms-campus-massing.jpg',
				imgCaption:
					'One possible reuse option is a mix of retail (red), office (green), townhomes (pink), apartments (teal), and hotel (gold).'
			})
		),
		fms_campus_plaza: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073530/jdg-website/exp/fms-campus-plaza.jpg',
				imgCaption:
					"The school's largest gym is demolished on the northwest corner to make room for a pedestrian paseo, overlooked by the original small gymnasium which has been converted to boutique office and retail."
			})
		),
		fms_campus_paseo: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073528/jdg-website/exp/fms-campus-paseo.jpg',
				imgCaption:
					'A new hotel augments the existing building, providing nearly 100 rooms and adding scale to the northeast corner of the school. A new paseo on the north side provides a shady plaza for food trucks and informal outdoor dining.'
			})
		),
		fms_campus_south_wing: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721073531/jdg-website/exp/fms-campus-south-wing.jpg',
				imgCaption:
					'On the south side of the school, an existing two-floor wing is transformed into walk-up townhomes.'
			})
		),
		o2_research: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721184331/jdg-website/exp/o2-research-lobby.jpg',
				imgCaption: 'A spacious and curvacious lobby, with ample foliage and gathering spaces.'
			})
		),
		ranch_elsie_option_3: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721182476/jdg-website/exp/ranch-elsie-option-3.jpg',
				imgCaption:
					'The layout takes advantage of the natural site topography, and the roof design was the result of computational design in Autodesk FormIt and Dynamo.'
			})
		),
		ranch_elsie_roof_optioneering: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721182479/jdg-website/exp/ranch-elsie-roof-optioneering.gif',
				imgCaption:
					'Quick roof optioneering studies made possible by the integration between Autodesk FormIt and Autodesk Dynamo.'
			})
		),
		sixteen_pearl_before: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721154488/jdg-website/exp/sixteen-pearl-before.jpg',
				imgCaption: 'The original apartment building in 2015.'
			})
		),
		sixteen_pearl_corner: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-corner.jpg',
				imgCaption:
					'New 3-story walk-up townhomes fit within the original building, with an added rooftop deck and outdoor spaces on each level.'
			})
		),
		sixteen_pearl_interior: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-interior.jpg',
				imgCaption:
					'A bright, glassy stairwell provides vertical access and brightens spaces throughout the units and building.'
			})
		),
		sixteen_pearl_terrace: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-terrace.jpg',
				imgCaption: 'Exterior spaces are added on the front and roof of each unit.'
			})
		),
		speer_point_before: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg',
				imgCaption: 'The original building at 10th and Speer in Denver.'
			})
		),
		speer_point_after: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg',
				imgCaption:
					'The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.'
			})
		)
	},
	hst: {
		fms_2000s_plan_additions: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/fms-2000s-plan-additions.png',
				imgCaption: 'The school complex became a mess of additions and renovations by the 2000s.',
				imgAttribution: 'Josh Goldstein',
				allowBackgroundBlur: false
			})
		),
		ehs_1920_broadway_northeast: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/ehs-1920-broadway-northeast.jpg',
				imgCaption:
					'Englewood High School viewed from Broadway in 1920, a year after it was constructed.',
				imgAttribution: 'Englewood Public Library'
			})
		),
		ehs_1936_southeast_wing: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722745253/jdg-website/hst/ehs-1936-southeast-wing.jpg',
				imgCaption:
					'The south wing under construction in 1936. This would become the main entrance of Flood Junior High in the 1960s.',
				imgAttribution: 'Englewood Public Library'
			})
		),
		ehs_1950s_broadway_entrance: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722747056/jdg-website/hst/ehs-1950s-broadway-entrance.jpg',
				imgCaption: 'The original main entrance of Englewood High School as seen in the 1950s.',
				imgAttribution: 'Englewood Public Library'
			})
		),
		fms_1960s_broadway_entrance: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722747053/jdg-website/hst/fms-1960s-broadway-entrance.jpg',
				imgCaption:
					'After the 1960s remodel, little remains of the former grand entrance off of Broadway.',
				imgAttribution: 'Englewood Public Library'
			})
		),
		fms_1960s_broadway_entrance_renovation: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722747336/jdg-website/hst/fms-1960s-broadway-entrance-renovation.jpg',
				imgCaption:
					"In 1965, crews began to remove ornate architectural details around the former entrance to match the district's new architectural standards.",
				imgAttribution: 'Englewood Public Library'
			})
		),
		fms_1968_southeast_corner_entrance: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722746162/jdg-website/hst/fms-1968-southeast-corner-entrance.jpg',
				imgCaption:
					'The renovated south wing, new east wing, and new junior high school main entrance in the 1960s.',
				imgAttribution: 'Englewood Public Library'
			})
		),
		fms_2013_broadway_northeast: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/fms-2013-broadway-northeast.jpg',
				imgCaption:
					"Flood Middle School's simplistic shell concealed the original Englewood High School building below it, as seen from Broadway during demolition in 2013.",
				imgAttribution: 'Josh Goldstein'
			})
		),
		ehs_1919_plan: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/ehs-1919-plan.png',
				imgCaption: "Englewood High School's original layout in 1919.",
				imgAttribution: 'Englewood Public Library',
				allowBackgroundBlur: false
			})
		)
	},
	ind: {
		planter_003F_1: postProcessImageAttributes(
			instantiateObject(jdgImageAttributes, {
				imgSrc:
					'https://res.cloudinary.com/jdg-main/image/upload/v1726422539/pmx-website/products/003F-1.jpg',
				imgCaption: 'Advanced Planter'
			})
		)
	},
	swe: {
		ccp_1: instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716962800/ccp-website/ccp/ccp-composite-2.jpg',
			imgCaption:
				'A composite image of two different time periods of a mid-century modern shopping center, powered by Unity.'
		})
	},
	products_0: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1720834651/jdg-website/products/products-0.jpg',
		imgAlt: 'Products',
		imgCaption: 'Products'
	}),
	software_0: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/v1720834658/jdg-website/software/software-0.jpg',
		imgAlt: 'Software',
		imgCaption: 'Software'
	}),
	ecc_existing_1: postProcessImageAttributes(
		instantiateObject(jdgImageAttributes, {
			imgSrc:
				'https://res.cloudinary.com/jdg-main/image/upload/v1739673653/ccp-website/ccp/ecc-existing-1.jpg',
			imgCaption:
				"The Englewood Civic Center's north side faces into plaza where it formerly attached to Cinderella City Mall.",
			imgAttribution: 'Englewood Public Library'
		})
	)
};

export { imageAttributesCollection };
