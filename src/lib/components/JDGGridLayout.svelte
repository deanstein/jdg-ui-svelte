<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-styling-constants.js';
	const gridContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			display: grid;
			gap: ${jdgSizes.contentBoxPaddingSm};
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: ${(jdgSizes.nContentBoxPaddingMd / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			display: grid;
			gap: ${(jdgSizes.nContentBoxPaddingLg / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	`;
</script>

<div class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>
