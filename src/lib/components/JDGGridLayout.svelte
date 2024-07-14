<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-shared-styles.js';

	export let maxColumns = 3;

	const gridContainerCss = css`
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			> * {
				flex: 0 1 100%;
			}
			gap: ${(jdgSizes.nContentBoxFloatingMarginSm / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			> * {
				flex: 0 1
					calc(
						50% -
							${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxFloatingMarginUnit}
					);
			}
			gap: ${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxFloatingMarginUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			> * {
				flex: 0 1
					calc(
						(100% / ${maxColumns}) -
							${(jdgSizes.nContentBoxPaddingLg / 2).toString() +
							jdgSizes.contentBoxFloatingMarginUnit}
					);
			}
			gap: ${(jdgSizes.nContentBoxPaddingLg / 2).toString() +
			jdgSizes.contentBoxFloatingMarginUnit};
		}
	`;
</script>

<div class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>
