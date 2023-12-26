export const jdgBreakpoints = {
	width: ['768px', '1024px'],
	height: ['400px', '800px']
};

export const jdgColors = {
	header: '#fafafa',
	text: '#595959',
	textLight: '#737373',
	buttonPrimary: '#0092e4',
	buttonSecondary: 'darkGray',
	buttonDisabled: '#B5B5B5',
	buttonDone: '#4dc44d',
	buttonDelete: '#FF5757',
	hover: '#50CBFC',
	hoverSubtle: '#B6EAFF',
	hoverSubtleDark: '#99CBDE',
	active: '#3399ff',
	activeSubtle: '#e6f3ff',
	overlay: 'gray',
	overlayOpacity: '75%',
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
	}
};

export const jdgQuantities = {
	initialTimelineRowCount: 1000
};

export const jdgDurations = {
	transitionDuration: 75 //ms
};
