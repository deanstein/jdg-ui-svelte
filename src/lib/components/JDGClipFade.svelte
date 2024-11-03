<script>
	import { css } from '@emotion/css';

	import { accentColors, isMobileBreakpoint, windowWidth } from '$lib/states/ui-state.js';
	import { lightenColor } from '$lib/jdg-utils.js';

	export let maxHeightPx = 500;

	const buttonHeightPx = 50;
	const overlapFactor = 0.35;

	// is the grid content clipped?
	let isClipped = true;

	const toggleClipping = () => {
		isClipped = !isClipped;
	};

	const getCalculatedMaxHeightPx = () => {
		let finalMaxHeightPx = 0;
		if ($isMobileBreakpoint) {
			finalMaxHeightPx = maxHeightPx * (3 + (1 + overlapFactor));
		} else {
			finalMaxHeightPx = maxHeightPx * (1 + overlapFactor);
		}
		console.log(finalMaxHeightPx);
		return finalMaxHeightPx;
	};

	const clipFadeGradientCss = css`
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

	// set the max height or no height if no clipping requested
	let clipFadeContainerCssDynamic = css``;
	$: {
		$windowWidth;
		clipFadeContainerCssDynamic = css`
			height: ${isClipped ? `${getCalculatedMaxHeightPx()}px` : ''};
		`;
	}
</script>

<div class="jdg-clip-fade-container {clipFadeContainerCssDynamic}">
	{#if isClipped}
		<div class="clip-fade-absolute">
			<div class="clip-fade-see-more">
				SHOW MORE&nbsp;<i class="fa-solid fa-chevron-down"></i>
			</div>
			<div
				class="clip-fade-gradient {clipFadeGradientCss}"
				role="button"
				tabindex="0"
				on:click={toggleClipping}
				on:keypress={toggleClipping}
			/>
		</div>
	{/if}
	<slot />
</div>

<style>
	.jdg-clip-fade-container {
		position: relative;
		overflow: hidden;
	}

	.clip-fade-absolute {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		cursor: pointer;
	}

	.clip-fade-see-more {
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
