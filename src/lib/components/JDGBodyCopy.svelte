<script>
	import { css } from '@emotion/css';

	import { appCssHyperlinkSimple } from '$lib/stores/jdg-ui-store.js';
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let fontSizeMultiplier = 1; // optionally make fonts larger at all breakpoints
	export let paddingTop = undefined; // first body copy in a section needs this set to 0
	export let paddingBottom = undefined;
	export let textAlign = 'left';
	export let textColor = undefined; // inherits from app by default
	export let textWrap = 'wrap'; // change to balanced for certain cases
	export let simpleHyperlinkStyle = false;

	const bodyCopyContainerCss = css`
		color: ${textColor ?? ''};
		text-align: ${textAlign};
		text-wrap: ${textWrap};
		line-height: 1.8;

		a {
			color: ${textColor && !simpleHyperlinkStyle ? textColor : ''};
		}

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
		? $appCssHyperlinkSimple
		: ''}"
>
	<slot />
</p>
