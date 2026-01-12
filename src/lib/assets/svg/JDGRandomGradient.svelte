<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';

	export let numberOfPoints = 3;
	export let edgeBufferRatio = 0.05; // points will be this far away from screen edges (ratio of total width or height)
	export let drawBorders = true;
	export let borderColorsHex = ['#C3C3C3FF']; // only used if drawBorders is true
	// Optional custom colors - if provided, these override the default jdgColors
	export let color1 = undefined;
	export let color2 = undefined;
	export let color3 = undefined;

	let gradientStyle = '';
	let borderElements = [];

	onMount(() => {
		// generate evenly-distributed random points (as percentages)
		let points = d3.range(numberOfPoints).map(() => {
			const widthBuffer = edgeBufferRatio * 100;
			const heightBuffer = edgeBufferRatio * 100;
			return {
				x: d3.randomUniform(widthBuffer, 100 - widthBuffer)(),
				y: d3.randomUniform(heightBuffer, 100 - heightBuffer)()
			};
		});

		// Define the three base colors - use custom colors if provided, otherwise use defaults
		const baseColor1 = color1 || jdgColors.backgroundFillRangeLm[0];
		const baseColor2 = color2 || jdgColors.backgroundFillRangeLm[1];
		const baseColor3 = color3 || jdgColors.backgroundFillRangeLm[2];
		const baseColors = [baseColor1, baseColor2, baseColor3];

		if (drawBorders) {
			borderColorsHex ?? getAccentColors();
		}

		// Create CSS gradient layers similar to generateEventGradient
		const gradientLayers = [];

		points.forEach((point, index) => {
			// Assign one of the 3 base colors to each point
			// Distribute evenly: point 0 gets color1, point 1 gets color2, point 2 gets color3, etc.
			const colorIndex = index % baseColors.length;
			const color = baseColors[colorIndex];

			// Create radial gradient with varying sizes
			const minStop = 20;
			const maxStop = 45;
			const stopStep = (maxStop - minStop) / Math.max(1, points.length - 1);
			const centerStop = minStop + index * stopStep;
			const fadeStop = centerStop + 30;

			// Create gradient that fades from color to transparent
			gradientLayers.push(
				`radial-gradient(circle at ${point.x}% ${point.y}%, ${color} 0%, ${color} ${centerStop}%, transparent ${fadeStop}%)`
			);
		});

		// Add base color as the bottom layer (background)
		// Use the middle color (color2) as the base background
		const baseColor = baseColor2;
		gradientLayers.push(baseColor);

		// Create the CSS background string
		gradientStyle = gradientLayers.join(', ');

		// Store border elements if needed
		if (drawBorders) {
			borderElements = points.map((point, index) => ({
				x: point.x,
				y: point.y,
				color: borderColorsHex[Math.floor(Math.random() * borderColorsHex.length)]
			}));
		}
	});
</script>

<div class="jdg-random-gradient" style="background: {gradientStyle};">
	{#if drawBorders}
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
		opacity: 50%;
		position: relative;
	}

	.jdg-random-gradient-borders {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
