<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	const bodyCopyContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 15px;
			padding: ${jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm}
				${jdgSizes.contentBoxPaddingSm} ${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 16px;
			padding: ${jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd}
				${jdgSizes.contentBoxPaddingMd} ${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 18px;
			padding: ${jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg}
				${jdgSizes.contentBoxPaddingLg} ${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;
</script>

<div class="jdg-body-copy-container {bodyCopyContainerCss}">
	<slot />
</div>
