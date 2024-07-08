<script>
	import { css } from '@emotion/css';

	import {
		jdgBreakpoints,
		jdgColors,
		jdgLinkStyles,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { adjustColorForContrast } from '$lib/jdg-utils.js';

	export let fontSizeMultiplier = 1; // optionally make fonts larger at all breakpoints
	export let paddingTop = undefined; // first body copy in a section needs this set to 0
	export let paddingBottom = undefined;
	export let textAlign = 'left';
	export let simpleHyperlinkStyle = false;
	export let linkStyleColor = getAccentColors()[0];

	const bodyCopyContainerCss = css`
		a {
			color: ${simpleHyperlinkStyle
				? adjustColorForContrast(linkStyleColor, jdgColors.contentBoxBackground, 3)
				: jdgColors.text};
		}
		a:hover {
			color: ${simpleHyperlinkStyle
				? adjustColorForContrast(linkStyleColor, jdgColors.contentBoxBackground, 5)
				: jdgColors.text};
		}

		line-height: 1.8;
		text-align: ${textAlign};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${(fontSizeMultiplier * jdgSizes.nFontSizeBodySm).toString() + jdgSizes.fontUnit};
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm}
				${paddingBottom ?? jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${(fontSizeMultiplier * jdgSizes.nFontSizeBodyMd).toString() + jdgSizes.fontUnit};
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd}
				${paddingBottom ?? jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${(fontSizeMultiplier * jdgSizes.nFontSizeBodyLg).toString() + jdgSizes.fontUnit};
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg}
				${paddingBottom ?? jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;
</script>

<p
	class="jdg-body-copy-container {bodyCopyContainerCss} {simpleHyperlinkStyle
		? jdgLinkStyles.simple
		: ''}"
>
	<slot />
</p>
