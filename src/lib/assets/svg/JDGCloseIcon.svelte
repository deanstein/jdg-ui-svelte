<script>
	import { css } from '@emotion/css';

	import { jdgSizes } from '$lib/jdg-shared-styles.js';

	const imgCss = css`
		height: ${jdgSizes.navMobileIconHeightSm};
		width: ${jdgSizes.navMobileIconHeightSm};
	`;
</script>

<div class={imgCss}>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
		<rect
			class="bar"
			y="15%"
			height="13%"
			width="100%"
			transform="rotate(45, 0, 0) translate(25, -25)"
			fill="black"
		/>
		<rect
			class="bar"
			y="71%"
			height="13%"
			width="100%"
			transform="rotate(-45, 50, 50) translate(0, -25)"
			fill="black"
		/>
	</svg>
</div>
