import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = new Map([
	[
		'architecture-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './project-tiles/architecture.jpg',
			imgAlt: 'Architecture',
			imgCaption: 'Architecture'
		})
	],
	[
		'cc-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/CCP1.jpg',
			imgAlt: 'The Blue Mall as seen in 1968.',
			imgCaption: 'The Blue Mall as seen in 1968.'
		})
	],
	[
		'cc-2',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/cc-2.jpg',
			imgAlt: 'The Blue Mall as seen in 1968.',
			imgCaption: 'The Blue Mall as seen in 1968.'
		})
	],
	[
		'lakeside-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/lakeside-1.jpg',
			imgAlt: 'Lakeside Mall in 1956.',
			imgCaption: 'Lakeside Mall in 1956.'
		})
	]
]);

export default imageAttributesCollection;
