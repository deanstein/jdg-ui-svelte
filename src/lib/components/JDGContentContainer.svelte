<script>
	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { css } from '@emotion/css';

	export let overlapWithHeader = false;
	export let paddingTop = undefined;
	export let paddingBottom = undefined;
	export let gap = undefined;

	// if not specified, these are the defaults for padding and gap
	const topBottomPaddingAndGapSm = '40px';
	const topBottompaddingAndGapMd = '50px';
	const topBottomPaddingAndGapLg = '60px';

	const jdgContentContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${overlapWithHeader ? '0' : paddingTop ?? topBottomPaddingAndGapSm} 0
				${paddingBottom ?? topBottomPaddingAndGapSm} 0;
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightSm : '0'};
			gap: ${gap ?? topBottomPaddingAndGapSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${overlapWithHeader ? '0' : paddingTop ?? topBottompaddingAndGapMd} 0
				${paddingBottom ?? topBottompaddingAndGapMd} 0;
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightMd : '0'};
			gap: ${gap ?? topBottompaddingAndGapMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${overlapWithHeader ? '0' : paddingTop ?? topBottomPaddingAndGapLg} 0
				${paddingBottom ?? topBottomPaddingAndGapLg} 0;
			margin-top: ${overlapWithHeader ? '-' + jdgSizes.headerHeightLg : '0'};
			gap: ${gap ?? topBottomPaddingAndGapLg};
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
