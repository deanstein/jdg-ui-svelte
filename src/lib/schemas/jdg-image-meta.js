import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';

const jdgImageMeta = {
	src: imagePlaceholder,
	title: undefined,
	alt: undefined,
	caption: undefined,
	attribution: undefined,
	// an image can fill the rest of its container
	// with a blurred copy of itself
	// set this to false plans and diagrams
	doShowBackgroundBlur: true,
	// in some contexts, images can have a toolbar
	// the toolbar alignment may need to change
	// depending on the content of the image
	toolbarAlignment: 'right'
};

export default jdgImageMeta;
