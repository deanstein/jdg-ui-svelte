<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { Delaunay } from 'd3-delaunay';
  
    // Default colors
    export let color1 = "#ccc";
    export let color2 = "#eee";
    export let color3 = "#fff";
  
    onMount(() => {
      const svg = d3.select("#container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
  
      // Generate random points
      const points = d3.range(200).map(() => [Math.random() * window.innerWidth, Math.random() * window.innerHeight]);
  
      // Create Delaunay triangulation
      const delaunay = Delaunay.from(points);
      const triangles = delaunay.triangles;
  
      // Draw triangles
      for(let i = 0; i < triangles.length; i += 3) {
        svg.append('polygon')
          .attr('points', `${points[triangles[i]]},${points[triangles[i+1]]},${points[triangles[i+2]]}`)
          .style('fill', [color1, color2, color3][Math.floor(Math.random() * 3)]); // Randomly select one of the prop colors
      }
    });
  </script>
  
  <div id="container"></div>
  
  <style>
  /* Add your styles here */
  </style>
  