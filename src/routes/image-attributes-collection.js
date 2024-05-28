import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// get all images as objects for the optimization package
const images = import.meta.glob('./../assets/**/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}', {
	query: {
		enhanced: true
	}
});

export async function getImageEnhancedSrcCollection() {
	await Promise.all(
		Object.entries(imageAttributesCollection).map(async ([key, attributes]) => {
			const imagePromise = images[attributes.imgSrc.split('?')[0]];
			if (imagePromise) {
				const module = await imagePromise(); // Call the function to get the promise
				//@ts-expect-error
				imageAttributesCollection[key].imgEnhancedSrc = module.default;
			}
		})
	);
}

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = {
	aerial_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/history/aerial-60s70s-1.jpg?enhanced',
		imgAlt:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Cinderella City as it appeared in 1968. And a bunch of other words to test long captions!',
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	architecture_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/project-tiles/architecture.jpg?enhanced',
		imgAlt: 'Architecture',
		imgCaption: 'Architecture'
	}),
	cc_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/history/CCP1.jpg?enhanced',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.',
		imgAttribution: 'Englewood Public Library'
	}),
	ccp_ouatacc_white: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/ccp/ouatacc-white.png?enhanced',
		imgAlt: `Once Upon a Time at Cinderella City.`
	}),
	ccp_blue_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/ccp/blue-mall-60s70s-1.png?enhanced',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1968-1978 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	ccp_blue_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/ccp/blue-mall-80s90s-1.png?enhanced',
		imgAlt: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgCaption: `Cinderella City's central Blue Mall, simulated in the 1987-1997 era.`,
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	ccp_gold_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/ccp/gold-mall-60s70s-1.png?enhanced',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1968-1978 era.`
	}),
	ccp_gold_mall_80s90s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/ccp/gold-mall-80s90s-1.png?enhanced',
		imgAlt: `Cinderella City's Gold Mall, simulated in the 1987-1997 era.`
	}),
	lakeside_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/history/lakeside-1.jpg?enhanced',
		imgAlt: 'Lakeside Mall in 1956.',
		imgCaption: 'Lakeside Mall in 1956.',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/history/rose-mall-60s70s-1.jpg?enhanced',
		imgAlt:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		imgCaption:
			'Rose Mall as it appeared before grand opening in 1968. And a bunch of other words to test long captions!',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_2: instantiateObject(jdgImageAttributes, {
		imgSrc: '../assets/history/rose-mall-60s70s-2.jpg?enhanced',
		imgAlt: 'Offices above Rose Mall.',
		imgCaption: 'Offices above Rose Mall.',
		imgAttribution: 'Denver Public Library'
	})
};

await getImageEnhancedSrcCollection();

export { imageAttributesCollection };
