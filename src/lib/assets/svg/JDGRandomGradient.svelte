<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	import { themeColors } from '$lib/jdg-shared-styles.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';

	export let numberOfPoints = 3;
	export let edgeBufferRatio = 0.05; // points will be this far away from screen edges (ratio of total width or height)
	export let drawDebugBorders = false;
	export let borderColorsHex = ['#C3C3C3FF']; // only used if drawBorders is true
	// Optional custom colors - if provided, these override the default themeColors
	export let color1 = undefined;
	export let color2 = undefined;
	export let color3 = undefined;
	export let opacity = 0.5;

	let gradientStyle = '';
	let borderElements = [];
	let points = [];

	onMount(() => {
		points = d3.range(numberOfPoints).map(() => {
			const widthBuffer = edgeBufferRatio * 100;
			const heightBuffer = edgeBufferRatio * 100;
			return {
				x: d3.randomUniform(widthBuffer, 100 - widthBuffer)(),
				y: d3.randomUniform(heightBuffer, 100 - heightBuffer)()
			};
		});

		if (drawDebugBorders) {
			borderColorsHex ?? getAccentColors();
			borderElements = points.map((point) => ({
				x: point.x,
				y: point.y,
				color: borderColorsHex[Math.floor(Math.random() * borderColorsHex.length)]
			}));
		}
	});

	$: if (points.length > 0) {
		const baseColor1 = color1 || $themeColors.backgroundFillRange0;
		const baseColor2 = color2 || $themeColors.backgroundFillRange1;
		const baseColor3 = color3 || $themeColors.backgroundFillRange2;
		const baseColors = [baseColor1, baseColor2, baseColor3];

		const gradientLayers = [];
		points.forEach((point, index) => {
			const colorIndex = index % baseColors.length;
			const c = baseColors[colorIndex];

			const minStop = 20;
			const maxStop = 45;
			const stopStep = (maxStop - minStop) / Math.max(1, points.length - 1);
			const centerStop = minStop + index * stopStep;
			const fadeStop = centerStop + 30;

			gradientLayers.push(
				`radial-gradient(circle at ${point.x}% ${point.y}%, ${c} 0%, ${c} ${centerStop}%, transparent ${fadeStop}%)`
			);
		});

		gradientLayers.push(baseColor2);
		gradientStyle = gradientLayers.join(', ');
	}
</script>

<div class="jdg-random-gradient" style="background: {gradientStyle}; opacity: {opacity};">
	{#if drawDebugBorders}
		<svg class="jdg-random-gradient-borders" width="100%" height="100%">
			{#each borderElements as border}
				<circle
					cx="{border.x}%"
					cy="{border.y}%"
					r="3"
					fill="none"
					stroke={border.color}
					stroke-width="2px"
				/>
			{/each}
		</svg>
	{/if}
</div>

<style>
	.jdg-random-gradient {
		height: 100%;
		width: 100%;
		position: relative;
	}

	.jdg-random-gradient-borders {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
