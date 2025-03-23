import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';

const jdgImageMeta = {
	imgSrc: imagePlaceholder,
	imgTitle: undefined,
	imgAlt: undefined,
	imgCaption: undefined,
	imgAttribution: undefined,
	allowBackgroundBlur: true /* set to false for images like plans and diagrams */,
	toolbarAlignment:
		'right' /* in some contexts, images will have a toolbar and its alignment can be set depending on the image layout */
};

export default jdgImageMeta;
