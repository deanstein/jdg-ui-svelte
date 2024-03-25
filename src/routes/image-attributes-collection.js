import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

// a map of all available images and their attributes
// new images with a caption must be added here
const imageAttributesCollection = new Map([
	[
		'aerial-60s70s-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/aerial-60s70s-1.jpg',
			imgAlt: 'Cinderella City as it appeared in 1968',
			imgCaption: 'Cinderella City as it appeared in 1968'
		})
	],
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
		'aerial-60s70s-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/aerial-60s70s-1.jpg',
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
	],
	[
	'rose-mall-60s70s-1',
		instantiateObject(jdgImageAttributes, {
			imgSrc: './history/rose-mall-60s70s-1.jpg',
			imgAlt: 'Lakeside Mall in 1956.',
			imgCaption: 'Lakeside Mall in 1956.'
		})
	]
]);

export default imageAttributesCollection;
