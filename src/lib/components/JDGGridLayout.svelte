<script>
	import { afterUpdate } from 'svelte';
	import { css } from '@emotion/css';

	import { jdgBreakpoints, jdgSizes } from '../jdg-shared-styles.js';
	import { jdgSharedIdentifiers } from '$lib/jdg-shared-strings.js';

	export let maxColumns = 3;
	export let forceMaxColumns = false; // if true, max columns even on smallest breakpoints

	// used for determining number of children passed into slot
	let gridLayoutContainer;

	const gridContainerCss = css`
		align-items: baseline;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			> * {
				flex: 0 1 ${forceMaxColumns ? `calc(100% / ${maxColumns})` : '100%'};
			}
			gap: ${jdgSizes.nContentBoxPaddingSm.toString() + jdgSizes.contentBoxPaddingUnit};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			> * {
				flex: 0 1
					calc(
						${forceMaxColumns ? `(100% / ${maxColumns})` : '50%'} -
							${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxPaddingUnit}
					);
			}
			gap: ${jdgSizes.nContentBoxPaddingMd.toString() + jdgSizes.contentBoxPaddingUnit};
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

	afterUpdate(() => {
		const items = gridLayoutContainer.children;
		// if there are only two items passed into the slot
		if (items.length === 2) {
			// wrap each item in their own grid so they align toward each other/toward screen center
			Array.from(items).forEach((node) => {
				const wrapper = document.createElement('div');
				wrapper.style.display = 'grid';
				wrapper.style.maxWidth = 'fit-content';
				// if one of the children is an ImageCompare, need to add auto flexBasis
				if (node.classList.contains(jdgSharedIdentifiers.imageCompareWrapper)) {
					wrapper.style.flexBasis = 'auto';
				}

				node.parentNode.insertBefore(wrapper, node);
				wrapper.appendChild(node);
			});
		}
	});
</script>

<div bind:this={gridLayoutContainer} class="jdg-grid-container {gridContainerCss}">
	<slot />
</div>
