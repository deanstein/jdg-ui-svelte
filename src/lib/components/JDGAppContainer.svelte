<script>
	import { onMount, tick } from 'svelte';
	import { css } from '@emotion/css';

	import { setWindowWidth } from '$lib/jdg-ui-management.js';

	import { JDGLoadingOverlay } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { convertHexToRGBA } from '$lib/jdg-utils.js';

	export let fontFamily = 'REM';
	export let appLoadingIconSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-ui-logo.jpg';

	// flag to show a loading overlay before app is loaded
	// to prevent flash of unstyled content
	let isAppLoaded = false;

	// global hyperlink style options
	const hyperlinkColorOpacity = 0.75;
	const useStripedHyperlinkHoverStyle = false;

	// app sets window width in the ui state
	//  so children don't have to add event handlers
	const onPageResize = () => {
		setWindowWidth(window.innerWidth);
	};

	// global styles, but using emotion css
	const appContainerCss = css`
		a {
			color: ${jdgColors.text};
		}
		a.no-initial-highlight::before,
		.jdg-highlight-container .jdg-highlight::before {
			background: ${useStripedHyperlinkHoverStyle
				? `linear-gradient(
				to bottom,
				${convertHexToRGBA(jdgColors.accentStripesJDG[0], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[1], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[1], hyperlinkColorOpacity)} 66%,
				${convertHexToRGBA(jdgColors.accentStripesJDG[2], hyperlinkColorOpacity)} 66%
			)`
				: `${jdgColors.accentStripesJDG[0]}`};
		}
		a:before {
			background: ${jdgColors.accentStripesJDG[0]};
		}

		font-family: ${fontFamily};
	`;

	onMount(async () => {
		await tick(); // delay until layout and all children are loaded
		isAppLoaded = true;

		window.addEventListener('resize', onPageResize);
	});
</script>

<div class="jdg-app-container {appContainerCss}">
	<!-- loading overlay - only shown before layout is fully loaded -->
	<JDGLoadingOverlay isLoading={!isAppLoaded} loadingIconSrc={appLoadingIconSrc} />
	{#if isAppLoaded}
		<slot />
	{/if}
</div>

<style>
	.jdg-app-container {
		display: flex;
		flex-direction: column;
	}
</style>
