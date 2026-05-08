<script>
	import { page } from '$app/stores';
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';

	import { showNavSidebar } from '$lib/stores/jdg-ui-store.js';

	import { setRgbaAlpha } from '$lib/index.js';
	import { convertStringToAnchorTag } from '$lib/jdg-utils.js';

	import { JDGNavItem } from '$lib/index.js';
	import { jdgColors, jdgDurations, jdgSizes } from '$lib/jdg-shared-styles.js';

	export let navItems;
	export let sideNavWidth = '250px';

	const sideNavContainerCss = css`
		width: ${sideNavWidth};
		a:before {
			background-color: transparent;
		}
		background-color: ${setRgbaAlpha(jdgColors.headerBackground, 0.7)};
	`;

	const sideNavSlideWrapperCss = css`
		width: ${sideNavWidth};
	`;

	const sideNavItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
	`;

	// set dynamically, only after the slide animation is complete
	let blurCss;

	// only apply the blur after the animation is complete
	$: if ($showNavSidebar) {
		setTimeout(() => {
			blurCss = css`
				backdrop-filter: blur(${jdgSizes.blurSizeSmall});
			`;
		}, jdgDurations.default);
	} else {
		blurCss = css``;
	}

	function navItemIsCurrent(navItem, url) {
		const raw = navItem?.href;
		if (raw == null || raw === '') return false;

		const resolved =
			raw.startsWith('#') || raw.startsWith('.') ? convertStringToAnchorTag(raw) : raw;

		if (resolved.startsWith('#')) {
			return url.hash === resolved;
		}

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
	}
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
				class="jdg-nav-sidebar-container {sideNavContainerCss} {blurCss} jdg-letter-spacing-title"
				transition:slide={{ duration: jdgDurations.default, delay: 0, axis: 'x' }}
			>
				<div class="jdg-nav-sidebar-slide-wrapper {sideNavSlideWrapperCss}">
					<nav class="jdg-nav-sidebar-item-container">
						{#each navItems as navItem, i}
							<div class="jdg-nav-sidebar-item">
								<JDGNavItem
									{navItem}
									active={navItemIsCurrent(navItem, $page.url)}
									onClickFunction={() => {
										showNavSidebar.set(!$showNavSidebar);
									}}
								/>
							</div>
						{/each}
					</nav>
				</div>
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
