<script>
	import { appAccentColors } from '$lib/states/ui-state.js';
	import { jdgDurations } from '$lib/jdg-shared-styles.js';

	export let strokeColor = $appAccentColors[0];
	export let strokeWidthPx = 4;
	export let spinnerHeightPx = 50;

	let radius = spinnerHeightPx * 0.4; // 20 is 40% of default height (50)
	let dashArrayRatio = spinnerHeightPx / 50; // default height is 50px
	let baseArc = 30 * dashArrayRatio; // starting segment
	let fullCirc = 2 * Math.PI * radius; // circumference for reference

	let dashArrayValues = `
	${baseArc}, ${fullCirc}; 
	${fullCirc * 0.85}, ${fullCirc}; 
	${baseArc}, ${fullCirc};
`;
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
		stroke-dasharray={`${baseArc}, ${fullCirc}`}
	>
		<animateTransform
			attributeName="transform"
			type="rotate"
			from={`0 ${spinnerHeightPx / 2} ${spinnerHeightPx / 2}`}
			to={`360 ${spinnerHeightPx / 2} ${spinnerHeightPx / 2}`}
			dur={`${jdgDurations.loadingSpinnerInterval}${jdgDurations.unit}`}
			repeatCount="indefinite"
		/>
		<animate
			attributeName="stroke-dasharray"
			values={dashArrayValues}
			dur={`${jdgDurations.loadingSpinnerInterval}${jdgDurations.unit}`}
			repeatCount="indefinite"
		/>
	</circle>
</svg>

<style>
	svg {
		z-index: 1;
	}
</style>
