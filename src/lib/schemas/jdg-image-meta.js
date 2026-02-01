import { jdgSchemaVersion } from './jdg-schema-versions.js';
import imagePlaceholder from '$lib/assets/raster/jdg-image-placeholder.png';

const jdgImageMeta = {
	id: undefined,
	// Typically a Cloudinary URL
	src: imagePlaceholder,
	// Image description and context
	caption: undefined,
	// Person, publication, or institution that provided the image
	attribution: undefined,
	// For accessibility; same as caption by default
	alt: undefined,
	// Shows a tooltip on hover
	title: undefined,
	// Date associated with the image (e.g. when it was taken or published)
	date: undefined,
	// Whether the date is approximate (e.g. year-only or estimated)
	isApprxDate: false,
	// An image can fill the rest of its container
	// with a blurred copy of itself
	// Set this to false for plans and diagrams
	showBackgroundBlur: true,
	// In some contexts, images can have a toolbar
	// the toolbar alignment may need to change
	// depending on the content of the image
	toolbarJustification: 'right',
	// Image gets upgraded with new fields on version mismatch
	version: jdgSchemaVersion
};

export default jdgImageMeta;
