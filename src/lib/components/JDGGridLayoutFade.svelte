<script>
	import { css } from '@emotion/css';

	import { accentColors, isMobileBreakpoint, windowWidth } from '$lib/states/ui-state.js';
	import { lightenColor } from '$lib/jdg-utils.js';

	import { JDGGridLayout } from '$lib/index.js';

	export let maxHeightPx = 500;
	const buttonHeightPx = 50;
	const overlapFactor = 0.35;

	let isClipped = true;

	const toggleClipping = () => {
		isClipped = !isClipped;
	};

	const getCalculatedMaxHeight = () => {
		if ($isMobileBreakpoint) {
			return maxHeightPx * (3 + (1 + overlapFactor));
		} else {
			return maxHeightPx * (1 + overlapFactor);
		}
	};

	const gradientCss = css`
		height: 200px;
		background: linear-gradient(to top, white ${`${buttonHeightPx}px`}, transparent 200px);

		:hover {
			background: linear-gradient(
				to top,
				${lightenColor($accentColors[0], 0.5)} ${`${buttonHeightPx}px`},
				transparent 200px
			);
		}
	`;

	let containerCss = css``;
	$: {
		containerCss = css`
			height: ${isClipped ? `${getCalculatedMaxHeight()}px` : ''};
		`;
	}
</script>

<div class="jdg-grid-layout-fade-container {containerCss}">
	{#if isClipped}
		<div class="gradient-fade-absolute">
			<div class="grid-layout-fade-see-more">
				SHOW MORE&nbsp;<i class="fa-solid fa-chevron-down"></i>
			</div>
			<div
				class="gradient {gradientCss}"
				role="button"
				tabindex="0"
				on:click={toggleClipping}
				on:keypress={toggleClipping}
			/>
		</div>
	{/if}
	<JDGGridLayout>
		<slot />
	</JDGGridLayout>
</div>

<style>
	.jdg-grid-layout-fade-container {
		position: relative;
		overflow: hidden;
	}

	.gradient-fade-absolute {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1;
        cursor: pointer;
	}

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
		pointer-events: none;
	}
</style>
