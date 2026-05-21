<script>
	import { css } from '@emotion/css';
	import { appAccentColors, colorMode } from '$lib/stores/jdg-ui-store.js';
	import { JDGLoadingSpinner, JDGOverlay } from '$lib/index.js';

	export let isLoading = false;
	export let loadingIconSrc =
		'https://res.cloudinary.com/jdg-main/image/upload/v1718070772/jdg-ui-svelte/jdg-ui-logo_cs4ji5.jpg';
	export let loadingIconSrcDark = undefined;
	export let invertIconInDarkMode = true;
	export let loadingSpinnerColor = $appAccentColors[0];

	$: resolvedIconSrc = ($colorMode === 'dark' && loadingIconSrcDark) ? loadingIconSrcDark : loadingIconSrc;
	$: iconDarkModeCss = (invertIconInDarkMode && !loadingIconSrcDark && $colorMode === 'dark')
		? css`filter: invert(1);`
		: css``;
</script>

{#if isLoading}
	<div class="jdg-loading-overlay-container">
		<JDGOverlay showTitleBar={false} closeOnOverlayClick={false}>
			<div class="jdg-loading-overlay-flex">
				<img
				src={resolvedIconSrc}
				class="jdg-loading-overlay-icon {iconDarkModeCss}"
				class:jdg-auto-invert-dark={invertIconInDarkMode && !loadingIconSrcDark}
				alt="Loading..."
			/>
				<JDGLoadingSpinner
					strokeColor={loadingSpinnerColor}
					spinnerHeightPx={25}
					strokeWidthPx={3}
				/>
			</div>
		</JDGOverlay>
	</div>
{/if}

<style>
	.jdg-loading-overlay-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.jdg-loading-overlay-flex {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20px;
	}

	.jdg-loading-overlay-icon {
		max-height: 50px;
		object-fit: fill;
	}

	/* Static CSS inversion that works before Svelte hydration.
	   Relies on data-theme="dark" set by the inline script in app.html. */
	:global(html[data-theme='dark']) .jdg-auto-invert-dark {
		filter: invert(1);
	}
</style>
