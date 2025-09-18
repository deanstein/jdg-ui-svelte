import { cubicOut, quintOut } from 'svelte/easing';
import { crossfade, fade, scale } from 'svelte/transition';

import { parseRgba } from './jdg-utils.js';

export const generateGradient = (steps, colorString1, colorString2, colorString3) => {
	const startColor = parseRgba(colorString1);
	const midColor = parseRgba(colorString2);
	const endColor = colorString3 ? parseRgba(colorString3) : midColor;
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
