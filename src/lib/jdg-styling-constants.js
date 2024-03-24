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
	nFontSizeFloatingContentBoxTitle: 2,
	get fontSizeFloatingContentBoxTitle() {
		return this.nFontSizeFloatingContentBoxTitle + this.fontUnit;
	},
	fontSizeImageTileLabel: 3,
	fontUnitImageTileLabel: 'vh',
	get imageTileLabelFontSize() {
		return this.fontSizeImageTileLabel.toString() + this.fontUnitImageTileLabel;
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

	nContentBoxPaddingSm: 2,
	contentBoxPaddingUnit: 'rem',
	get contentBoxPaddingSm() {
		return this.nContentBoxPaddingSm.toString() + this.contentBoxPaddingUnit;
	},
	nContentBoxVerticalPaddingSm: 5,
	contentBoxVerticalPaddingUnit: 'vw',
	get contentBoxVerticalPaddingSm() {
		return this.nContentBoxPaddingSm.toString() + this.contentBoxPaddingUnit;
	},
	nContentBoxVerticalPaddingMd: 10,
	get contentBoxVerticalPaddingMd() {
		return this.nContentBoxVerticalPaddingMd.toString() + this.contentBoxVerticalPaddingUnit;
	},
	nContentBoxVerticalPaddingLg: 15,
	get contentBoxVerticalPaddingLg() {
		return this.nContentBoxVerticalPaddingLg.toString() + this.contentBoxVerticalPaddingUnit;
	},
	nContentBoxVerticalPaddingMax: 22,
	get contentBoxVerticalPaddingMax() {
		return this.nContentBoxVerticalPaddingMax.toString() + this.contentBoxVerticalPaddingUnit;
	},
	nContentBoxFloatingMargin: 5,
	contentBoxFloatingMarginUnit: 'vw',
	get contentBoxFloatingMargin() {
		return this.nContentBoxFloatingMargin.toString() + this.contentBoxFloatingMarginUnit;
	},

	nImageHeightSm: 300,
	imageHeightUnit: 'px',
	get imageHeightSm() {
		return this.nImageHeightSm.toString() + this.imageHeightUnit;
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
	},

	nPadding: 0.75,
	get padding() {
		return this.nPadding.toString() + 'vh';
	},
	nPaddingNarrow: 0.5,
	get paddingNarrow() {
		return this.nPaddingNarrow.toString() + 'vh';
	},

	nModalFormWidth: 25,
	get modalFormWidth() {
		return this.nModalFormWidth.toString() + 'vw';
	},
	nModalFormHeight: 80,
	get modalFormHeight() {
		return this.nModalFormHeight.toString() + 'vh';
	},

	nTimelineSpineLineThickness: 0.9,
	get timelineSpineThickness() {
		return this.nTimelineSpineLineThickness + 'vw';
	},
	nTimelineEventGapSize: 1,
	get timelineEventGapSize() {
		return this.nTimelineEventGapSize + 'vw';
	},
	nTimelineEventNodeSize: 0.9,
	get timelineEventNodeSize() {
		return this.nTimelineEventNodeSize + 'vw';
	},
	nTimelineEventYearWidth: 4,
	get timelineEventYearWidth() {
		return this.nTimelineEventYearWidth + 'vw';
	}
};

export const jdgQuantities = {
	initialTimelineRowCount: 1000
};

export const jdgDurations = {
	default: 300 //ms
};
