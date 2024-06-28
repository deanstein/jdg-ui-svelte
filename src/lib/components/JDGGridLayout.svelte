<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-styling-constants.js';

	export let maxColumns = 3;

	const gridContainerCss = css`
		align-items: center;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			display: grid;
			gap: ${jdgSizes.contentBoxPaddingSm};
			grid-template-columns: repeat(1, minmax(0, 1fr));
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			display: grid;
			gap: ${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxFloatingMarginUnit};
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			display: grid;
			gap: ${(jdgSizes.nContentBoxPaddingLg / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
			grid-template-columns: repeat(${maxColumns}, minmax(0, 1fr));
		}
	`;
</script>

<div class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>
