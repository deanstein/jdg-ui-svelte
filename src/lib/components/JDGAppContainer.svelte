<script>
	import { onMount, tick } from 'svelte';
	import { css } from '@emotion/css';

	import { setAccentColors, setWindowWidth } from '$lib/jdg-state-management.js';

	import { JDGLoadingOverlay } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { convertHexToRGBA } from '$lib/jdg-utils.js';

	export let fontFamily = 'REM';
	export let appLoadingIconSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-ui-logo.jpg';
	export let accentColors = jdgColors.accentColorsJDG;

	// flag to show a loading overlay before app is loaded
	// to prevent flash of unstyled content
	let isAppLoaded = false;

	// global hyperlink style options
	const hyperlinkColorOpacity = 0.75;
	const useStripedHyperlinkHoverStyle = false;

	// app sets window width in the ui state
	// so children don't have to add event handlers
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
				${convertHexToRGBA(accentColors[0], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(accentColors[1], hyperlinkColorOpacity)} 33%,
				${convertHexToRGBA(accentColors[1], hyperlinkColorOpacity)} 66%,
				${convertHexToRGBA(accentColors[2], hyperlinkColorOpacity)} 66%
			)`
				: `${accentColors[0]}`};
		}
		a:before {
			background: ${accentColors[0]};
		}

		font-family: ${fontFamily};
	`;

	onMount(async () => {
		await tick(); // delay until layout and all children are loaded
		isAppLoaded = true;

		window.addEventListener('resize', onPageResize);
		setAccentColors(accentColors);
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
