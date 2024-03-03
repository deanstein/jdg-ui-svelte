<script>
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { css } from '@emotion/css';

	export let overlapWithHeader = false;

	const jdgContentContainerCss = css`
		padding: ${overlapWithHeader ? '0vh' : '10vh'} 0 10vh 0;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightSm : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightSm : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightLg : '0'};
		}
	`;
</script>

<div class="jdg-content-container {jdgContentContainerCss}">
	<slot />
</div>

<style>
	.jdg-content-container {
		display: flex;
		flex-direction: column;
		gap: 10vh;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 70vh;
	}
</style>
