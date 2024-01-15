export const jdgBreakpoints = {
	width: [768, 1024],
	height: [400, 800],
	unit: 'px'
};

export const jdgColors = {
	accentStripesJDG: ['#BF3A0A', '#D98014', '#D7CD76'],
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
	modalTitleBackground: 'rgba(220, 220, 220, 1.0)',
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
	nFontSizeSmall: 1.25,
	fontSizeSmallUnit: 'vh',
	get fontSizeSmall() {
		return this.nFontSizeSmall.toString() + this.fontSizeSmallUnit;
	},
	nFontSizeSupertitle: 0.8,
	fontSizeSupertitleUnit: 'vh',
	get fontSizeSupertitle() {
		return this.nFontSizeSupertitle.toString() + this.fontSizeSupertitleUnit;
	},

	nBlurSizeSmall: 10,
	blurSizeSmallUnit: 'px',
	get blurSizeSmall() {
		return this.nBlurSizeSmall.toString() + this.blurSizeSmallUnit;
	},

	horizontalStripeLengths: ['100%', '90%', '80%'],
	nHorizontalStripeHeight: 5,
	horizontalStripeHeightUnit: 'px',
	get horizontalStripeHeight() {
		return this.nHorizontalStripeHeight.toString() + this.horizontalStripeHeightUnit;
	},

	nContentBoxPadding: 2,
	contentBoxPaddingUnit: 'rem',
	get contentBoxPadding() {
		return this.nContentBoxPadding.toString() + this.contentBoxPaddingUnit;
	},
	nContentBoxFloatingMargin: 5,
	contentBoxFloatingMarginUnit: 'vw',
	get contentBoxFloatingMargin() {
		return this.nContentBoxFloatingMargin.toString() + this.contentBoxFloatingMarginUnit;
	},

	nNotificationHeight: 3,
	notificationHeightUnit: 'vh',
	get notificationHeight() {
		return this.nNotificationHeight.toString() + this.notificationHeightUnit;
	},
	nNotificationFontSize: 1.5,
	notificationFontSizeUnit: 'vh',
	get notificationFontSize() {
		return this.nNotificationFontSize.toString() + this.notificationFontSizeUnit;
	},

	nHeaderHeight: 5,
	headerHeightUnit: 'vh',
	get headerHeight() {
		return this.nHeaderHeight.toString() + this.headerHeightUnit;
	},
	nHeaderTopBottomPadding: 2,
	headerTopBottomPaddingUnit: 'vh',
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

	nModalTitleFontSize: 2,
	get modalTitleFontSize() {
		return this.nModalTitleFontSize.toString() + 'vh';
	},
	nModalSubtitleFontSize: 1.5,
	get modalSubtitleFontSize() {
		return this.nModalSubtitleFontSize.toString() + 'vh';
	},
	nModalFormWidth: 25,
	get modalFormWidth() {
		return this.nModalFormWidth.toString() + 'vw';
	},
	nModalFormHeight: 80,
	get modalFormHeight() {
		return this.nModalFormHeight.toString() + 'vh';
	},

	nImageTileLabelFontSize: 3,
	imageTileLabelFontUnit: 'vh',
	get imageTileLabelFontSize() {
		return this.nImageTileLabelFontSize.toString() + this.imageTileLabelFontUnit;
	},

	nBioFieldFontSize: 1.5,
	get bioFieldFontSize() {
		return this.nBioFieldFontSize + 'vh';
	},
	nTimelineDateFontSize: 1.5,
	get timelineDateFontSize() {
		return this.nTimelineDateFontSize + 'vh';
	},
	nTimelineYearFontSize: 2.5,
	get timelineYearFontSize() {
		return this.nTimelineYearFontSize + 'vh';
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
	slide: 500 //ms
};
