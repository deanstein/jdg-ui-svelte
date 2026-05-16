<script>
	import { page } from '$app/stores';
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';

	import {
		colorMode,
		isScrolling,
		isScrollingToAnchorTag,
		showNavSidebar,
		windowScrollPosition
	} from '$lib/stores/jdg-ui-store.js';

	import { setRgbaAlpha } from '$lib/index.js';
	import { convertStringToAnchorTag } from '$lib/jdg-utils.js';

	import { JDGNavItem } from '$lib/index.js';
	import JDGColorModeToggle from '../JDGColorModeToggle.svelte';
	import { jdgDurations, jdgSizes, getThemePalette } from '$lib/jdg-shared-styles.js';

	export let navItems;
	export let sideNavWidth = '250px';
	export let showColorModeToggle = false;

	$: palette = getThemePalette($colorMode);

	let sideNavContainerCss;
	$: sideNavContainerCss = css`
		width: ${sideNavWidth};
		a:before {
			background-color: transparent;
		}
		background-color: ${setRgbaAlpha(palette.headerBackground, 0.7)};
	`;

	const sideNavSlideWrapperCss = css`
		width: ${sideNavWidth};
	`;

	const sideNavItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
	`;

	let containerEl;
	let toggleBottomPx = parseInt(jdgSizes.headerHeightLg);

	$: toggleBottomCss = css`
		position: absolute;
		bottom: calc(${toggleBottomPx}px + 2rem);
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
	`;

	// set dynamically, only after the slide animation is complete
	let blurCss;

	$: if ($showNavSidebar) {
		setTimeout(() => {
			blurCss = css`
				backdrop-filter: blur(${jdgSizes.blurSizeSmall});
			`;
		}, jdgDurations.default);
	} else {
		blurCss = css``;
	}

	// recalculate toggle offset whenever sidebar is open and scroll position changes
	$: if ($showNavSidebar && containerEl) {
		// reference $windowScrollPosition to re-run on scroll
		void $windowScrollPosition;
		toggleBottomPx = containerEl.getBoundingClientRect().top;
	}

	// tracks which anchor nav item was last clicked;
	// cleared on the next user-initiated scroll
	let clickedAnchorHref = null;

	$: if ($isScrolling && !$isScrollingToAnchorTag && clickedAnchorHref) {
		clickedAnchorHref = null;
	}

	const resolveHref = (navItem) => {
		const raw = navItem?.href;
		if (raw == null || raw === '') return '';
		return raw.startsWith('#') || raw.startsWith('.') ? convertStringToAnchorTag(raw) : raw;
	};

	const navItemIsCurrent = (navItem, url, activeAnchor) => {
		const resolved = resolveHref(navItem);
		if (!resolved) return false;

		// if an anchor was recently clicked, only highlight that item
		if (activeAnchor) {
			return resolved === activeAnchor;
		}

		// otherwise, skip anchor links entirely
		if (resolved.includes('#')) return false;

		let pathToCompare = resolved;
		try {
			if (/^https?:\/\//i.test(resolved)) {
				const linkUrl = new URL(resolved);
				if (linkUrl.origin !== url.origin) return false;
				pathToCompare = linkUrl.pathname;
			}
		} catch {
			return false;
		}

		const norm = (p) => {
			const s = p.split('#')[0].split('?')[0];
			return s.replace(/\/$/, '') || '/';
		};

		return norm(url.pathname) === norm(pathToCompare);
	};

	const onNavItemClick = (navItem) => {
		const resolved = resolveHref(navItem);
		clickedAnchorHref = resolved.includes('#') ? resolved : null;
		showNavSidebar.set(!$showNavSidebar);
	};
</script>

{#if $showNavSidebar}
	<div class="jdg-nav-sidebar-layout">
		<div class="jdg-nav-sidebar-alignment-container">
			<div
				class="jdg-nav-sidebar-click-overlay"
				on:click={() => {
					showNavSidebar.set(false);
				}}
				on:keypress={() => {
					() => {};
				}}
				role="button"
				tabindex="0"
			/>
			<div
				bind:this={containerEl}
				class="jdg-nav-sidebar-container {sideNavContainerCss} {blurCss} jdg-letter-spacing-title"
				transition:slide={{ duration: jdgDurations.default, delay: 0, axis: 'x' }}
			>
				<div class="jdg-nav-sidebar-slide-wrapper {sideNavSlideWrapperCss}">
					<nav class="jdg-nav-sidebar-item-container">
						{#each navItems as navItem, i}
							<div class="jdg-nav-sidebar-item">
								<JDGNavItem
									{navItem}
									active={navItemIsCurrent(navItem, $page.url, clickedAnchorHref)}
									onClickFunction={() => onNavItemClick(navItem)}
								/>
							</div>
						{/each}
					</nav>
				</div>
				{#if showColorModeToggle}
					<div class={toggleBottomCss}>
						<JDGColorModeToggle fontSize="1.25rem" />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.jdg-nav-sidebar-layout {
		position: relative;
	}

	.jdg-nav-sidebar-alignment-container {
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
	}

	.jdg-nav-sidebar-container {
		position: relative;
		height: 100vh;
		z-index: -1;
	}

	.jdg-nav-sidebar-item-container {
		display: flex;
		padding: 15px;
		margin-top: 30px;
		gap: 30px;
		flex-direction: column;
		text-align: center;
	}

	.jdg-nav-sidebar-item {
		align-items: baseline;
		display: flex;
		justify-content: center;
		font-weight: bold;
	}

	.jdg-nav-sidebar-click-overlay {
		flex-grow: 1;
		height: 100vh;
	}

</style>
