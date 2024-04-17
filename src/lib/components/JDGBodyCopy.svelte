<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	export let fontSizeMultiplier = 1; // optionally make fonts larger at all breakpoints
	export let paddingTop = undefined; // first body copy needs this set to 0

	const bodyCopyContainerCss = css`
		line-height: 1.5;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: calc(${fontSizeMultiplier * 15}px);
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm}
				${jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: calc(${fontSizeMultiplier * 16}px);
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd}
				${jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: calc(${fontSizeMultiplier * 18}px);
			padding: ${paddingTop ?? jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg}
				${jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;
</script>

<p class="jdg-body-copy-container {bodyCopyContainerCss}">
	<slot />
</p>
