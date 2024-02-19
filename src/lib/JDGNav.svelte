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

	// nav items are an array of objects
	export let navItems = [];
	// mobile nav can be set to always on regardless of breakpoint
	export let useMobileNav = false;

	// set certain flags at certain breakpoints
	const navBreakpointHandler = () => {
		breakpointHandler(
			// breakpoint 0
			() => {
				// force the mobile nav on
				useMobileNav = true;
			},
			// breakpoint 1
			() => {},
			// breakpoint 2
			() => {
				useMobileNav = false;
			}
		);
	};

	const onClickMobileNavButton = () => (isMobileNavExpanded = !isMobileNavExpanded);

	const hideMobileNav = () => {
		isMobileNavExpanded = false;
	};

	let isMobileNavExpanded;

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

	$: {
		// needs to be recomputed when notifications show/hide
		mobileNavContainerCss = css`
			${mobileNavContainerCss}
			top: ${`${convertPixelsToVh(getDistanceToBottomOfHeader().value)}`};
			z-index: ${incrementHighestZIndex()};
		`;
	}
</script>

<!-- mobile nav -->
{#if useMobileNav}
	<button
		class="jdg-header-nav-button-mobile {mobileNavButtonCss}"
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
	<!-- desktop nav -->
{:else}
	<nav class="jdg-header-nav-container">
		{#each navItems as navItem, i}
			<a class="jdg-header-nav-item no-initial-highlight {navItemCss}" href={navItem?.href}
				>{navItem?.label}</a
			>
		{/each}
	</nav>
{/if}
<!-- mobile nav container (outside header container) -->
{#if useMobileNav && isMobileNavExpanded}
	<div
		class="jdg-header-nav-container-mobile {mobileNavContainerCss}"
		transition:slide={{ duration: jdgDurations.slide, delay: 0, axis: 'x' }}
	>
		<nav class="jdg-header-nav-item-container-mobile">
			{#each navItems as navItem, i}
				<a
					class="jdg-header-nav-item-mobile {mobileNavItemCss}"
					href={navItem?.href}
					on:click={() => {
						isMobileNavExpanded = false;
					}}
				>
					<div class="jdg-header-nav-item-mobile {mobileNavItemCss} jdg-highlight-container">
						<span class="jdg-highlight no-initial-highlight">
							{navItem?.label}
						</span>
					</div></a
				>
			{/each}
		</nav>
	</div>
	<div
		class="jdg-header-nav-mobile-click-overlay {mobileNavOverlayCss}"
		on:click={hideMobileNav}
		on:keydown={hideMobileNav}
		role="button"
		tabindex="0"
	></div>
{/if}

<style>
	a {
		letter-spacing: 5px;
		padding-left: 2.5px; /* letter-spacing adds an extra space at the end; account for this by shifting 1/2 letter spacing on left */
	}

	.jdg-header-nav-container {
		height: 100%;
		display: flex;
		float: right;
		align-items: flex-end;
		gap: 4rem;
	}

	.jdg-header-nav-item {
		align-items: baseline;
		display: flex;
		font-weight: bold;
		line-height: 0px; /* not sure why, but required to get text at bottom of div */
	}

	.jdg-header-nav-button-mobile {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		cursor: pointer;
		font-size: 35px;
		border: none;
		outline: none;
	}

	.jdg-header-nav-container-mobile {
		position: fixed;
		z-index: 2;
		right: 0;
		width: 250px;
		height: 100%;
		backdrop-filter: blur(10px);
	}

	.jdg-header-nav-item-container-mobile {
		display: flex;
		margin-top: 30px;
		gap: 30px;
		flex-direction: column;
	}

	.jdg-header-nav-item-mobile {
		align-items: baseline;
		display: flex;
		justify-content: center;
		font-weight: bold;
	}

	.jdg-header-nav-mobile-click-overlay {
		position: absolute;
		z-index: 1;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
	}
</style>
