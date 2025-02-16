export const jdgSharedStrings = {
	// used for copyright and photo credits
	jdgCopyrightName: 'Joshua Dean Goldstein'
};

export const jdgSharedIdentifiers = {
	// GridLayout may need to communicate its children in some cases
	gridLayout: 'jdg-grid-layout',

	// H3H4 implements its own AnchorTag,
	// opting out of global application on all h3 elements
	h3h4Container: 'jdg-h3-h4-container',

	// ImageCompare is treated differently in a GridLayout
	imageCompareWrapper: 'jdg-image-compare-wrapper'
};

export const jdgSharedUrls = {
	// the live json file, so URLs can be updated outside of package version
	jdgSharedUrlsStoreFileName: `src/lib/stores/jdg-shared-urls.json`
};
