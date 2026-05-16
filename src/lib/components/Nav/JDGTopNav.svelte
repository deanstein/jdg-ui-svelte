<script>
	import { onDestroy, onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { showNavSidebar } from '$lib/stores/jdg-ui-store.js';

	import { getIsNavSideBarOpen } from '$lib/jdg-state-management.js';
	import { breakpointHandler } from '$lib/jdg-ui-management.js';

	import { JDGMenuIcon, JDGNavItem } from '$lib/index.js';
	import JDGColorModeToggle from '../JDGColorModeToggle.svelte';
	import { jdgSizes, themeColors } from '$lib/jdg-shared-styles.js';

	// nav items are an array of objects
	export let navItems = [];
	// mobile nav can be always on, regardless of breakpoint
	export let useMobileNav = false;
	// max visible nav items in desktop mode before showing overflow trigger
	export let maxVisibleNavItems = 3;
	export let showColorModeToggle = false;

	$: visibleNavItems =
		navItems.length > maxVisibleNavItems ? navItems.slice(0, maxVisibleNavItems) : navItems;
	$: hasOverflow = navItems.length > maxVisibleNavItems;

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
		showNavSidebar.set(!isOpen);
	};

	const onClickOverflow = () => {
		showNavSidebar.set(true);
	};

	let useMobileNavResult;
	let forceUseMobileNavAtBreakpoint = true;

	const mobileNavButtonJustificationContainerCss = css`
		width: calc(100vw - ${jdgSizes.headerSidePadding});
	`;

	let mobileNavButtonCss = css``;
	$: mobileNavButtonCss = css`
		color: ${$themeColors.text};
		background-color: transparent;
	`;

	const overflowButtonCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		letter-spacing: 5px;
		padding-left: 2.5px;
		margin-bottom: -3px;
	`;

	let overflowButtonColorCss = css``;
	$: overflowButtonColorCss = css`
		color: ${$themeColors.text};
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
			title={$showNavSidebar ? 'Close menu' : 'Open menu'}
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
		{#each visibleNavItems as navItem, i}
			<JDGNavItem {navItem} marginBottom="-3px" />
		{/each}
		{#if hasOverflow}
			<div
				role="button"
				tabindex="0"
				class="overflow-button {overflowButtonCss} {overflowButtonColorCss}"
				on:click={onClickOverflow}
				on:keypress={() => {}}
				title="More pages"
			>
				<div class="jdg-highlight-container">
					<span class="jdg-highlight no-initial-highlight">...</span>
				</div>
			</div>
		{/if}
		{#if showColorModeToggle}
			<div class="desktop-nav-color-toggle">
				<JDGColorModeToggle />
			</div>
		{/if}
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

	.overflow-button {
		display: flex;
		align-items: flex-end;
		cursor: pointer;
		font-weight: bold;
		background: none;
		border: none;
		outline: none;
		padding: 0;
	}

	.desktop-nav-color-toggle {
		display: flex;
		align-items: center;
		margin-bottom: -3px;
		position: relative;
		z-index: 4;
	}
</style>
