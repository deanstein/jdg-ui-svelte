<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { doShowNavSidebar } from '../../stores/jdg-ui-store.js';

	import { getIsNavSideBarOpen } from '../../jdg-state-management.js';
	import { breakpointHandler } from '$lib/jdg-ui-management.js';

	import { JDGMenuIcon, JDGNavItem } from '../../index.js';
	import { jdgColors, jdgSizes } from '../../jdg-shared-styles.js';

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

	const onClickMobileNavButton = () => {
		const isOpen = getIsNavSideBarOpen();
		doShowNavSidebar.set(!isOpen);
	};

	let useMobileNavResult;
	let forceUseMobileNavAtBreakpoint = true;

	const mobileNavButtonJustificationContainerCss = css`
		width: calc(100vw - ${jdgSizes.headerSidePadding});
	`;

	const mobileNavButtonCss = css`
		color: ${jdgColors.text};
		background-color: transparent;
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
		useMobileNavResult = useMobileNav || forceUseMobileNavAtBreakpoint;
	}
</script>

<!-- mobile nav button -->
{#if useMobileNavResult}
	<div class="mobile-nav-button-justification-container {mobileNavButtonJustificationContainerCss}">
		<div
			role="button"
			tabindex="0"
			class="mobile-nav-button {mobileNavButtonCss}"
			on:click={onClickMobileNavButton}
			on:keypress={() => {}}
			title={$doShowNavSidebar ? 'Close menu' : 'Open menu'}
		>
			<div class="jdg-highlight-container">
				<span class="jdg-highlight no-initial-highlight" style="display: flex; z-index: 3;">
					<JDGMenuIcon />
				</span>
			</div>
		</div>
	</div>

	<!-- desktop nav -->
{:else}
	<nav class="desktop-nav-container jdg-letter-spacing-title">
		{#each navItems as navItem, i}
			<JDGNavItem {navItem} marginBottom="-3px" />
		{/each}
	</nav>
{/if}

<style>
	.desktop-nav-container {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: flex-end;
		justify-content: end;
		gap: 4rem;
	}

	.mobile-nav-button-justification-container {
		display: flex;
		height: 100%;
		justify-content: right;
		align-items: center;
	}

	.mobile-nav-button {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		cursor: pointer;
		border: none;
		outline: none;
	}
</style>
