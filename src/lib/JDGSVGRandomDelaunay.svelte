<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { Delaunay } from 'd3-delaunay';

	export let numberOfPoints = 30;
	export let fillColor1 = '#ccc';
	export let fillColor2 = '#eee';
	export let fillColor3 = '#fff';

	onMount(() => {
		const svg = d3
			.select('#jdg-random-delaunay')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%');

		// Generate evenly distributed points
		let points = d3.range(numberOfPoints).map(() => {
			return [d3.randomUniform(0, window.innerWidth)(), d3.randomUniform(0, window.innerHeight)()];
		});

		// Add corners of the SVG
		points.push([0, 0]); // Top-left corner
		points.push([window.innerWidth, 0]); // Top-right corner
		points.push([0, window.innerHeight]); // Bottom-left corner
		points.push([window.innerWidth, window.innerHeight]); // Bottom-right corner

		// Create Delaunay triangulation
		const delaunay = Delaunay.from(points);
		const triangles = delaunay.triangles;

		// Draw triangles
		for (let i = 0; i < triangles.length; i += 3) {
			svg
				.append('polygon')
				.attr(
					'points',
					`${points[triangles[i]]},${points[triangles[i + 1]]},${points[triangles[i + 2]]}`
				)
				.style('fill', [fillColor1, fillColor2, fillColor3][Math.floor(Math.random() * 3)]); // Randomly select one of the prop colors
		}
	});
</script>

<div id="jdg-random-delaunay" class="jdg-random-delaunay"></div>

<style>
	.jdg-random-delaunay {
		height: 100%;
		width: 100%;
	}
</style>
