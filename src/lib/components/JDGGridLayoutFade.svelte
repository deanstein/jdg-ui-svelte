<script>
	import { css } from '@emotion/css';

	import { accentColors, isMobileBreakpoint, windowWidth } from '$lib/states/ui-state.js';

	import { JDGButton, JDGGridLayout } from '$lib/index.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { darkenColor, lightenColor } from '$lib/jdg-utils.js';

	export let maxHeightPx = 500;

	const getCalculatedMaxHeight = () => {
		const overlapFactor = 0.35;
		if ($isMobileBreakpoint) {
			return maxHeightPx * (3 + (1 + overlapFactor));
		} else {
			return maxHeightPx * (1 + overlapFactor);
		}
	};

	const gridLayoutFadeContainerCss = css`
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: ${getCalculatedMaxHeight()}px;
			background: linear-gradient(to top, white, transparent);
			pointer-events: none;
		}
	`;

	let gridLayoutFadeContainerDynamicCss = css``;
	$: {
		windowWidth;
		gridLayoutFadeContainerDynamicCss = css`
			height: ${getCalculatedMaxHeight()}px;
		`;
	}

	let seeMoreButtonDynamicCss = css`
		:hover {
			background-color: ${lightenColor($accentColors[0], 0.25)};
		}
	`;
</script>

<div
	class="jdg-grid-layout-fade-container {gridLayoutFadeContainerCss} {gridLayoutFadeContainerDynamicCss}"
>
	<div class={gridLayoutFadeContainerCss}>
		<JDGGridLayout>
			<slot />
		</JDGGridLayout>
	</div>
	<div class="grid-layout-fade-see-more {seeMoreButtonDynamicCss}">SHOW MORE</div>
</div>

<style>
	.grid-layout-fade-see-more {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 0;
		z-index: 1;
		height: 50px;
		width: 100%;
		text-align: center;
	}
</style>
