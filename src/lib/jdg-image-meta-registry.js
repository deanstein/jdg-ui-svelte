// This registry is for package-level images available to consuming sites
// For images used on this testing website, see routes/image-meta-registry

import { upgradeImageMetaRegistry } from './jdg-utils.js';

// This must be a getter function to prevent SSR errors on build with a raw object
const getJdgimageMetaRegistry = () => {
	return upgradeImageMetaRegistry({
		jdg_avatar_placeholder: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1761358399/jdg-ui-svelte/jdg-avatar-placeholder.jpg',
			alt: 'Avatar'
		},
		jdg_image_placeholder: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1718070722/jdg-ui-svelte/jdg-image-placeholder.jpg',
			alt: 'Placeholder'
		},
		jdg_logo_ui: {
			src: 'https://res.cloudinary.com/jdg-main/image/upload/v1759708726/jdg-ui-svelte/jdg-logo-ui.png',
			alt: 'JDG UI SVELTE'
		}
	});
};

export default getJdgimageMetaRegistry;
