<script>
	import { css } from '@emotion/css';
	import { fly } from 'svelte/transition';

	import {
		jdgColors,
		jdgBoxShadowStandard,
		jdgBreakpoints,
		jdgSizes
	} from '$lib/jdg-shared-styles.js';

	import JDGButton from '$lib/components/Input/JDGButton.svelte';

	// Font Awesome icon class (e.g., 'fa-gear', 'fa-sliders')
	export let faIcon = 'fa-gear';
	export let faClass = 'fa-solid fa-fw';
	// Button styling
	export let buttonFontSize = '0.9rem';
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
	let buttonWrapperRef;

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
			buttonWrapperRef &&
			!flyoutRef.contains(event.target) &&
			!buttonWrapperRef.contains(event.target)
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

	// Explicit square wrapper to bypass aspect-ratio issues on mobile
	// Size = icon (approx 1em based on fontSize) + padding on both sides
	$: buttonWrapperCss = css`
		width: calc(${buttonFontSize} + ${buttonPadding} * 2);
		height: calc(${buttonFontSize} + ${buttonPadding} * 2);
	`;
</script>

<div class="jdg-flyout-container">
	<div bind:this={buttonWrapperRef} class="jdg-flyout-button-wrapper {buttonWrapperCss}">
		<JDGButton
			label={null}
			{faIcon}
			{faClass}
			onClickFunction={toggleFlyout}
			backgroundColor={buttonBackgroundColor}
			textColor={buttonTextColor}
			fontSize={buttonFontSize}
			paddingTopBottom="0"
			paddingLeftRight="0"
			width="100%"
			borderRadius="50%"
			{tooltip}
		/>
	</div>

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
		align-items: center;
		align-self: flex-start; /* Prevent stretching in flex parents */
		width: fit-content; /* Ensure container sizes to content */
	}

	.jdg-flyout-button-wrapper {
		display: flex;
		flex-shrink: 0;
		border-radius: 50%;
		overflow: hidden;
	}

	/* Ensure button fills the wrapper */
	.jdg-flyout-button-wrapper :global(button) {
		height: 100%;
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
		gap: 10px;
	}
</style>
