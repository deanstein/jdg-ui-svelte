<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-shared-styles.js';

	export let maxColumns = 3;
	export let forceMaxColumns = false; // if true, max columns even on smallest breakpoints

	const gridContainerCss = css`
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			> * {
				flex: 0 1 ${forceMaxColumns ? 'calc(100% / 3)' : '100%'};
			}
			gap: ${(jdgSizes.nContentBoxPaddingSm / 2).toString() + jdgSizes.contentBoxPaddingUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			> * {
				flex: 0 1
					calc(
						${forceMaxColumns ? '(100% / 3)' : '50%'} -
							${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxPaddingUnit}
					);
			}
			gap: ${(jdgSizes.nContentBoxPaddingMd / 2).toString() + jdgSizes.contentBoxPaddingUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			> * {
				flex: 0 1
					calc(
						(100% / ${maxColumns}) -
							${(jdgSizes.nContentBoxPaddingLg / 2).toString() + jdgSizes.contentBoxPaddingUnit}
					);
			}
			gap: ${(jdgSizes.nContentBoxPaddingLg / 2).toString() + jdgSizes.contentBoxPaddingUnit};
		}
	`;
</script>

<div class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>
