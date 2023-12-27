<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { css } from '@emotion/css';

	import navItem from './schemas/nav-item.js';
	import { instantiateObject } from './jdg-utils.js';

	import { jdgColors, jdgBreakpoints, jdgSizes } from './jdg-styling-constants.js';

	export let showLogo = true;
	export let logoSrc = '/jdg-logo.jpg';
	export let logoAlt = 'Logo';
	export let logoTitle = undefined;
	export let logoAlignment = 'left';
	export let showNav = true;
	export let navItems = [];
	export let textColor = jdgColors.text;
	export let backgroundColorRgba = jdgColors.header;
	export let backgroundOpacity = '1.0';

	const headerContainerCss = css`
		@media (max-height: ${jdgBreakpoints.height[0]}) {
			padding-top: 5vh;
			padding-bottom: 5vh;
		}
		@media (min-height: ${jdgBreakpoints.height[0]}) and (max-height: ${jdgBreakpoints.height[1]}) {
			padding-top: 3vh;
			padding-bottom: 3vh;
		}
		@media (min-height: ${jdgBreakpoints.height[1]}) {
			padding-top: 2vh;
			padding-bottom: 2vh;
		}
	`;

	const headerNavContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0]}) {
			display: block;
		}
		@media (min-width: ${jdgBreakpoints.width[0]}) and (max-height: ${jdgBreakpoints.width[1]}) {
			display: flex;
		}
		@media (min-width: ${jdgBreakpoints.width[1]}) {
			display: flex;
		}
	`;
	const headerNavItemCss = css`
		color: ${jdgColors.text};
		:hover {
			color: ${jdgColors.hover};
		}
		:last-of-type {
			margin-right: 0rem;
			padding-right: 0rem;
		}
	`;

	onMount(() => {
		// show example nav items
		if (showNav && navItems.length === 0) {
			const newNavItem1 = instantiateObject(navItem);
			newNavItem1.text = 'HOME';
			newNavItem1.href = '/';

			const newNavItem2 = instantiateObject(navItem);
			newNavItem2.text = 'ABOUT';
			newNavItem2.href = '/about';

			const newNavItem3 = instantiateObject(navItem);
			newNavItem3.text = 'CONTACT';
			newNavItem3.href = '/contact';

			navItems = [newNavItem1, newNavItem2, newNavItem3];
		}
	});
</script>

<div
	class="jdg-header-container {headerContainerCss}"
	transition:fade
	style:height={jdgSizes.headerHeight}
	style:background-color={backgroundColorRgba}
	style:color={textColor}
	style:opacity={backgroundOpacity}
>
	<!-- logo -->
	{#if showLogo}
		<div class="jdg-header-logo-container" style:align-items={logoAlignment}>
			<img src={logoSrc} class="jdg-header-logo" alt={logoAlt} />
			<!-- logo title -->
			{#if logoTitle}
				<div class="jdg-header-logo-title">
					{logoTitle}
				</div>
			{/if}
		</div>
	{/if}
	<!-- navigation -->
	{#if showNav && navItems.length > 0}
		<nav class="jdg-header-nav-container {headerNavContainerCss}">
			{#each navItems as navItem, i}
				<a class="jdg-header-nav-item {headerNavItemCss}" href={navItem?.href}>{navItem?.text}</a>
			{/each}
		</nav>
	{/if}
</div>

<style>
	.jdg-header-container {
		position: fixed;
		display: flex;
		width: -moz-available;
		width: -webkit-fill-available;
		justify-content: space-between;
		z-index: 1;
		padding: 1rem 2rem 1rem 2rem;
		backdrop-filter: blur(10px);

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.jdg-header-logo-container {
		display: flex;
		align-items: baseline;
		height: 100%;
		font-family: sans-serif;
	}

	.jdg-header-logo {
		height: 100%; /* fill the header with the logo top-to-bottom */
		max-height: 5vh;
	}

	.jdg-header-logo-title {
		margin-left: 15px;
		display: inline;
		font-weight: bold;
		letter-spacing: 5px;
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
		letter-spacing: 5px;
		font-weight: bold;
		text-decoration: none;
		line-height: 0px; /* not sure why, but required to get text at bottom of div */
	}
</style>
