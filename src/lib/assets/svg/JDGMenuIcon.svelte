<script>
	import { css } from '@emotion/css';

	import { doShowNavSidebar } from '$lib/stores/jdg-ui-store.js';

	import { jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';

	let isOpen;

	const mobileNavImageCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.navMobileIconHeightSm};
			width: ${jdgSizes.navMobileIconHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			height: ${jdgSizes.navMobileIconHeightLg};
			width: ${jdgSizes.navMobileIconHeightLg};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.navMobileIconHeightLg};
			width: ${jdgSizes.navMobileIconHeightLg};
		}
	`;

	$: {
		isOpen = $doShowNavSidebar;
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
		transition: all 0.3s ease-in-out;
		will-change: transform;
	}
</style>
