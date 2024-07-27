<script>
	import uiState from '$lib/states/ui-state.js';
	import { jdgDurations } from '$lib/jdg-shared-styles.js';

	export let strokeColor = $uiState.accentColors[0];
	export let strokeWidthPx = 4;
	export let spinnerHeightPx = 50;

	let radius = spinnerHeightPx * 0.4; // 20 is 40% of default height (50)
	let dashArrayRatio = spinnerHeightPx / 50; // default height is 50px
	let dashArrayValues = `${100 * dashArrayRatio}, ${150 * dashArrayRatio}; 
		${50 * dashArrayRatio}, ${150 * dashArrayRatio}; 
		${100 * dashArrayRatio},${150 * dashArrayRatio};`;
</script>

<svg
	width={spinnerHeightPx}
	height={spinnerHeightPx}
	viewBox={`0 0 ${spinnerHeightPx} ${spinnerHeightPx}`}
>
	<circle
		cx={spinnerHeightPx / 2}
		cy={spinnerHeightPx / 2}
		r={radius}
		fill="none"
		stroke={strokeColor}
		stroke-width={strokeWidthPx}
	>
		<animateTransform
			attributeName="transform"
			type="rotate"
			from={`0 ${spinnerHeightPx / 2} ${spinnerHeightPx / 2}`}
			to={`360 ${spinnerHeightPx / 2} ${spinnerHeightPx / 2}`}
			dur={`${jdgDurations.loading}${jdgDurations.unit}`}
			repeatCount="indefinite"
		/>
		<animate
			attributeName="stroke-dasharray"
			values={dashArrayValues}
			dur={`${jdgDurations.loading}${jdgDurations.unit}`}
			repeatCount="indefinite"
		/>
	</circle>
</svg>

<style>
	svg {
		z-index: 1;
	}
</style>
