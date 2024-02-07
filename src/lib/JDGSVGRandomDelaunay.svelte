<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { Delaunay } from 'd3-delaunay';

	import { jdgColors } from './jdg-styling-constants.js';
	import { generateGradient } from './jdg-graphics-factory.js';

	export let numberOfPoints = 16;

	export let drawBorders = false;

	export let heightMultiplier = 1; // set to > 1 if this image is used in a parallax context

	onMount(() => {
		const svg = d3
			.select('#jdg-random-delaunay')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		// Define a buffer to prevent points from being too close to the edges
		const buffer = 150;

		// Generate evenly distributed points
		let points = d3.range(numberOfPoints).map(() => {
			return [
				d3.randomUniform(buffer, window.innerWidth - buffer)(),
				d3.randomUniform(buffer, window.innerHeight * heightMultiplier - buffer)()
			];
		});

		// Add corners of the SVG
		points.push([0, 0]); // Top-left corner
		points.push([window.innerWidth, 0]); // Top-right corner
		points.push([0, window.innerHeight * heightMultiplier]); // Bottom-left corner
		points.push([window.innerWidth, window.innerHeight * heightMultiplier]); // Bottom-right corner

		// Divide each side into 4 segments and add those points
		for (let i = 1; i < 4; i++) {
			points.push([(i * window.innerWidth) / 4, 0]); // Top side
			points.push([(i * window.innerWidth) / 4, window.innerHeight * heightMultiplier]); // Bottom side
			points.push([0, (i * window.innerHeight * heightMultiplier) / 4]); // Left side
			points.push([window.innerWidth, (i * window.innerHeight * heightMultiplier) / 4]); // Right side
		}

		// Create Delaunay triangulation
		const delaunay = Delaunay.from(points);
		const triangles = delaunay.triangles;

		// Define fill colors and border colors
		const fillColors = generateGradient(
			triangles.length,
			jdgColors.backgroundFillRangeLM[0],
			jdgColors.backgroundFillRangeLM[1],
			jdgColors.backgroundFillRangeLM[2]
		);
		console.log(fillColors.length, triangles.length);
		const borderColors = jdgColors.accentStripesJDG;

		// Draw triangles
		for (let i = 0; i < triangles.length; i += 3) {
			// Randomly select one of the fill colors and remove it from the array
			const colorIndex = Math.floor(Math.random() * fillColors.length);
			const fillColor = fillColors.splice(colorIndex, 1)[0];

			let polygon = svg
				.append('polygon')
				.attr(
					'points',
					`${points[triangles[i]]},${points[triangles[i + 1]]},${points[triangles[i + 2]]}`
				)
				.style('fill', fillColor); // Use the selected fill color

			if (drawBorders) {
				polygon
					.style('stroke', borderColors[Math.floor(Math.random() * borderColors.length)]) // Randomly select one of the border colors
					.style('stroke-width', '2px'); // Set the stroke width
			}
		}
	});
</script>

<div id="jdg-random-delaunay" class="jdg-random-delaunay"></div>

<style>
	.jdg-random-delaunay {
		height: 150%;
		width: 100%;
		opacity: 50%;
	}
</style>
