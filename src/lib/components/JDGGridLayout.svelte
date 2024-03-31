<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-styling-constants.js';
	const gridContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			gap: ${jdgSizes.contentBoxPaddingSm};
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			gap: ${(jdgSizes.nContentBoxPaddingMd / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			gap: ${(jdgSizes.nContentBoxPaddingLg / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	`;
</script>

<div class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>

<style>
	.jdg-grid-container {
		display: grid;
	}
</style>
