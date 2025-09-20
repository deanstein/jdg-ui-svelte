<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { Delaunay } from 'd3-delaunay';

	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { generateGradient } from '$lib/jdg-graphics-factory.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';

	export let numberOfPoints = 8;
	export let edgeBufferRatio = 0.25; // points will be this far away from screen edges (ratio of total width or height)
	export let drawBorders = true;
	export let borderColorsHex = ['#C3C3C3FF']; // only used if drawBorders is true
	export let heightMultiplier = 1; // set to > 1 if this image is used in a parallax context

	onMount(() => {
		const svg = d3
			.select('#jdg-random-delaunay')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('preserveAspectRatio', 'xMidYMid slice')
			.attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

		// generate evenly-distributed random points
		let points = d3.range(numberOfPoints).map(() => {
			const widthBuffer = window.innerWidth * edgeBufferRatio;
			const heightBuffer = window.innerHeight * heightMultiplier * edgeBufferRatio;
			return [
				d3.randomUniform(widthBuffer, window.innerWidth - widthBuffer)(),
				d3.randomUniform(heightBuffer, window.innerHeight * heightMultiplier - heightBuffer)()
			];
		});

		// add the four corners of the SVG
		points.push([0, 0]); // Top-left corner
		points.push([window.innerWidth, 0]); // Top-right corner
		points.push([0, window.innerHeight * heightMultiplier]); // Bottom-left corner
		points.push([window.innerWidth, window.innerHeight * heightMultiplier]); // Bottom-right corner

		// divide each side into 4 segments and add those points
		for (let i = 1; i < 4; i++) {
			points.push([(i * window.innerWidth) / 4, 0]); // Top side
			points.push([(i * window.innerWidth) / 4, window.innerHeight * heightMultiplier]); // Bottom side
			points.push([0, (i * window.innerHeight * heightMultiplier) / 4]); // Left side
			points.push([window.innerWidth, (i * window.innerHeight * heightMultiplier) / 4]); // Right side
		}

		// create Delaunay triangulation
		const delaunay = Delaunay.from(points);
		const triangles = delaunay.triangles;

		// define fill colors and border colors
		const fillColors = generateGradient(
			triangles.length,
			jdgColors.backgroundFillRangeLm[0],
			jdgColors.backgroundFillRangeLm[1],
			jdgColors.backgroundFillRangeLm[2]
		);

		// console.log("created " + triangles.length + " delaunay triangles for background image.")
		if (drawBorders) {
			borderColorsHex ?? getAccentColors();
		}

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
					.style('stroke', borderColorsHex[Math.floor(Math.random() * borderColorsHex.length)]) // Randomly select one of the border colors
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
