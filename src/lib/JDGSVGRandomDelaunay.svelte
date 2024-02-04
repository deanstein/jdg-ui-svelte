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

    // Define a buffer to prevent points from being too close to the edges
    const buffer = 50;

    // Generate evenly distributed points
    let points = d3.range(numberOfPoints).map(() => {
        return [
            d3.randomUniform(buffer, window.innerWidth - buffer)(),
            d3.randomUniform(buffer, window.innerHeight - buffer)()
        ];
    });

    // Create Delaunay triangulation
    const delaunay = Delaunay.from(points);

    // Create Voronoi diagram
    const voronoi = delaunay.voronoi([0, 0, window.innerWidth, window.innerHeight]);

    // Define fill colors
    const fillColors = [fillColor1, fillColor2, fillColor3];

    // Draw Voronoi cells
    svg.selectAll('path')
        .data(voronoi.cellPolygons())
        .join('path')
        .attr('d', d => `M${d.join('L')}Z`)
        .style('fill', () => fillColors[Math.floor(Math.random() * fillColors.length)]) // Randomly select one of the fill colors
        .style('stroke', '#fff'); // Add a stroke to the Voronoi cells for visibility
});

</script>

<div id="jdg-random-delaunay" class="jdg-random-delaunay"></div>

<style>
	.jdg-random-delaunay {
		height: 100%;
		width: 100%;
	}
</style>
