<script>
	import { css } from '@emotion/css';
	import { fade } from 'svelte/transition';
	import { getHighestZIndex } from '../jdg-ui-management.js';
	import { jdgDurations, jdgSizes } from '../jdg-styling-constants.js';

	export let opacity = 0.5;
	export let color = 'white';

	const overlayCss = css`
		z-index: ${getHighestZIndex()};
		background-color: ${color};
		opacity: ${opacity};
		backdrop-filter: blur(${jdgSizes.blurSizeMedium});
	`;
</script>

<div
	transition:fade={{ duration: jdgDurations.transitionDuration }}
	class="jdg-overlay {overlayCss}"
>
	<slot />
</div>

<style>
	.jdg-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
