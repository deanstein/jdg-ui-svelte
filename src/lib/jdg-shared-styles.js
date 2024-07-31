import { css } from '@emotion/css';

export const jdgBreakpoints = {
	width: [768, 1024],
	height: [400, 800],
	unit: 'px'
};

export const jdgFonts = {
	body: 'REM',
	righteous: 'Righteous'
};

export const jdgColors = {
	/* these colors define the accent colors for different sites */
	/* lm = lightmode; dm = darkmode */
	accentColorsCCP: ['#e0d26e', '#e69623', '#ce595e'],
	accentColorsCCPRose: ['#e9acc1', '#ea9594', '#d47265'],
	accentColorsJDG: ['#E1D779', '#D98014', '#BF3A0A'],
	active: '#0B84CB' /* any element that's interactive and isn't already using an accent color */,
	disabled: '#B5B5B5',
	backgroundFillRangeLm: [
		'rgba(150, 150, 150, 1)',
		'rgba(175, 175, 175, 1)',
		'rgba(190, 190, 190, 1)'
	],
	text: '#323232',
	textLight: '#737373',
	textDm: '#ffffff',
	title: '#4F4F4F',
	headerBackground: 'rgba(250, 250, 250, 1)',
	contentBoxBackground: 'rgba(252, 252, 252, 0.7)',
	imageLabelBackground: 'rgba(255, 255, 255, 0.7)'
};

export const jdgSizes = {
	contentContainerGapUnit: 'px',
	nContentContainerGapSm: 40,
	get contentContainerGapSm() {
		return this.nContentContainerGapSm.toString() + this.contentContainerGapUnit;
	},
	nContentContainerGapMd: 50,
	get contentContainerGapMd() {
		return this.nContentContainerGapMd.toString() + this.contentContainerGapUnit;
	},
	nContentContainerGapLg: 60,
	get contentContainerGapLg() {
		return this.nContentContainerGapLg.toString() + this.contentContainerGapUnit;
	},

	fontUnit: 'rem',
	nFontSizeBodyXSm: 0.75,
	get fontSizeBodyXSm() {
		return this.nFontSizeBodyXSm.toString() + this.fontUnit;
	},
	nFontSizeBodySm: 1.0,
	get fontSizeBodySm() {
		return this.nFontSizeBodySm.toString() + this.fontUnit;
	},
	nFontSizeBodyMd: 1.1,
	get fontSizeBodyMd() {
		return this.nFontSizeBodyMd.toString() + this.fontUnit;
	},
	nFontSizeBodyLg: 1.2,
	get fontSizeBodyLg() {
		return this.nFontSizeBodyLg.toString() + this.fontUnit;
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
	nFontSizeAccentTextSecondarySm: 1.25,
	get fontSizeAccentTextSecondarySm() {
		return this.nFontSizeAccentTextSecondarySm.toString() + this.fontUnit;
	},
	nFontSizeAccentTextSecondaryMd: 1.5,
	get fontSizeAccentTextSecondaryMd() {
		return this.nFontSizeAccentTextSecondaryMd.toString() + this.fontUnit;
	},
	nFontSizeAccentTextSecondaryLg: 1.75,
	get fontSizeAccentTextSecondaryLg() {
		return this.nFontSizeAccentTextSecondaryLg.toString() + this.fontUnit;
	},

	nFontSizeFloatingContentBoxTitle: 2,
	get fontSizeFloatingContentBoxTitle() {
		return this.nFontSizeFloatingContentBoxTitle.toString() + this.fontUnit;
	},
	nFontSizeFloatingContentBoxSubtitle: 1.25,
	get fontSizeFloatingContentBoxSubtitle() {
		return this.nFontSizeFloatingContentBoxSubtitle.toString() + this.fontUnit;
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

	nBodyCopyVerticalPaddingSm: 5,
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
	default: 300,
	fadeIn: 500,
	scrollFadeIn: 750,
	loadingSpinnerInterval: 1500,
	unit: 'ms'
};

//
// fade-in styles
//

// the translation just before the element is visible
export const fadeInSettleBefore = css`
	transform: translateY(-50px);
	opacity: 0;
	transition:
		opacity ${jdgDurations.scrollFadeIn}${jdgDurations.unit},
		transform ${jdgDurations.scrollFadeIn}${jdgDurations.unit};
`;

// translation just after the element is visible
export const fadeInSettleAfter = css`
	transform: translateY(0);
	opacity: 1;
	transition:
		opacity ${jdgDurations.scrollFadeIn}${jdgDurations.unit},
		transform ${jdgDurations.scrollFadeIn}${jdgDurations.unit};
`;

//
// hyperlink styles
//

export const jdgLinkStyles = {
	animatedBar: css`
		/* general hyperlink style setup */
		a {
			/* link text color defined in JDGAppContainer.svelte Emotion CSS */
			position: relative;
			display: inline-block;
			text-decoration: none;
			line-height: 1; /* don't inherit possible parent line height */
		}

		.jdg-highlight-container {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
		}

		.jdg-highlight {
			position: relative;
		}

		@keyframes slide-right {
			0% {
				width: 0;
			}
			100% {
				width: calc(100% + 4px);
			}
		}

		@keyframes slide-up {
			0% {
				height: 0;
			}
			100% {
				height: 10px;
			}
		}

		/* header logo, menu icon */
		a.no-initial-highlight::before,
		.jdg-highlight-container .jdg-highlight.no-initial-highlight::before {
			content: '';
			position: absolute;
			z-index: -1;
			width: calc(100% + 8px);
			left: -4px;
			height: 0;
			bottom: -0.225rem;
			/* link banner background color specified in JDGAppContainer.svelte Emotion CSS */
			transition: all 0.3s ease-in-out;
		}

		.jdg-letter-spacing-title a.no-initial-highlight::before,
		.jdg-letter-spacing-title .jdg-highlight-container .jdg-highlight.no-initial-highlight::before {
			left: -6px;
		}

		/* primarily for BodyCopy links */
		a::before,
		.jdg-highlight-container .jdg-highlight::before {
			content: '';
			position: absolute;
			z-index: -1;
			width: calc(100% + 4px);
			height: 8px;
			bottom: -0.1rem;
			left: -2px;
			/* background-color: this needs to be specified using emotion css */
			transition: all 0.5s ease-in-out;
			line-height: 1.2; /* don't inherit possible parent line height */
		}

		a:hover::before,
		.jdg-highlight-container:hover .jdg-highlight::before {
			animation: slide-right 0.5s forwards;
		}

		a::before:hover {
			background-color: none;
		}

		/* certain elements like header logo and nav get a different <a> treatment */
		a.no-initial-highlight::before,
		.jdg-highlight.no-initial-highlight::before {
			height: 0;
		}

		a.no-initial-highlight:hover::before,
		.jdg-highlight-container:hover .jdg-highlight.no-initial-highlight::before {
			animation: slide-up 0.5s forwards;
		}
	`,

	simple: css`
		a {
			text-decoration: none;
			display: initial;
		}

		a::before,
		.jdg-highlight-container .jdg-highlight::before {
			content: initial;
			position: initial;
			z-index: auto;
			width: auto;
			height: auto;
			bottom: auto;
			left: auto;
			transition: none;
			line-height: normal;
		}

		a:hover::before,
		.jdg-highlight-container:hover .jdg-highlight::before {
			animation: none;
		}

		a::before:hover {
			background-color: initial;
		}
	`
};
