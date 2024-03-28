<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints } from '../jdg-styling-constants.js';

	const gridContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			gap: 0.5rem;
			grid-template-columns: repeat(1, 1fr);
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			gap: 1rem;
			grid-template-columns: repeat(2, 1fr);
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			gap: 1.5rem;
			grid-template-columns: repeat(3, 1fr);
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
