export const jdgSharedStrings = {
	// used for copyright and photo credits
	jdgCopyrightName: 'Joshua Dean Goldstein'
};

// Common sources/attributions for timeline events and image metadata
// Used in COMBOBOX input to provide suggestions while allowing custom entry
// The 'value' is stored in the data, and 'label' is displayed to the user
export const jdgSharedSources = [
	{
		value: 'cc-historical-narrative',
		label: 'Kurt P. Schweigart, Cinderella City Historical Narrative'
	},
	{ value: 'denver-public-library', label: 'Denver Public Library' },
	{ value: 'englewood-public-library', label: 'Englewood Public Library' },
];

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
