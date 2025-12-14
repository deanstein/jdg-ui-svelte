<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';

	import { showNavSidebar } from '$lib/stores/jdg-ui-store.js';

	import { setRgbaAlpha } from '$lib/index.js';

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
		height: 100svh;
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
		height: 100svh;
	}
</style>
