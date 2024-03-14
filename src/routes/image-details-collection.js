import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageDetails from '$lib/schemas/image-details.js';

const imageDetailsCollection = [
	instantiateObject(jdgImageDetails, {
		imgSrc: './project-tiles/architecture.jpg',
		imgAlt: 'Architecture',
		imgCaption: 'Architecture'
	}),
	instantiateObject(jdgImageDetails, {
		imgSrc: './history/CCP1.jpg',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.'
	}),
	instantiateObject(jdgImageDetails, {
		imgSrc: './history/cc-2.jpg',
		imgAlt: 'The Blue Mall as seen in 1968.',
		imgCaption: 'The Blue Mall as seen in 1968.'
	}),
	instantiateObject(jdgImageDetails, {
		imgSrc: './history/lakeside-1.jpg',
		imgAlt: 'Lakeside Mall in 1956.',
		imgCaption: 'Lakeside Mall in 1956.'
	})
];

export default imageDetailsCollection;
