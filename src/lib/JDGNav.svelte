<script>
	import { fade, slide } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { convertPixelsToVh } from './jdg-utils.js';
	import {
		breakpointHandler,
		getDistanceToBottomOfHeader,
		incrementHighestZIndex
	} from './jdg-ui-management.js';
	import { jdgColors, jdgDurations, jdgSizes } from './jdg-styling-constants.js';
	import { onDestroy, onMount } from 'svelte';
	import uiState from './stores/uiState.js';

	// nav items are an array of objects
	export let navItems = [];
	// mobile nav can be always on, regardless of breakpoint
	export let useMobileNav = false;

	// set certain flags at certain breakpoints
	const navBreakpointHandler = () => {
		breakpointHandler(
			// breakpoint 0
			() => {
				// force the mobile nav on
				forceUseMobileNavAtBreakpoint = true;
			},
			// breakpoint 1
			() => {
				forceUseMobileNavAtBreakpoint = true;
			},
			// breakpoint 2
			() => {
				forceUseMobileNavAtBreakpoint = false;
			}
		);
	};

	const onClickMobileNavButton = () => (isMobileNavExpanded = !isMobileNavExpanded);

	const hideMobileNav = () => {
		isMobileNavExpanded = false;
	};

	let isMobileNavExpanded;
	let useMobileNavResult;
	let forceUseMobileNavAtBreakpoint = true;

	const mobileNavButtonJustificationContainerCss = css`
		width: calc(100vw - ${jdgSizes.headerSidePadding});
	`;

	const mobileNavButtonCss = css`
		color: ${jdgColors.text};
		background-color: transparent;
	`;

	const mobileNavOverlayCss = css`
		top: ${`${convertPixelsToVh(getDistanceToBottomOfHeader().value)}`};
	`;

	let mobileNavContainerCss = css`
		a:before {
			background-color: transparent;
		}
		background-color: ${jdgColors.headerBackground};
	`;

	const navItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		:last-of-type {
			margin-right: 0rem;
			padding-right: 0rem;
		}
	`;

	const mobileNavItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
	`;

	onMount(() => {
		window.addEventListener('resize', navBreakpointHandler);
		// Call the handler once to handle the current screen size
		navBreakpointHandler();
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', navBreakpointHandler);
		}
	});

	$: {
		// needs to be recomputed when notifications show/hide
		mobileNavContainerCss = css`
			${mobileNavContainerCss}
			top: ${`${convertPixelsToVh(getDistanceToBottomOfHeader(false, false).value)}`};
			z-index: ${incrementHighestZIndex()};
		`;

		useMobileNavResult = useMobileNav || forceUseMobileNavAtBreakpoint;
	}
</script>

<!-- mobile nav container (outside header container) -->
{#if useMobileNavResult && isMobileNavExpanded}
	<div
		class="mobile-nav-container {mobileNavContainerCss}"
		transition:slide={{ duration: jdgDurations.slide, delay: 0, axis: 'x' }}
	>
		<nav class="mobile-nav-item-container">
			{#each navItems as navItem, i}
				<a
					class="mobile-nav-item {mobileNavItemCss}"
					href={navItem?.href}
					on:click={() => {
						isMobileNavExpanded = false;
					}}
				>
					<div class="mobile-nav-item {mobileNavItemCss} jdg-highlight-container">
						<span class="jdg-highlight no-initial-highlight">
							{navItem?.label}
						</span>
					</div></a
				>
			{/each}
		</nav>
	</div>
	<div class="mobile-nav-click-overlay-alignment-container">
		<div
			class="mobile-nav-click-overlay {mobileNavOverlayCss}"
			on:click={hideMobileNav}
			on:keydown={hideMobileNav}
			role="button"
			tabindex="0"
		/>
	</div>
{/if}
<!-- mobile nav -->
{#if useMobileNavResult}
	<div class="mobile-nav-button-justification-container {mobileNavButtonJustificationContainerCss}">
		<button
			class="mobile-nav-button {mobileNavButtonCss}"
			on:click={onClickMobileNavButton}
			on:keydown={onClickMobileNavButton}
			title={isMobileNavExpanded ? 'Close menu' : 'Open menu'}
		>
			<div class="jdg-highlight-container">
				<span class="jdg-highlight {isMobileNavExpanded ? '' : 'no-initial-highlight'}">
					<i
						class={isMobileNavExpanded ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}
						transition:fade={{ duration: 200 }}
					/>
				</span>
			</div>
		</button>
	</div>

	<!-- desktop nav -->
{:else}
	<nav class="desktop-nav-container">
		{#each navItems as navItem, i}
			<a class="desktop-nav-item no-initial-highlight {navItemCss}" href={navItem?.href}
				>{navItem?.label}</a
			>
		{/each}
	</nav>
{/if}

<style>
	a {
		letter-spacing: 5px;
		padding-left: 2.5px; /* letter-spacing adds an extra space at the end; account for this by shifting 1/2 letter spacing on left */
	}

	.desktop-nav-container {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: flex-end;
		justify-content: end;
		gap: 4rem;
	}

	.desktop-nav-item {
		align-items: baseline;
		display: flex;
		font-weight: bold;
		line-height: 0px; /* not sure why, but required to get text at bottom of div */
	}

	.mobile-nav-click-overlay-alignment-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}

	.mobile-nav-button-justification-container {
		display: flex;
		justify-content: right;
		align-items: center;
	}

	.mobile-nav-button {
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		cursor: pointer;
		font-size: 35px;
		border: none;
		outline: none;
	}

	.mobile-nav-container {
		position: fixed;
		z-index: 2;
		right: 0;
		width: 250px;
		height: 100vh;
		backdrop-filter: blur(10px);
	}

	.mobile-nav-item-container {
		display: flex;
		margin-top: 30px;
		gap: 30px;
		flex-direction: column;
	}

	.mobile-nav-item {
		align-items: baseline;
		display: flex;
		justify-content: center;
		font-weight: bold;
	}

	.mobile-nav-click-overlay {
		position: absolute;
		z-index: 1;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
	}
</style>
