import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';

const jdgImageMeta = {
	id: undefined,
	src: imagePlaceholder,
	title: undefined,
	alt: undefined,
	caption: undefined,
	attribution: undefined,
	// An image can fill the rest of its container
	// with a blurred copy of itself
	// Set this to false plans and diagrams
	doShowBackgroundBlur: true,
	// In some contexts, images can have a toolbar
	// the toolbar alignment may need to change
	// depending on the content of the image
	toolbarAlignment: 'right'
};

export default jdgImageMeta;
