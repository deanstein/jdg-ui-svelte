import { cubicOut, quintOut } from 'svelte/easing';
import { crossfade, fade, scale } from 'svelte/transition';

import { parseRgba, hexToRgb } from './jdg-utils.js';

// Helper function to parse color strings (hex or rgba) into [r, g, b, a] array
const parseColor = (colorString) => {
	if (!colorString) return null;

	// Check if it's a hex color
	if (typeof colorString === 'string' && colorString.startsWith('#')) {
		const hexRgb = hexToRgb(colorString);
		if (hexRgb) {
			return [hexRgb.r, hexRgb.g, hexRgb.b, hexRgb.a !== undefined ? hexRgb.a : 1];
		}
	}

	// Try parsing as rgba/rgb
	const rgba = parseRgba(colorString);
	if (rgba) {
		return rgba;
	}

	return null;
};

export const generateGradient = (steps, colorString1, colorString2, colorString3) => {
	const startColor = parseColor(colorString1);
	const midColor = parseColor(colorString2);
	const endColor = colorString3 ? parseColor(colorString3) : midColor;

	// Validate that colors were parsed successfully
	if (!startColor || !midColor || !endColor) {
		console.error('Failed to parse color strings:', { colorString1, colorString2, colorString3 });
		return [];
	}

	const colors = [];
	const halfSteps = Math.floor(steps / 2);

	for (let i = 0; i < halfSteps; i++) {
		const r = startColor[0] + ((midColor[0] - startColor[0]) / halfSteps) * i;
		const g = startColor[1] + ((midColor[1] - startColor[1]) / halfSteps) * i;
		const b = startColor[2] + ((midColor[2] - startColor[2]) / halfSteps) * i;
		const a = startColor[3] + ((midColor[3] - startColor[3]) / halfSteps) * i;
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	for (let i = halfSteps; i < steps; i++) {
		const r = midColor[0] + ((endColor[0] - midColor[0]) / halfSteps) * (i - halfSteps);
		const g = midColor[1] + ((endColor[1] - midColor[1]) / halfSteps) * (i - halfSteps);
		const b = midColor[2] + ((endColor[2] - midColor[2]) / halfSteps) * (i - halfSteps);
		const a = midColor[3] + ((endColor[3] - midColor[3]) / halfSteps) * (i - halfSteps);
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	return colors;
};

export const drawCrossfade = (duration) => {
	return crossfade({
		duration: duration ? duration : (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: duration,
				easing: quintOut,
				css: (t) => `
			transform: ${transform} scale(${t});
			opacity: ${t}
		  `
			};
		}
	});
};

export const fadeAndScale = (node, { delay = 0, duration = 300 }) => {
	return {
		delay,
		duration,
		css: (t, u) => `
	opacity: ${fade(node, { duration }).css(t, u)};
	transform: ${scale(node, { duration }).css(t, u)};
  `,
		easing: cubicOut
	};
};

export const verticalSlide = (node, { delay = 0, duration = 300 }) => {
	return {
		delay,
		duration,
		css: (t) => `transform: translateY(${(1 - t) * 100}%);`,
		easing: cubicOut
	};
};
