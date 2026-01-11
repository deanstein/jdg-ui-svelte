<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { generateGradient } from '$lib/jdg-graphics-factory.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';

	export let numberOfPoints = 3;
	export let edgeBufferRatio = 0.25; // points will be this far away from screen edges (ratio of total width or height)
	export let drawBorders = true;
	export let borderColorsHex = ['#C3C3C3FF']; // only used if drawBorders is true
	export let showDebugPoints = false; // show debug circles at gradient points

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

		// define fill colors
		const fillColors = generateGradient(
			numberOfPoints,
			jdgColors.backgroundFillRangeLm[0],
			jdgColors.backgroundFillRangeLm[1],
			jdgColors.backgroundFillRangeLm[2]
		);

		if (drawBorders) {
			borderColorsHex ?? getAccentColors();
		}

		// Create CSS gradient layers similar to generateEventGradient
		const gradientLayers = [];

		points.forEach((point, index) => {
			// Use a color from the generated gradient, cycling through them
			const colorIndex = index % fillColors.length;
			const color = fillColors[colorIndex];

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
		// Use the first color from the gradient as the base
		const baseColor = fillColors[0];
		gradientLayers.push(baseColor);

		// Create the CSS background string
		gradientStyle = gradientLayers.join(', ');

		// Store border elements if debug points are enabled
		if (showDebugPoints) {
			borderElements = points.map((point, index) => ({
				x: point.x,
				y: point.y,
				color: borderColorsHex[Math.floor(Math.random() * borderColorsHex.length)]
			}));
		}
	});
</script>

<div class="jdg-random-gradient" style="background: {gradientStyle};">
	{#if showDebugPoints}
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
		height: 150%;
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
