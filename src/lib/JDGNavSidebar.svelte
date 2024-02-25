<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';

	import uiState from './stores/uiState.js';
	import { setNavSidebarOpen } from './jdg-ui-management.js';
	import { jdgColors, jdgDurations, jdgSizes } from './jdg-styling-constants.js';

	export let navItems;

	let jdgNavSidebarContainerCss = css`
		a:before {
			background-color: transparent;
		}
		background-color: ${jdgColors.headerBackground};
		backdrop-filter: blur(${jdgSizes.blurSizeMedium});
	`;

	const jdgNavSidebarItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
	`;
</script>

{#if $uiState.isNavSidebarOpen}
	<!-- mobile nav container -->
	<div style="position: relative;">
		<div
			class="jdg-nav-sidebar-container {jdgNavSidebarContainerCss} jdg-letter-spacing-title"
			transition:slide={{ duration: jdgDurations.slide, delay: 0, axis: 'x' }}
		>
			<nav class="jdg-nav-sidebar-item-container">
				{#each navItems as navItem, i}
					<a
						class="jdg-nav-sidebar-item {jdgNavSidebarItemCss}"
						href={navItem?.href}
						on:click={() => {
							setNavSidebarOpen(false);
						}}
					>
						<div class="jdg-nav-sidebar-item {jdgNavSidebarItemCss} jdg-highlight-container">
							<span class="jdg-highlight no-initial-highlight">
								{navItem?.label}
							</span>
						</div></a
					>
				{/each}
			</nav>
		</div>
		<div class="jdg-nav-sidebar-click-overlay-alignment-container">
			<div
				class="jdg-nav-sidebar-click-overlay"
				on:click={() => {
					setNavSidebarOpen(false);
				}}
				on:keydown={() => {
					setNavSidebarOpen(false);
				}}
				role="button"
				tabindex="0"
			/>
		</div>
	</div>
{/if}

<style>
	.jdg-nav-sidebar-container {
		position: absolute;
		z-index: 2;
		right: 0;
		width: 250px;
		height: 100vh;
	}

	.jdg-nav-sidebar-item-container {
		display: flex;
		margin-top: 30px;
		gap: 30px;
		flex-direction: column;
	}

	.jdg-nav-sidebar-item {
		align-items: baseline;
		display: flex;
		justify-content: center;
		font-weight: bold;
	}

	.jdg-nav-sidebar-click-overlay-alignment-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
	}

	.jdg-nav-sidebar-click-overlay {
		position: absolute;
		z-index: 1;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
	}
</style>
