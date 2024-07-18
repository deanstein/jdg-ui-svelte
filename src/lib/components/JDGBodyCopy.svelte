<script>
	import { getContext } from 'svelte';
	import { css } from '@emotion/css';

	import jdgContexts from '$lib/jdg-contexts.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let fontSizeMultiplier = 1; // optionally make fonts larger at all breakpoints
	export let paddingTop = undefined; // first body copy in a section needs this set to 0
	export let paddingBottom = undefined;
	export let textAlign = 'left';
	export let textColor = undefined; // inherits from app by default
	export let simpleHyperlinkStyle = false;

	const bodyCopyContainerCss = css`
		color: ${textColor ?? ''};
		a {
			color: ${textColor && !simpleHyperlinkStyle ? textColor : ''};
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
		? getContext(jdgContexts.linkStyleSimple)
		: ''}"
>
	<slot />
</p>
