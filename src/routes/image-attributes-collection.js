import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = {
	aerial_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: './history/aerial-60s70s-1.jpg',
		imgAlt: 'Cinderella City as it appeared in 1968',
		imgCaption: 'Cinderella City as it appeared in 1968.',
		imgAttribution: 'Englewood Public Library (AI recolored)'
	}),
	architecture_1: instantiateObject(jdgImageAttributes, {
		imgSrc: './project-tiles/architecture.jpg',
		imgAlt: 'Architecture',
		imgCaption: 'Architecture'
	}),
	cc_1: instantiateObject(jdgImageAttributes, {
		imgSrc: './history/CCP1.jpg',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.',
		imgAttribution: 'Englewood Public Library'
	}),
	lakeside_1: instantiateObject(jdgImageAttributes, {
		imgSrc: './history/lakeside-1.jpg',
		imgAlt: 'Lakeside Mall in 1956.',
		imgCaption: 'Lakeside Mall in 1956.',
		imgAttribution: 'Denver Public Library'
	}),
	rose_mall_60s70s_1: instantiateObject(jdgImageAttributes, {
		imgSrc: './history/rose-mall-60s70s-1.jpg',
		imgAlt: 'Rose Mall as it appeared before grand opening in 1968.',
		imgCaption: 'Rose Mall as it appeared before grand opening in 1968.',
		imgAttribution: 'Denver Public Library'
	})
};

export default imageAttributesCollection;
