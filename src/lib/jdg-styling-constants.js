export const breakpoints = {
	width: ['768px', '1024px'],
	height: ['400px', '800px']
};

const colors = {
	textColor: '#595959',
	textColorLight: '#737373',
	buttonColorPrimary: '#0092e4',
	buttonColorSecondary: 'darkGray',
	buttonColorDisabled: '#B5B5B5',
	buttonColorDone: '#4dc44d',
	buttonColorDelete: '#FF5757',
	hoverColor: '#50CBFC',
	hoverColorSubtle: '#B6EAFF',
	hoverColorSubtleDark: '#99CBDE',
	activeColor: '#3399ff',
	activeColorSubtle: '#e6f3ff',
	overlayColor: 'gray',
	overlayOpacity: '75%',
	modalTitleBackground: 'rgba(220, 220, 220, 1.0)',
	modalContentBackground: 'rgba(220, 220, 220, 0.4)',
	formBackgroundLegibleTransparency: '0.8',
	timelineSpineColor: 'rgba(200, 200, 200, 0.75)',
	timelineEventTitleBarColor: 'rgba(205, 205, 205, 1)',
	timelineEventBackgroundHoverColor: 'rgba(255, 255, 255, 0.75)',
	hyperlinkColor: '#2373a3',
	notificationColorError: 'palevioletred',
	notificationColorWarning: 'lightYellow',
	notificationColorInformation: 'lightBlue',
	notificationColorInProgress: 'yellow',
	notificationColorSuccess: '#77FF16'
};

const sizes = {
	nHeaderHeight: 5,
	get headerHeight() {
		return this.nHeaderHeight.toString() + 'vh';
	},
	nPadding: 0.75,
	get padding() {
		return this.nPadding.toString() + 'vh';
	},
	nPaddingNarrow: 0.5,
	get paddingNarrow() {
		return this.nPaddingNarrow.toString() + 'vh';
	},

	nNotificationFontSize: 1.5,
	get notificationFontSize() {
		return this.nNotificationFontSize.toString() + 'vh';
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
	},
};

const quantities = {
	initialTimelineRowCount: 1000
};

const durations = {
	transitionDuration: 75 //ms
};

const jdgStylingConstants = {
	breakpoints,
	colors,
	sizes,
	quantities,
	durations
};

export default jdgStylingConstants;
