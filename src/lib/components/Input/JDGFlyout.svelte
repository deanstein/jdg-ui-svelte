<script>
	import { css } from '@emotion/css';
	import { fly } from 'svelte/transition';

	import {
		jdgColors,
		jdgBoxShadowStandard,
		jdgBreakpoints,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';
	import { darkenColor } from '$lib/jdg-utils.js';

	// Font Awesome icon class (e.g., 'fa-gear', 'fa-sliders')
	export let faIcon = 'fa-gear';
	export let faClass = 'fa-solid fa-fw';
	// Button styling
	export let buttonSize = '1.5rem';
	export let buttonPadding = '0.4rem';
	export let buttonBackgroundColor = jdgColors.activeSecondary;
	export let buttonTextColor = jdgColors.textDm;
	export let tooltip = '';
	// Flyout styling
	export let flyoutBackgroundColor = 'rgba(255, 255, 255, 0.95)';
	export let flyoutBorderRadius = '8px';
	export let flyoutPadding = '0.75rem';
	// Position: where the flyout appears relative to button
	export let flyoutPosition = 'bottom-left'; // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
	// Optional title for the flyout
	export let flyoutTitle = '';

	let isOpen = false;
	let flyoutRef;
	let buttonRef;

	const toggleFlyout = () => {
		isOpen = !isOpen;
	};

	const closeFlyout = () => {
		isOpen = false;
	};

	// Close flyout when clicking outside
	const handleClickOutside = (event) => {
		if (
			flyoutRef &&
			buttonRef &&
			!flyoutRef.contains(event.target) &&
			!buttonRef.contains(event.target)
		) {
			closeFlyout();
		}
	};

	// Close on Escape key
	const handleKeydown = (event) => {
		if (event.key === 'Escape' && isOpen) {
			closeFlyout();
		}
	};

	$: if (typeof window !== 'undefined') {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}
	}

	// Compute hover color
	$: buttonBackgroundColorHover = darkenColor(buttonBackgroundColor, 0.15);

	// Dynamic button styles
	$: buttonCss = css`
		width: ${buttonSize};
		height: ${buttonSize};
		padding: ${buttonPadding};
		background-color: ${buttonBackgroundColor};
		color: ${buttonTextColor};
		:hover {
			background-color: ${buttonBackgroundColorHover};
		}
	`;

	// Dynamic flyout position styles
	$: flyoutPositionCss = css`
		${flyoutPosition.includes('bottom') ? 'top: calc(100% + 4px);' : 'bottom: calc(100% + 4px);'}
		${flyoutPosition.includes('left') ? 'right: 0;' : 'left: 0;'}
	`;

	// Dynamic flyout styles
	$: flyoutCss = css`
		color: ${jdgColors.text};
		background-color: ${flyoutBackgroundColor};
		border-radius: ${flyoutBorderRadius};
		padding: ${flyoutPadding};
	`;

	// Responsive font sizing
	const flyoutContentCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyXSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodySm};
		}
	`;
</script>

<div class="jdg-flyout-container">
	<button
		bind:this={buttonRef}
		type="button"
		class="jdg-flyout-button {buttonCss}"
		on:click|stopPropagation={toggleFlyout}
		title={tooltip}
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<i class="{faClass} {faIcon}" />
	</button>

	{#if isOpen}
		<div
			bind:this={flyoutRef}
			class="jdg-flyout-panel {flyoutCss} {flyoutPositionCss} {jdgBoxShadowStandard}"
			transition:fly={{ y: flyoutPosition.includes('bottom') ? -8 : 8, duration: 200 }}
			role="menu"
		>
			{#if flyoutTitle}
				<div class="jdg-flyout-title">{flyoutTitle}</div>
			{/if}
			<div class="jdg-flyout-content {flyoutContentCss}">
				<slot />
			</div>
		</div>
	{/if}
</div>

<style>
	.jdg-flyout-container {
		position: relative;
		display: inline-flex;
	}

	.jdg-flyout-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.jdg-flyout-panel {
		position: absolute;
		z-index: 100;
		min-width: max-content;
		backdrop-filter: blur(8px);
	}

	.jdg-flyout-title {
		font-weight: bold;
		margin-bottom: 0.5rem;
		padding-bottom: 0.4rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		white-space: nowrap;
	}

	.jdg-flyout-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
