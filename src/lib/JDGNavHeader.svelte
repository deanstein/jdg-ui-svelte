<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import {
		breakpointHandler,
		getIsNavSideBarOpen,
		setNavSidebarOpen
	} from './jdg-ui-management.js';
	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';

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
		setNavSidebarOpen(!isOpen);
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

	const navItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		:last-of-type {
			margin-right: 0rem;
			padding-right: 0rem;
		}
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
		font-size: 35px;
		border: none;
		outline: none;
		padding: 0;
		margin: 0;
	}
</style>
