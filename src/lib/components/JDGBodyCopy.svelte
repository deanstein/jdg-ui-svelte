<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';

	const bodyCopyContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 15px;
			padding: 0 ${jdgSizes.bodyCopyVerticalPaddingSm} 0 ${jdgSizes.bodyCopyVerticalPaddingSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 16px;
			padding: 0 ${jdgSizes.bodyCopyVerticalPaddingMd} 0 ${jdgSizes.bodyCopyVerticalPaddingMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 18px;
			padding: 1rem ${jdgSizes.bodyCopyVerticalPaddingLg} 1rem ${jdgSizes.bodyCopyVerticalPaddingLg};
		}
	`;
</script>

<div class="jdg-body-copy-container {bodyCopyContainerCss}">
	<slot />
</div>
