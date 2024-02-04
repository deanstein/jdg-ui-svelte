<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { Delaunay } from 'd3-delaunay';

  import { jdgColors } from './jdg-styling-constants.js';

	export let numberOfPoints = 30;
	export let fillColor1 = jdgColors.accentStripesJDG[0];
	export let fillColor2 = jdgColors.accentStripesJDG[1];
	export let fillColor3 = jdgColors.accentStripesJDG[2];

  export let borderColor1 = jdgColors.accentStripesJDG[0];
  export let borderColor2 = jdgColors.accentStripesJDG[1];
  export let borderColor3 = jdgColors.accentStripesJDG[2];

  onMount(() => {
    const svg = d3
        .select('#jdg-random-delaunay')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    // Define a buffer to prevent points from being too close to the edges
    const buffer = 50;

    // Generate evenly distributed points
    let points = d3.range(numberOfPoints).map(() => {
        return [
            d3.randomUniform(buffer, window.innerWidth - buffer)(),
            d3.randomUniform(buffer, window.innerHeight - buffer)()
        ];
    });

    // Add corners of the SVG
    points.push([0, 0]); // Top-left corner
    points.push([window.innerWidth, 0]); // Top-right corner
    points.push([0, window.innerHeight]); // Bottom-left corner
    points.push([window.innerWidth, window.innerHeight]); // Bottom-right corner

    // Divide each side into 4 segments and add those points
for (let i = 1; i < 4; i++) {
    points.push([i * window.innerWidth / 4, 0]); // Top side
    points.push([i * window.innerWidth / 4, window.innerHeight]); // Bottom side
    points.push([0, i * window.innerHeight / 4]); // Left side
    points.push([window.innerWidth, i * window.innerHeight / 4]); // Right side
}

    // Create Delaunay triangulation
    const delaunay = Delaunay.from(points);
    const triangles = delaunay.triangles;

    // Define fill colors and border colors
    const fillColors = [fillColor1, fillColor2, fillColor3];
    const borderColors = [borderColor1, borderColor2, borderColor3];

    // Draw triangles
    for (let i = 0; i < triangles.length; i += 3) {
        svg
            .append('polygon')
            .attr(
                'points',
                `${points[triangles[i]]},${points[triangles[i + 1]]},${points[triangles[i + 2]]}`
            )
            .style('fill', fillColors[Math.floor(Math.random() * fillColors.length)]) // Randomly select one of the fill colors
            .style('stroke', borderColors[Math.floor(Math.random() * borderColors.length)]) // Randomly select one of the border colors
            .style('stroke-width', '2px'); // Set the stroke width
    }
});

</script>

<div id="jdg-random-delaunay" class="jdg-random-delaunay"></div>

<style>
	.jdg-random-delaunay {
		height: 100%;
		width: 100%;
    opacity: 50%;
	}
</style>
