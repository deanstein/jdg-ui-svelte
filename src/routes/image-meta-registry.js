import { addCloudinaryUrlTransformation, upgradeImageMetaRegistry } from '$lib/jdg-utils.js';

// all available images and their metadata
// new images with a caption must be added here
const imageMetaRegistry = {
"aerial_60s70s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959961/jdg-ui-svelte/history/aerial-60s70s-1_e4hg6b.jpg",
		"alt": "Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!",
		"caption": "Cinderella City as it appeared in 1968. And a bunch of other words to test long captions! Here, have some more text! Even more now.",
		"attribution": "Englewood Public Library (AI recolored)",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "ea3716cb-0579-4b8c-80a4-3dc9e8b8b865"
	},
	"architecture_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959964/jdg-ui-svelte/project-tiles/architecture_gdysdx.jpg",
		"alt": "Architecture",
		"caption": "Architecture",
		"attribution": "Author",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "4db53912-54bd-4f70-98f7-b560e15bc58b"
	},
	"cc_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/history/CCP1_fgtgm4.jpg",
		"alt": "The Blue Mall as seen in 1968.",
		"caption": "The Blue Mall as seen in 1968.",
		"attribution": "Englewood Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "2a502fa4-a72f-4e40-9291-6165679b1829"
	},
	"cc_2": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/history/CCP1_fgtgm4.jpg",
		"alt": "The Blue Mall as seen in 1968.",
		"caption": "This image is cc_2 but is a copy of cc_1 with a caption override.",
		"attribution": "Englewood Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "8ed0fda1-c98f-4544-b7cb-508e29796858"
	},
	"ccp_ouatacc_white": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959962/jdg-ui-svelte/ccp/ouatacc-white_sa1pne.png",
		"alt": "Once Upon a Time at Cinderella City.",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "523ccc8b-fd0e-4f04-aebd-c9cf0ff0f9d7"
	},
	"ccp_blue_mall_60s70s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959965/jdg-ui-svelte/ccp/blue-mall-60s70s-1_kpzlxi.png",
		"alt": "Cinderella City's central Blue Mall, simulated in the 1968-1978 era.",
		"caption": "Cinderella City's central Blue Mall, simulated in the 1968-1978 era.",
		"attribution": "Englewood Public Library (AI recolored)",
		"toolbarJustification": "center",
		"showBackgroundBlur": true,
		"version": "0.2.0",
		"id": "4072844c-0e8e-4763-82ad-9a4eb9f163c8"
	},
	"ccp_blue_mall_80s90s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959967/jdg-ui-svelte/ccp/blue-mall-80s90s-1_kwxmgp.png",
		"alt": "Cinderella City's central Blue Mall, simulated in the 1987-1997 era.",
		"caption": "Cinderella City's central Blue Mall, simulated in the 1987-1997 era.",
		"attribution": "Englewood Public Library (AI recolored)",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "3d1a3038-a900-4c3e-8854-9197fd1b2eff"
	},
	"ccp_gold_mall_60s70s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959968/jdg-ui-svelte/ccp/gold-mall-60s70s-1_nylla3.png",
		"alt": "Cinderella City's Gold Mall, simulated in the 1968-1978 era.",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "afbd00ed-1996-4fe9-9d22-a329fd1dbebc"
	},
	"ccp_gold_mall_80s90s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959969/jdg-ui-svelte/ccp/gold-mall-80s90s-1_jzmeeb.png",
		"alt": "Cinderella City's Gold Mall, simulated in the 1987-1997 era.",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "be7e59e9-8c76-441f-a147-a758ae14ae62"
	},
	"lakeside_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959966/jdg-ui-svelte/history/lakeside-1_kcrblc.jpg",
		"alt": "Lakeside Mall in 1956.",
		"caption": "Lakeside Mall in 1956. And a ton of other words to test a very long caption. Keep going. How long of a caption can we make? Possibly this long. Actually we need an even longer caption if you can believe it!",
		"attribution": "Denver Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "71ac4fd4-15f6-48d1-bbc6-85bd3c050e2d"
	},
	"rose_mall_60s70s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716959963/jdg-ui-svelte/history/rose-mall-60s70s-1_ncv9le.jpg",
		"alt": "Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!",
		"caption": "Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions! Even longer longer longer captions!",
		"attribution": "Denver Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "fc0bc076-08d6-48a7-acf3-039cb1374506"
	},
	"rose_mall_60s70s_2": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1740202820/jdg-ui-svelte/history/rose-mall-60s70s-2.jpg",
		"alt": "Offices above Rose Mall.",
		"caption": "Offices above Rose Mall.",
		"attribution": "Denver Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "6f4a02ca-104f-4044-bd1b-3d4f466b537a"
	},
	"fairgrounds_aerial": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg",
		"caption": "This is a very long caption. The intent is to demonstrate an image with a caption longer than another image in the same carousel, so the expand/collapse button updates appropriately when the imageMeta change.",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "0bf8bd52-58ec-49f9-96b0-008e0525213b",
		"alt": "This is a very long caption. The intent is to demonstrate an image with a caption longer than another image in the same carousel, so the expand/collapse button updates appropriately when the imageMeta change."
	},
	"speer_point_before": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg",
		"caption": "The original building at 10th and Speer in Denver.",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "aabefcd1-7f84-4ac1-975e-a7248bceb857",
		"alt": "The original building at 10th and Speer in Denver."
	},
	"speer_point_after": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg",
		"caption": "The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.",
		"showBackgroundBlur": false,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "0fab5b48-638a-4409-ae25-be2bac56f7f5",
		"alt": "The alternate use scheme includes artist studios, a cafe, a restaurant, and event space."
	},
	"rose_mall_60s70s_construction_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716962804/ccp-website/rose-mall/rose-mall-60s70s-construction-1_ketke8.jpg",
		"alt": "Rose Mall during construction in 1967.",
		"caption": "Rose Mall during construction in 1967.",
		"attribution": "Englewood Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "cf123b55-7869-4e36-ac4b-95f037fe1d8d"
	},
	"plan_60s70s_1": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716962803/ccp-website/plans/plan-60s70s-1_wkmpff.png",
		"alt": "Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.",
		"caption": "Cinderella City featured 5 sub-malls: Blue, Rose, Gold, Shamrock, and Cinder Alley.",
		"attribution": "Englewood Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "13887080-4179-4bbb-8427-76a3f7e9387f"
	},
	"mindful_multifamily": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "7a6099f0-42f9-4ef3-b20f-61a690deba40"
	},
	"mindful_multifamily_close": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "9fe0b423-20a0-472f-9a64-7d94abdd066a"
	},
	"mindful_multifamily_highway": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "8fad0fb1-972d-40ab-8e35-8f78c8e2d0e0"
	},
	"arch": {
		"atc_elevator": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238891/jdg-website/arch/atc-elevator.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "334a1ce8-5b04-4d47-81da-b86484d4516e"
		},
		"atc_escalator": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238899/jdg-website/arch/atc-escalator.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "83468a60-1925-42f5-8207-29cde8402b87"
		},
		"atc_food_court": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238895/jdg-website/arch/atc-food-court.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "46a04f87-4a9b-44d6-97b4-07faf9b4ee6b"
		},
		"bayou_mixed_use_1": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721190776/jdg-website/arch/bayou-mixed-use-1.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "ea1f8f80-fb4d-4cbe-aaa6-ab7901ccec05"
		},
		"bayou_mixed_use_2": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721190775/jdg-website/arch/bayou-mixed-use-2.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "5d74b9c4-c043-462f-b375-571770598cad"
		},
		"bayou_mixed_use_3": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721190778/jdg-website/arch/bayou-mixed-use-3.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "be8f7d49-93cc-41fb-ad59-57640458a6bf"
		},
		"bayou_mixed_use_4": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721190780/jdg-website/arch/bayou-mixed-use-4.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "65baf7a4-fc9b-459c-9219-9097a8e73ec2"
		},
		"beach_chic_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195652/jdg-website/arch/beach-chic-aerial.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "4976d8f6-d198-46a0-bdaf-6d8d1c0ca2c6"
		},
		"beach_chic_concourse": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195659/jdg-website/arch/beach-chic-concourse.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "1eb30303-a132-4362-a80f-9727a2940369"
		},
		"beach_chic_towers": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195656/jdg-website/arch/beach-chic-tower.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "635c3fb1-1408-46e2-8b33-64bd0bf1dd1b"
		},
		"fairgrounds_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195162/jdg-website/arch/fairgrounds-aerial.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "e01870b0-c0e0-4edf-ac27-6d8d47317024"
		},
		"fairgrounds_fountain": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195166/jdg-website/arch/fairgrounds-fountain.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "e0606a3b-3a0a-4129-897e-e8c0a2fd3874"
		},
		"fairgrounds_park": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195168/jdg-website/arch/fairgrounds-park.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "ae763087-3078-4ce5-8253-c866d96e2d89"
		},
		"fairgrounds_river": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721195172/jdg-website/arch/fairgrounds-river.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "4c380db9-6e45-47f5-9526-32b7090407d7"
		},
		"gritty_bbq_option_2": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721237165/jdg-website/arch/gritty-bbq-option-2.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "f1af3a02-b2b7-4ae4-9234-f61cc20da0b3"
		},
		"gritty_bbq_option_3": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721237169/jdg-website/arch/gritty-bbq-option-3.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "a8c69273-78de-451f-8b26-d5067754b04b"
		},
		"gritty_bbq_option_5": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721237173/jdg-website/arch/gritty-bbq-option-5.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "b4384724-eaab-467a-b5a1-9fec3599fff0"
		},
		"mindful_campus_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721194603/jdg-website/arch/mindful-campus-aerial.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "c6ff19a6-6d91-408d-9d53-37f61c000d59"
		},
		"mindful_campus_boulevard": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721194614/jdg-website/arch/mindful-campus-boulevard.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "9cde2743-d4d2-4dc9-8824-ffca2f447313"
		},
		"mindful_campus_boulevard_close": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721194610/jdg-website/arch/mindful-campus-boulevard-close.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "0e981020-2797-4f36-904a-78b3bfe24820"
		},
		"mindful_campus_plaza": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721194607/jdg-website/arch/mindful-campus-plaza.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "92e51bbd-cea4-4218-a897-5ca9ece9e7f2"
		},
		"mindful_multifamily": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238058/jdg-website/arch/mindful-multifamily.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "cf86d61f-d5e1-40db-8005-79bc1426158e"
		},
		"mindful_multifamily_close": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238061/jdg-website/arch/mindful-multifamily-close.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "d4dc720e-25a7-4dba-8e21-6ce1b68dedb3"
		},
		"mindful_multifamily_highway": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721238054/jdg-website/arch/mindful-multifamily-highway.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "2675bd3f-5897-4cce-9c39-6eb6a8ddf9ad"
		},
		"old_orchard_close": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193084/jdg-website/arch/old-orchard-close.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "ec4cc626-9f6e-4df2-b31b-f2823b9aaea9"
		},
		"old_orchard_covered": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193090/jdg-website/arch/old-orchard-covered.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "fb3feb60-86b8-45d4-96c6-93b000154b2a"
		},
		"old_orchard_outside": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193086/jdg-website/arch/old-orchard-outside.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "db682119-1f6d-4aa2-aa4e-1583d5429969"
		},
		"otc_below": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721192359/jdg-website/arch/otc-below.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "d14b1ac2-2c67-4e1f-94f9-7b4d7e7e0495"
		},
		"otc_column": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721192352/jdg-website/arch/otc-column.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "1a8a972b-8daf-48c0-900a-7f443da865d8"
		},
		"otc_far": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721192357/jdg-website/arch/otc-far.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "8e260f41-c349-4dd1-adac-d9ec385dcec4"
		},
		"otc_rendering": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721192362/jdg-website/arch/otc-rendering.png",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "b0d3043d-1017-450c-a74f-51c5ff542406"
		},
		"otc_seating": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721192355/jdg-website/arch/otc-seating.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "b3fe5d30-a1c5-4f21-a535-09e6983b3809"
		},
		"random_school_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193919/jdg-website/arch/random-school-aerial.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "33ab37a2-5fc5-464e-9136-fe9996a43175"
		},
		"random_school_before_exterior": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193912/jdg-website/arch/random-school-before-exterior.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "9fc5e863-5b38-475b-bf45-2991c366f802"
		},
		"random_school_before_walkway": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193922/jdg-website/arch/random-school-before-walkway.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "69ddc8a7-66a6-4fed-93b7-3a167a2bf6f2"
		},
		"random_school_canopy": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193926/jdg-website/arch/random-school-canopy.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "2b896400-74ab-46a1-9796-9eb1d2b6de76"
		},
		"random_school_play": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193929/jdg-website/arch/random-school-play.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "0fbb8feb-5c9a-4235-9729-307c280ee5a6"
		},
		"random_school_terrace": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721193932/jdg-website/arch/random-school-terrace.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "f380398d-8787-494f-aaf1-9fb3745c2383"
		},
		"texas_lobby": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721191975/jdg-website/arch/texas-lobby.jpg",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "5ff6f241-de12-4795-a571-872b3e1d1b35"
		}
	},
	"exp": {
		"broadway_southwest_before_1": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721173132/jdg-website/exp/broadway-southwest-before-1.jpg",
			"caption": "Built in 1985 as the Broadway Southwest, the department store later became May D&F and then Foley's before Cinderella City closed in 1997.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "0b27e01e-8865-4156-9b03-afb40ebfd99e",
			"alt": "Built in 1985 as the Broadway Southwest, the department store later became May D&F and then Foley's before Cinderella City closed in 1997."
		},
		"broadway_southwest_before_2": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721173134/jdg-website/exp/broadway-southwest-before-2.jpg",
			"caption": "After Cinderella City was demolished in 1998, the former department store was saved and converted into the Englewood Civic Center.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "610e7a19-6efa-4e3d-bdfd-9449004a0d53",
			"alt": "After Cinderella City was demolished in 1998, the former department store was saved and converted into the Englewood Civic Center."
		},
		"broadway_southwest_concept_1_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176141/jdg-website/exp/broadway-southwest-concept-1-aerial.jpg",
			"caption": "An aerial showing Concept 1 and its design intent.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "8ec2b472-4bc9-4473-b679-c33f29613846",
			"alt": "An aerial showing Concept 1 and its design intent."
		},
		"broadway_southwest_concept_1_market": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176149/jdg-website/exp/broadway-southwest-concept-1-market.jpg",
			"caption": "A farmer's market takes place in the east paseo.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "d9f01581-1986-4fe3-82d0-83f76ef33197",
			"alt": "A farmer's market takes place in the east paseo."
		},
		"broadway_southwest_concept_1_promenade": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176151/jdg-website/exp/broadway-southwest-concept-1-promenade.jpg",
			"caption": "A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "419a3ea3-c5e6-4353-9cf6-47aeb9f030b4",
			"alt": "A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building."
		},
		"broadway_southwest_concept_2_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176142/jdg-website/exp/broadway-southwest-concept-2-aerial.jpg",
			"caption": "An aerial showing Concept 1 and its design intent.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "ce2bc665-88fa-4ab4-bf04-b17cdc03561f",
			"alt": "An aerial showing Concept 1 and its design intent."
		},
		"broadway_southwest_concept_2_passage": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176145/jdg-website/exp/broadway-southwest-concept-2-passage.jpg",
			"caption": "The new passageway could serve as a connection to the site's history, educating visitors about the park and mall that preceded the Civic Center.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "e9895499-1a53-479d-acd3-cc3ce6520351",
			"alt": "The new passageway could serve as a connection to the site's history, educating visitors about the park and mall that preceded the Civic Center."
		},
		"broadway_southwest_concept_2_promenade": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721176146/jdg-website/exp/broadway-southwest-concept-2-promenade.jpg",
			"caption": "A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "62b32e5f-065a-42f9-a708-afd1c0977db6",
			"alt": "A terraced promenade replaces the former parking garage, providing much-needed greenery and open space in front of the building."
		},
		"corporate_showroom_before": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-before.jpg",
			"caption": "The existing building at 15th Street and Delgany is beige, boring, and corporate.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "62ba50e1-41c9-4275-a42b-58267e1b757b",
			"alt": "The existing building at 15th Street and Delgany is beige, boring, and corporate."
		},
		"corporate_showroom_corner": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721076293/jdg-website/exp/1551-wewatta-corner.jpg",
			"caption": "The new showroom and cafe adds amenities like a fireplace, improved materials, and a more pedestrian scale to the intersection.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "f5082ae3-3ceb-415a-93fe-947be13d2b5a",
			"alt": "The new showroom and cafe adds amenities like a fireplace, improved materials, and a more pedestrian scale to the intersection."
		},
		"corporate_showroom_elevation": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721076292/jdg-website/exp/1551-wewatta-elevation.jpg",
			"caption": "The new showroom and cafe as seen through an orthographic elevation view.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "052e5cc4-29fe-4dd2-ae62-47aada2586aa",
			"alt": "The new showroom and cafe as seen through an orthographic elevation view."
		},
		"encode_campus_after": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721170481/jdg-website/exp/encode-campus-after.jpg",
			"caption": "An urban plaza anchors the new building design in the foreground, bookended by modernized existing brick buildings on either side..",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "65424072-6156-456f-9af2-9877edf8a854",
			"alt": "An urban plaza anchors the new building design in the foreground, bookended by modernized existing brick buildings on either side.."
		},
		"fifteen_platte_dynamo": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721180332/jdg-website/exp/fifteen-platte-dynamo.jpg",
			"caption": "FormIt and Dynamo working together to iterate on the exterior structural column design.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "60687478-bb15-4b5f-9139-d80d55089e54",
			"alt": "FormIt and Dynamo working together to iterate on the exterior structural column design."
		},
		"fifteen_platte_grayscale": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-grayscale.jpg",
			"caption": "Eliminating the materials and colors for a shading study.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "e55fc7a8-9b6b-421e-8b79-b365180c1a18",
			"alt": "Eliminating the materials and colors for a shading study."
		},
		"fifteen_platte_sunset": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721180328/jdg-website/exp/fifteen-platte-sunset.jpg",
			"caption": "A glassy office building gets some shade from extended floor plates and some style thanks to the angled exterior columns.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "d98316b4-a5ac-43e6-a183-bf2c34ed1800",
			"alt": "A glassy office building gets some shade from extended floor plates and some style thanks to the angled exterior columns."
		},
		"fms_campus_before_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721091660/jdg-website/exp/fms-campus-before-aerial.jpg",
			"caption": "An abandoned Flood Middle School is seen from above in 2013.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "c428409b-eca3-4df8-bc08-bba51fa44049",
			"alt": "An abandoned Flood Middle School is seen from above in 2013."
		},
		"fms_campus_before_1": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073616/jdg-website/exp/fms-campus-before-1.jpg",
			"caption": "Flood Middle School as it appeared from Broadway during demolition in 2013.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "798f1c7e-3541-4d7e-97e3-1c5c287c8f11",
			"alt": "Flood Middle School as it appeared from Broadway during demolition in 2013."
		},
		"fms_campus_before_2": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073611/jdg-website/exp/fms-campus-before-2.jpg",
			"caption": "The northwest corner of Flood Middle School during abandonment in 2013.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "2124b8a4-0654-4c61-8cbd-91bd52f3396c",
			"alt": "The northwest corner of Flood Middle School during abandonment in 2013."
		},
		"fms_campus_before_3": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073613/jdg-website/exp/fms-campus-before-3.jpg",
			"caption": "The southeast corner of Flood Middle School at Lincoln and Kenyon as seen during abandonment in 2013.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "d7fa8ff2-1232-4972-b16d-113e06af9e3b",
			"alt": "The southeast corner of Flood Middle School at Lincoln and Kenyon as seen during abandonment in 2013."
		},
		"fms_campus_before_4": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073614/jdg-website/exp/fms-campus-before-4.jpg",
			"caption": "The northeast corner of Flood Middle School as seen during abandonment in 2013.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "0bdec750-8ca2-48dd-9b95-bcf3a3daf456",
			"alt": "The northeast corner of Flood Middle School as seen during abandonment in 2013."
		},
		"fms_campus_aerial": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721090862/jdg-website/exp/fms-campus-aerial.jpg",
			"caption": "The main school building is repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "c81572d3-e0a5-41fe-a608-308d0a36070e",
			"alt": "The main school building is repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back."
		},
		"fms_campus_lawn": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073527/jdg-website/exp/fms-campus-lawn.jpg",
			"caption": "The main building of the school is kept and repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "f07b1a3e-5ce7-474c-a37e-a9cc4348ad59",
			"alt": "The main building of the school is kept and repurposed to include walk-up townhomes in the central wing, restaurants in the former auditorium on the right, retail in the former gym on the left, and a new hotel in the back."
		},
		"fms_campus_kenyon_corner": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073526/jdg-website/exp/fms-campus-kenyon-corner.jpg",
			"caption": "At the intersection of Kenyon and Lincoln, the former middle school entrance becomes a common entrance for the back of the walk-up townhomes. The hotel can be seen on the right.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "846ec6e4-3750-415b-9e67-c5271a91cfd0",
			"alt": "At the intersection of Kenyon and Lincoln, the former middle school entrance becomes a common entrance for the back of the walk-up townhomes. The hotel can be seen on the right."
		},
		"fms_campus_massing": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721106934/jdg-website/exp/fms-campus-massing.jpg",
			"caption": "One possible reuse option is a mix of retail (red), office (green), townhomes (pink), apartments (teal), and hotel (gold).",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "76773e60-1678-4df3-a4a7-d0184a946a24",
			"alt": "One possible reuse option is a mix of retail (red), office (green), townhomes (pink), apartments (teal), and hotel (gold)."
		},
		"fms_campus_plaza": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073530/jdg-website/exp/fms-campus-plaza.jpg",
			"caption": "The school's largest gym is demolished on the northwest corner to make room for a pedestrian paseo, overlooked by the original small gymnasium which has been converted to boutique office and retail.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "80a95671-d2d1-4a21-8e5a-e6e11a2f6870",
			"alt": "The school's largest gym is demolished on the northwest corner to make room for a pedestrian paseo, overlooked by the original small gymnasium which has been converted to boutique office and retail."
		},
		"fms_campus_paseo": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073528/jdg-website/exp/fms-campus-paseo.jpg",
			"caption": "A new hotel augments the existing building, providing nearly 100 rooms and adding scale to the northeast corner of the school. A new paseo on the north side provides a shady plaza for food trucks and informal outdoor dining.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "34b65ae8-5d35-44a8-a19d-3b70e66e81b3",
			"alt": "A new hotel augments the existing building, providing nearly 100 rooms and adding scale to the northeast corner of the school. A new paseo on the north side provides a shady plaza for food trucks and informal outdoor dining."
		},
		"fms_campus_south_wing": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721073531/jdg-website/exp/fms-campus-south-wing.jpg",
			"caption": "On the south side of the school, an existing two-floor wing is transformed into walk-up townhomes.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "3e2c8dce-d224-4287-bfa1-594a052fa5c0",
			"alt": "On the south side of the school, an existing two-floor wing is transformed into walk-up townhomes."
		},
		"o2_research": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721184331/jdg-website/exp/o2-research-lobby.jpg",
			"caption": "A spacious and curvacious lobby, with ample foliage and gathering spaces.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "26aea4b1-03a8-4df6-8138-fbac9ee6613f",
			"alt": "A spacious and curvacious lobby, with ample foliage and gathering spaces."
		},
		"ranch_elsie_option_3": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721182476/jdg-website/exp/ranch-elsie-option-3.jpg",
			"caption": "The layout takes advantage of the natural site topography, and the roof design was the result of computational design in Autodesk FormIt and Dynamo.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "cdf5d272-a238-48af-9308-68c897cffe95",
			"alt": "The layout takes advantage of the natural site topography, and the roof design was the result of computational design in Autodesk FormIt and Dynamo."
		},
		"ranch_elsie_roof_optioneering": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1721182479/jdg-website/exp/ranch-elsie-roof-optioneering.gif",
			"caption": "Quick roof optioneering studies made possible by the integration between Autodesk FormIt and Autodesk Dynamo.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "e815528a-ace2-4b93-bb59-1953de1942ca",
			"alt": "Quick roof optioneering studies made possible by the integration between Autodesk FormIt and Autodesk Dynamo."
		},
		"sixteen_pearl_before": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721154488/jdg-website/exp/sixteen-pearl-before.jpg",
			"caption": "The original apartment building in 2015.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "c2c23b46-89d9-4964-8306-bd942b965a02",
			"alt": "The original apartment building in 2015."
		},
		"sixteen_pearl_corner": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-corner.jpg",
			"caption": "New 3-story walk-up townhomes fit within the original building, with an added rooftop deck and outdoor spaces on each level.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "7e857915-5241-4c48-98d8-d1c3279af371",
			"alt": "New 3-story walk-up townhomes fit within the original building, with an added rooftop deck and outdoor spaces on each level."
		},
		"sixteen_pearl_interior": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-interior.jpg",
			"caption": "A bright, glassy stairwell provides vertical access and brightens spaces throughout the units and building.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "fbf42c32-789b-46d4-96a4-9e32012c42c2",
			"alt": "A bright, glassy stairwell provides vertical access and brightens spaces throughout the units and building."
		},
		"sixteen_pearl_terrace": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721154489/jdg-website/exp/sixteen-pearl-terrace.jpg",
			"caption": "Exterior spaces are added on the front and roof of each unit.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "a48e8d4c-15c4-448f-9e07-c41ba9bad9e0",
			"alt": "Exterior spaces are added on the front and roof of each unit."
		},
		"speer_point_before": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721164768/jdg-website/exp/speer-point-before.jpg",
			"caption": "The original building at 10th and Speer in Denver.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "3176fc72-149e-4efc-9aa1-eea3f7ed2979",
			"alt": "The original building at 10th and Speer in Denver."
		},
		"speer_point_after": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1721164767/jdg-website/exp/speer-point-after.jpg",
			"caption": "The alternate use scheme includes artist studios, a cafe, a restaurant, and event space.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "13638e09-ea8a-40f1-b8ce-6f0eb7381571",
			"alt": "The alternate use scheme includes artist studios, a cafe, a restaurant, and event space."
		}
	},
	"hst": {
		"fms_2000s_plan_additions": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/fms-2000s-plan-additions.png",
			"caption": "The school complex became a mess of additions and renovations by the 2000s.",
			"attribution": "Josh Goldstein",
			"showBackgroundBlur": false,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "144931bc-b42f-4c18-8a58-3029d0c6a3b3",
			"alt": "The school complex became a mess of additions and renovations by the 2000s."
		},
		"ehs_1920_broadway_northeast": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/ehs-1920-broadway-northeast.jpg",
			"caption": "Englewood High School viewed from Broadway in 1920, a year after it was constructed.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "85c1249e-71f4-4da1-b5e2-44425cc81ebb",
			"alt": "Englewood High School viewed from Broadway in 1920, a year after it was constructed."
		},
		"ehs_1936_southeast_wing": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722745253/jdg-website/hst/ehs-1936-southeast-wing.jpg",
			"caption": "The south wing under construction in 1936. This would become the main entrance of Flood Junior High in the 1960s.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "3bac43e7-a2cd-48c9-9293-79b853b2799c",
			"alt": "The south wing under construction in 1936. This would become the main entrance of Flood Junior High in the 1960s."
		},
		"ehs_1950s_broadway_entrance": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722747056/jdg-website/hst/ehs-1950s-broadway-entrance.jpg",
			"caption": "The original main entrance of Englewood High School as seen in the 1950s.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "3a76b465-8526-4751-902e-afcfcfdf1318",
			"alt": "The original main entrance of Englewood High School as seen in the 1950s."
		},
		"fms_1960s_broadway_entrance": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722747053/jdg-website/hst/fms-1960s-broadway-entrance.jpg",
			"caption": "After the 1960s remodel, little remains of the former grand entrance off of Broadway.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "9275536a-e9b6-434e-b76f-6a39298dc66f",
			"alt": "After the 1960s remodel, little remains of the former grand entrance off of Broadway."
		},
		"fms_1960s_broadway_entrance_renovation": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722747336/jdg-website/hst/fms-1960s-broadway-entrance-renovation.jpg",
			"caption": "In 1965, crews began to remove ornate architectural details around the former entrance to match the district's new architectural standards.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "642fb2a8-08ea-469d-b607-b15d83afc904",
			"alt": "In 1965, crews began to remove ornate architectural details around the former entrance to match the district's new architectural standards."
		},
		"fms_1968_southeast_corner_entrance": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722746162/jdg-website/hst/fms-1968-southeast-corner-entrance.jpg",
			"caption": "The renovated south wing, new east wing, and new junior high school main entrance in the 1960s.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "a73f0e72-9696-45cf-91c1-016927f1b5dc",
			"alt": "The renovated south wing, new east wing, and new junior high school main entrance in the 1960s."
		},
		"fms_2013_broadway_northeast": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722729966/jdg-website/hst/fms-2013-broadway-northeast.jpg",
			"caption": "Flood Middle School's simplistic shell concealed the original Englewood High School building below it, as seen from Broadway during demolition in 2013.",
			"attribution": "Josh Goldstein",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "177143ae-307e-421c-a40c-5a34056834ba",
			"alt": "Flood Middle School's simplistic shell concealed the original Englewood High School building below it, as seen from Broadway during demolition in 2013."
		},
		"ehs_1919_plan": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1722737633/jdg-website/hst/ehs-1919-plan.png",
			"caption": "Englewood High School's original layout in 1919.",
			"attribution": "Englewood Public Library",
			"showBackgroundBlur": false,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "f11c587e-fd02-4ad8-8341-29e893801bfe",
			"alt": "Englewood High School's original layout in 1919."
		}
	},
	"ind": {
		"planter_003F_1": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1726422539/pmx-website/products/003F-1.jpg",
			"caption": "Advanced Planter",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "5b891995-3373-40c9-a236-aa9ef0ddb79e",
			"alt": "Advanced Planter"
		}
	},
	"swe": {
		"ccp_1": {
			"src": "https://res.cloudinary.com/jdg-main/image/upload/v1716962800/ccp-website/ccp/ccp-composite-2.jpg",
			"caption": "A composite image of two different time periods of a mid-century modern shopping center, powered by Unity.",
			"showBackgroundBlur": true,
			"toolbarJustification": "right",
			"version": "0.2.0",
			"id": "948bd68b-202d-4a22-9551-fe58e4a37da5",
			"alt": "A composite image of two different time periods of a mid-century modern shopping center, powered by Unity."
		}
	},
	"products_0": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1720834651/jdg-website/products/products-0.jpg",
		"alt": "Products",
		"caption": "Products",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "a2f67946-f2cb-49ec-8ed6-c4290772f52c"
	},
	"software_0": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1720834658/jdg-website/software/software-0.jpg",
		"alt": "Software",
		"caption": "Software",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "1674034b-f902-49e6-a248-2dda8552e4a7"
	},
	"ecc_existing_north": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1739673653/ccp-website/save-civic-center/ecc-existing-north.jpg",
		"caption": "The Englewood Civic Center's north side faces into plaza where it formerly attached to Cinderella City Mall.",
		"attribution": "Englewood Public Library",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"id": "0be2c6b0-d503-4cd9-b4a9-a916bd8012fb",
		"alt": "The Englewood Civic Center's north side faces into plaza where it formerly attached to Cinderella City Mall."
	},
	"new_image": {
		"src": "https://res.cloudinary.com/jdg-main/image/upload/v1764447881/jdg-ui-svelte/image-testing/new-image.jpg.png",
		"showBackgroundBlur": true,
		"toolbarJustification": "right",
		"version": "0.2.0",
		"attribution": "",
		"alt": "",
		"caption": "",
		"id": "8d95db3d-ea8c-4927-ac7f-cafdcca0fef5"
	}
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
		src: 'https://res.cloudinary.com/jdg-main/image/upload/v1716959969/jdg-ui-svelte/ccp/gold-mall-80s90s-1_jzmeeb.png',
		alt: `Cinderella City's Gold Mall, simulated in the 1987-1997 era.`
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
	}
};

// Upgrade the registry - this upgrades and post-processes each imageMeta
const upgradedimageMetaRegistry = upgradeImageMetaRegistry(imageMetaRegistry);

export { upgradedimageMetaRegistry as imageMetaRegistry };
