export const jdgBreakpoints = {
	width: [768, 1024],
	height: [400, 800],
	unit: 'px'
};

export const jdgColors = {
	/* these colors define the accent colors for different sites */
	/* lm = lightmode; dm = darkmode */
	accentColorsCCP: ['#d5c073', '#80b75a', '#85c1ff'],
	accentColorsJDG: ['#E1D779', '#D98014', '#BF3A0A'],
	backgroundFillRangeLm: [
		'rgba(150, 150, 150, 1)',
		'rgba(175, 175, 175, 1)',
		'rgba(190, 190, 190, 1)'
	],
	text: 'black',
	textLight: '#737373',
	headerBackground: 'rgba(250, 250, 250, 0.7)',
	contentBoxBackground: 'rgba(252, 252, 252, 0.7)',
	buttonPrimary: '#0092e4',
	buttonSecondary: 'darkGray',
	buttonDisabled: '#B5B5B5',
	buttonDone: '#4dc44d',
	buttonDelete: '#FF5757',
	hoverBackground: 'white',
	active: '#3399ff',
	activeSubtle: '#e6f3ff',
	overlay: 'gray',
	overlayOpacity: '75%',
	overlayMedia: 'rgba(220, 220, 220, 0.5)',
	modalTitleBccackground: 'rgba(220, 220, 220, 1.0)',
	modalContentBackground: 'rgba(220, 220, 220, 0.4)',
	formBackgroundLegibleTransparency: '0.8',
	timelineSpine: 'rgba(200, 200, 200, 0.75)',
	timelineEventTitleBar: 'rgba(205, 205, 205, 1)',
	timelineEventBackgroundHover: 'rgba(255, 255, 255, 0.75)',
	hyperlink: '#2373a3',
	notificationError: 'palevioletred',
	notificationWarning: 'lightYellow',
	notificationInformation: 'lightBlue',
	notificationInProgress: 'yellow',
	notificationSuccess: '#77FF16'
};

export const jdgSizes = {
	nFontSizeSmall: 0.75,
	fontUnit: 'rem',
	get fontSizeSmall() {
		return this.nFontSizeSmall.toString() + this.fontUnit;
	},
	nFontSizeHeaderSupertitle: 0.6,
	get fontSizeHeaderSupertitle() {
		return this.nFontSizeHeaderSupertitle.toString() + this.fontUnit;
	},
	nFontSizeHeaderTitle: 1,
	get fontSizeHeaderTitle() {
		return this.nFontSizeHeaderTitle.toString() + this.fontUnit;
	},
	nFontSizeAccentTextPrimarySm: 1.75,
	get fontSizeAccentTextPrimarySm() {
		return this.nFontSizeAccentTextPrimarySm.toString() + this.fontUnit;
	},
	nFontSizeAccentTextPrimaryMd: 2.25,
	get fontSizeAccentTextPrimaryMd() {
		return this.nFontSizeAccentTextPrimaryMd.toString() + this.fontUnit;
	},
	nFontSizeAccentTextPrimaryLg: 3,
	get fontSizeAccentTextPrimaryLg() {
		return this.nFontSizeAccentTextPrimaryLg.toString() + this.fontUnit;
	},
	nFontSizeAccentTextSecondarySm: 1,
	get fontSizeAccentTextSecondarySm() {
		return this.nFontSizeAccentTextSecondarySm.toString() + this.fontUnit;
	},
	nFontSizeAccentTextSecondaryMd: 1.25,
	get fontSizeAccentTextSecondaryMd() {
		return this.nFontSizeAccentTextSecondaryMd.toString() + this.fontUnit;
	},
	nFontSizeAccentTextSecondaryLg: 1.5,
	get fontSizeAccentTextSecondaryLg() {
		return this.nFontSizeAccentTextSecondaryLg.toString() + this.fontUnit;
	},
	nFontSizeFloatingContentBoxTitle: 2,
	get fontSizeFloatingContentBoxTitle() {
		return this.nFontSizeFloatingContentBoxTitle.toString() + this.fontUnit;
	},

	nBlurSizeSmall: 5,
	blurSizeSmallUnit: 'px',
	get blurSizeSmall() {
		return this.nBlurSizeSmall.toString() + this.blurSizeSmallUnit;
	},
	nBlurSizeMedium: 8,
	blurSizeMediumUnit: 'px',
	get blurSizeMedium() {
		return this.nBlurSizeMedium.toString() + this.blurSizeMediumUnit;
	},
	nBlurSizeLarge: 12,
	blurSizeLargeUnit: 'px',
	get blurSizeLarge() {
		return this.nBlurSizeLarge.toString() + this.blurSizeLargeUnit;
	},

	horizontalStripeLengths: ['100%', '90%', '80%'],
	nHorizontalStripeHeightLg: 5,
	horizontalStripeHeightUnit: 'px',
	get horizontalStripeHeightLg() {
		return this.nHorizontalStripeHeightLg.toString() + this.horizontalStripeHeightUnit;
	},
	nHorizontalStripeHeightMd: 4,
	get horizontalStripeHeightMd() {
		return this.nHorizontalStripeHeightMd.toString() + this.horizontalStripeHeightUnit;
	},
	nHorizontalStripeHeightSm: 3,
	get horizontalStripeHeightSm() {
		return this.nHorizontalStripeHeightSm.toString() + this.horizontalStripeHeightUnit;
	},

	nBodyCopyVerticalPaddingSm: 10,
	bodyCopyVerticalPaddingUnit: 'vw',
	get bodyCopyVerticalPaddingSm() {
		return this.nBodyCopyVerticalPaddingSm.toString() + this.bodyCopyVerticalPaddingUnit;
	},
	nBodyCopyVerticalPaddingMd: 15,
	get bodyCopyVerticalPaddingMd() {
		return this.nBodyCopyVerticalPaddingMd.toString() + this.bodyCopyVerticalPaddingUnit;
	},
	nBodyCopyVerticalPaddingLg: 22,
	get bodyCopyVerticalPaddingLg() {
		return this.nBodyCopyVerticalPaddingLg.toString() + this.bodyCopyVerticalPaddingUnit;
	},
	contentBoxPaddingUnit: 'rem',
	nContentBoxPaddingSm: 1,
	get contentBoxPaddingSm() {
		return this.nContentBoxPaddingSm.toString() + this.contentBoxPaddingUnit;
	},
	nContentBoxPaddingMd: 1.75,
	get contentBoxPaddingMd() {
		return this.nContentBoxPaddingMd.toString() + this.contentBoxPaddingUnit;
	},
	nContentBoxPaddingLg: 2,
	get contentBoxPaddingLg() {
		return this.nContentBoxPaddingLg.toString() + this.contentBoxPaddingUnit;
	},
	contentBoxFloatingMarginUnit: 'vw',
	nContentBoxFloatingMarginSm: 3.5,
	get contentBoxFloatingMarginSm() {
		return this.nContentBoxFloatingMarginSm.toString() + this.contentBoxFloatingMarginUnit;
	},
	nContentBoxFloatingMarginMd: 4,
	get contentBoxFloatingMarginMd() {
		return this.nContentBoxFloatingMarginMd.toString() + this.contentBoxFloatingMarginUnit;
	},
	nContentBoxFloatingMarginLg: 5,
	get contentBoxFloatingMarginLg() {
		return this.nContentBoxFloatingMarginLg.toString() + this.contentBoxFloatingMarginUnit;
	},

	nHeaderLogoHeightSm: 40,
	headerLogoHeightUnit: 'px',
	get headerLogoHeightSm() {
		return this.nHeaderLogoHeightSm.toString() + this.headerLogoHeightUnit;
	},
	nHeaderLogoHeightMd: 45,
	get headerLogoHeightMd() {
		return this.nHeaderLogoHeightMd.toString() + this.headerLogoHeightUnit;
	},
	nHeaderLogoHeightLg: 50,
	get headerLogoHeightLg() {
		return this.nHeaderLogoHeightLg.toString() + this.headerLogoHeightUnit;
	},
	nNavMobileIconHeightSm: 30,
	navMobileIconHeightUnit: 'px',
	get navMobileIconHeightSm() {
		return this.nNavMobileIconHeightSm.toString() + this.navMobileIconHeightUnit;
	},
	nNavMobileIconHeightLg: 35,
	get navMobileIconHeightLg() {
		return this.nNavMobileIconHeightLg.toString() + this.navMobileIconHeightUnit;
	},

	headerHeightUnit: 'px',
	get nHeaderHeightSm() {
		return 2 * this.nHeaderTopBottomPadding + this.nHeaderLogoHeightSm;
	},
	get headerHeightSm() {
		return this.nHeaderHeightSm.toString() + this.headerHeightUnit;
	},
	get nHeaderHeightMd() {
		return 2 * this.nHeaderTopBottomPadding + this.nHeaderLogoHeightMd;
	},
	get headerHeightMd() {
		return this.nHeaderHeightMd.toString() + this.headerHeightUnit;
	},
	get nHeaderHeightLg() {
		return 2 * this.nHeaderTopBottomPadding + this.nHeaderLogoHeightLg;
	},
	get headerHeightLg() {
		return this.nHeaderHeightLg.toString() + this.headerHeightUnit;
	},

	nHeaderTopBottomPadding: 20,
	headerTopBottomPaddingUnit: 'px',
	get headerTopBottomPadding() {
		return this.nHeaderTopBottomPadding.toString() + this.headerTopBottomPaddingUnit;
	},
	nHeaderSidePadding: 2,
	headerSidePaddingUnit: 'rem',
	get headerSidePadding() {
		return this.nHeaderSidePadding.toString() + this.headerSidePaddingUnit;
	}
};

export const jdgDurations = {
	default: 300 //ms
};
