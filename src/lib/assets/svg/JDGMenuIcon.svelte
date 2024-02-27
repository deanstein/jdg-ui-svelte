<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	import { jdgSizes } from '$lib/jdg-styling-constants.js';

	let isOpen;

	const mobileNavImageCss = css`
		height: ${jdgSizes.navMobileIconHeight};
		width: ${jdgSizes.navMobileIconHeight};
	`;

	$: {
		isOpen = $uiState.isNavSidebarOpen;
	}
</script>

<div class={mobileNavImageCss}>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
		<rect
			class="bar"
			y="15%"
			height="13%"
			width="100%"
			transform={isOpen ? 'rotate(45, 0, 0) translate(25, -25)' : ''}
		/>
		<rect
			class="bar"
			y="43%"
			height="13%"
			width="100%"
			transform={isOpen ? 'translate(0, 100)' : ''}
		/>
		<rect
			class="bar"
			y="71%"
			height="13%"
			width="100%"
			transform={isOpen ? 'rotate(-45, 50, 50) translate(0, -25)' : ''}
		/>
	</svg>
</div>

<style>
	.bar {
		transition: transform 0.3s ease-in-out;
	}
</style>
