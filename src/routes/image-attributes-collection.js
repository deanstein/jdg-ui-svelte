import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = {
	aerial_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959961/jdg-ui-svelte/history/aerial-60s70s-1_e4hg6b.jpg',
		imgAlt:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	architecture_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959964/jdg-ui-svelte/project-tiles/architecture_gdysdx.jpg',
		imgAlt: 'Architecture',
		imgCaption: 'Architecture'
	}),
	cc_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959962/jdg-ui-svelte/history/CCP1_fgtgm4.jpg',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.',
		imgAttribution: 'Englewood Public Library'
	}),
	ccp_ouatacc_white: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959962/jdg-ui-svelte/ccp/ouatacc-white_sa1pne.png',
		imgAlt: `Once Upon a Time at Cinderella City.`
	}),
	ccp_blue_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959965/jdg-ui-svelte/ccp/blue-mall-60s70s-1_kpzlxi.png',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	ccp_blue_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959967/jdg-ui-svelte/ccp/blue-mall-80s90s-1_kwxmgp.png',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	ccp_gold_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959968/jdg-ui-svelte/ccp/gold-mall-60s70s-1_nylla3.png',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1968-1978 era.`
	}),
	ccp_gold_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959969/jdg-ui-svelte/ccp/gold-mall-80s90s-1_jzmeeb.png',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1987-1997 era.`
	}),
	lakeside_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959966/jdg-ui-svelte/history/lakeside-1_kcrblc.jpg',
		imgAlt: 'Lakeside Mall in 1956.',
		imgCaption: 'Lakeside Mall in 1956.',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959963/jdg-ui-svelte/history/rose-mall-60s70s-1_ncv9le.jpg',
		imgAlt:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_2: instantiateObject(jdgImageAttributes, {
		imgSrc:
			'https://res.cloudinary.com/jdg-main/image/upload/f_auto/v1716959964/jdg-ui-svelte/history/rose-mall-60s70s-2_k2ac9c.jpg',
		imgAlt: 'Offices above Rose Mall.',
		imgCaption: 'Offices above Rose Mall.',
		imgAttribution: 'Denver Public Library'
	})
};

export { imageAttributesCollection };
