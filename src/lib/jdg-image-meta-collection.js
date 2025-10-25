// These are for shared images used across the UI package
// For page-specific images, see image-meta-collection in /routes

import { instantiateObject } from '$lib/jdg-utils.js';
import jdgImageMeta from '$lib/schemas/jdg-image-meta.js';

// This needs to be a getter function to prevent SSR errors on build with a raw object
const getJdgImageMetaCollection = () => {
	return {
		jdg_avatar_placeholder: instantiateObject(jdgImageMeta, {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1761358399/jdg-ui-svelte/jdg-avatar-placeholder.jpg',
			alt: 'Avatar'
		}),
		jdg_image_placeholder: instantiateObject(jdgImageMeta, {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1718070722/jdg-ui-svelte/jdg-image-placeholder.jpg',
			alt: 'Placeholder'
		}),
		jdg_logo_ui: instantiateObject(jdgImageMeta, {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1759708726/jdg-ui-svelte/jdg-logo-ui.png',
			alt: 'JDG UI SVELTE'
		})
	};
};

export default getJdgImageMetaCollection;
