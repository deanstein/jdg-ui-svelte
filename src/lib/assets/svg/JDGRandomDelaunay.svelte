<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import * as d3 from 'd3';
	import { Delaunay } from 'd3-delaunay';

	import { getThemePalette } from '$lib/jdg-shared-styles.js';
	import { generateGradient } from '$lib/jdg-graphics-factory.js';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { colorMode } from '$lib/stores/jdg-ui-store.js';

	export let numberOfPoints = 8;
	export let edgeBufferRatio = 0.25;
	export let drawBorders = true;
	export let borderColorsHex = undefined;
	export let heightMultiplier = 1;

	let containerRef;
	let hasMounted = false;

	function drawDelaunay() {
		if (!containerRef) return;

		d3.select(containerRef).selectAll('svg').remove();

		const palette = getThemePalette(get(colorMode));
		const isDark = get(colorMode) === 'dark';

		const svg = d3
			.select(containerRef)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('preserveAspectRatio', 'xMidYMid slice')
			.attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);

		let points = d3.range(numberOfPoints).map(() => {
			const widthBuffer = window.innerWidth * edgeBufferRatio;
			const heightBuffer = window.innerHeight * heightMultiplier * edgeBufferRatio;
			return [
				d3.randomUniform(widthBuffer, window.innerWidth - widthBuffer)(),
				d3.randomUniform(heightBuffer, window.innerHeight * heightMultiplier - heightBuffer)()
			];
		});

		points.push([0, 0]);
		points.push([window.innerWidth, 0]);
		points.push([0, window.innerHeight * heightMultiplier]);
		points.push([window.innerWidth, window.innerHeight * heightMultiplier]);

		for (let i = 1; i < 4; i++) {
			points.push([(i * window.innerWidth) / 4, 0]);
			points.push([(i * window.innerWidth) / 4, window.innerHeight * heightMultiplier]);
			points.push([0, (i * window.innerHeight * heightMultiplier) / 4]);
			points.push([window.innerWidth, (i * window.innerHeight * heightMultiplier) / 4]);
		}

		const delaunay = Delaunay.from(points);
		const triangles = delaunay.triangles;

		const fillColors = generateGradient(
			triangles.length,
			palette.backgroundFillRange0,
			palette.backgroundFillRange1,
			palette.backgroundFillRange2
		);

		const effectiveBorderColors =
			borderColorsHex ?? (isDark ? ['#555555FF'] : ['#C3C3C3FF']);
		if (drawBorders) {
			effectiveBorderColors ?? getAccentColors();
		}

		for (let i = 0; i < triangles.length; i += 3) {
			const colorIndex = Math.floor(Math.random() * fillColors.length);
			const fillColor = fillColors.splice(colorIndex, 1)[0];

			let polygon = svg
				.append('polygon')
				.attr(
					'points',
					`${points[triangles[i]]},${points[triangles[i + 1]]},${points[triangles[i + 2]]}`
				)
				.style('fill', fillColor);

			if (drawBorders) {
				polygon
					.style(
						'stroke',
						effectiveBorderColors[Math.floor(Math.random() * effectiveBorderColors.length)]
					)
					.style('stroke-width', '2px');
			}
		}
	}

	onMount(() => {
		hasMounted = true;
		drawDelaunay();
	});

	// Redraw when color mode changes after initial mount
	$: if (hasMounted && $colorMode) {
		drawDelaunay();
	}
</script>

<div bind:this={containerRef} class="jdg-random-delaunay"></div>

<style>
	.jdg-random-delaunay {
		height: 150%;
		width: 100%;
		opacity: 50%;
	}
</style>
