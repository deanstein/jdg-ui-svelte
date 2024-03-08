<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';

	import uiState from '../states/ui-state.js';
	import { setNavSidebarOpen } from '../jdg-ui-management.js';
	import { jdgColors, jdgDurations, jdgSizes } from '../jdg-styling-constants.js';

	export let navItems;

	let jdgNavSidebarContainerCss = css`
		a:before {
			background-color: transparent;
		}
		background-color: ${jdgColors.headerBackground};
	`;

	const jdgNavSidebarItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
	`;

	// set dynamically, only after the slide animation is complete
	let blurCss;

	// only apply the blur after the animation is complete
	$: if ($uiState.isNavSidebarOpen) {
		setTimeout(() => {
			blurCss = css`
				backdrop-filter: blur(${jdgSizes.blurSizeSmall});
			`;
		}, jdgDurations.default);
	} else {
		blurCss = css``;
	}
</script>

{#if $uiState.isNavSidebarOpen}
	<!-- mobile nav container -->
	<div class="jdg-nav-sidebar-layout">
		<div class="jdg-nav-sidebar-alignment-container">
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
			<div
				class="jdg-nav-sidebar-container {jdgNavSidebarContainerCss} {blurCss} jdg-letter-spacing-title"
				transition:slide={{ duration: jdgDurations.default, delay: 0, axis: 'x' }}
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
		width: 250px;
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
