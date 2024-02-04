<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { Delaunay } from 'd3-delaunay';
  
    export let numberOfPoints = 50;
    export let color1 = "#ccc";
    export let color2 = "#eee";
    export let color3 = "#fff";
  
    onMount(() => {
      const svg = d3.select("#container").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
  
      // Generate random points
      const pixelRatio = window.devicePixelRatio || 1;
      let points = d3.range(numberOfPoints).map(() => ({x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight}));
  
      // Create a force simulation and add forces to it
      const simulation = d3.forceSimulation(points)
        .force('x', d3.forceX().strength(0.02)) // Push nodes towards the center
        .force('y', d3.forceY().strength(0.02)) // Push nodes towards the center
        .force('collide', d3.forceCollide(20)); // Prevent nodes from overlapping
  
      // Run the simulation for a set number of iterations
      for (let i = 0; i < 120; ++i) simulation.tick();
  
      // Create Delaunay triangulation
      const delaunay = Delaunay.from(points.map(d => [d.x, d.y]));
      const triangles = delaunay.triangles;
  
      // Draw triangles
      for(let i = 0; i < triangles.length; i += 3) {
        svg.append('polygon')
          .attr('points', `${points[triangles[i]].x},${points[triangles[i]].y} ${points[triangles[i+1]].x},${points[triangles[i+1]].y} ${points[triangles[i+2]].x},${points[triangles[i+2]].y}`)
          .style('fill', [color1, color2, color3][Math.floor(Math.random() * 3)]); // Randomly select one of the prop colors
      }
    });
  </script>
  
  <div id="container"></div>
  
  <style>
  /* Add your styles here */
  </style>
  