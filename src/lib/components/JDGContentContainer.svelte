<script>
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { css } from '@emotion/css';

	export let overlapWithHeader = false;
	export let topBottomPadding = '60px';
	export let gap = undefined;

	const jdgContentContainerCss = css`
		padding: ${overlapWithHeader ? '0' : topBottomPadding} 0 ${topBottomPadding} 0;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightSm : '0'};
			gap: ${gap ?? '40px'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightSm : '0'};
			gap: ${gap ?? '50px'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightLg : '0'};
			gap: ${gap ?? '60px'};
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
		width: -webkit-fill-available;
		width: -moz-available;
	}
</style>
