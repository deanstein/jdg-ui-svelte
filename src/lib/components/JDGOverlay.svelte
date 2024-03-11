<script>
	import { css } from '@emotion/css';
	import { fade } from 'svelte/transition';

	import { getHighestZIndex } from '../jdg-ui-management.js';

	import { JDGCloseIcon } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgDurations, jdgSizes } from '../jdg-styling-constants.js';

	export let colorRgba = 'rgba(255, 255, 255, 1.0)';
	export let showTitleBar = true;
	export let onCloseFunction = () => {};
	export let closeOnOverlayClick = false;

	const overlayCss = css`
		z-index: ${getHighestZIndex()};
		background-color: ${colorRgba};
		backdrop-filter: blur(${jdgSizes.blurSizeMedium});
	`;

	const closeButtonCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.navMobileIconHeightSm};
			height: ${jdgSizes.navMobileIconHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) and (max-width: ${
			jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit
		}) {
			width: ${jdgSizes.navMobileIconHeightMd};
			height: ${jdgSizes.navMobileIconHeightMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			width: ${jdgSizes.navMobileIconHeightLg};
			height: ${jdgSizes.navMobileIconHeightLg};
	`;

	const overlayTitleBarCss = css`
		padding-left: ${jdgSizes.headerSidePadding};
		padding-right: ${jdgSizes.headerSidePadding};
		padding-top: ${jdgSizes.headerTopBottomPadding};
		padding-bottom: ${jdgSizes.headerTopBottomPadding};
		background-color: ${jdgColors.headerBackground};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) and (max-width: ${
			jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit
		}) {
			height: ${jdgSizes.headerHeightMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			height: ${jdgSizes.headerHeightLg};
	`;
</script>

<div
	class="jdg-overlay {overlayCss}"
	on:click|self={onCloseFunction}
	on:keypress|self={() => {}}
	role="button"
	tabindex="0"
	transition:fade={{ duration: jdgDurations.default }}
>
	{#if showTitleBar}
		<div class="jdg-overlay-title-bar {overlayTitleBarCss}">
			<div
				class="jdg-overlay-close-button {closeButtonCss}"
				role="button"
				tabindex="0"
				on:click={onCloseFunction}
				on:keypress={() => {}}
			>
				<div class="jdg-highlight-container">
					<span class="jdg-highlight no-initial-highlight" style="display: flex;">
						<JDGCloseIcon />
					</span>
				</div>
			</div>
		</div>
	{/if}
	<div
		class="jdg-overlay-content"
		role="button"
		tabindex="0"
		on:click|self={closeOnOverlayClick ? onCloseFunction : () => {}}
		on:keypress={() => {}}
	>
		<slot />
	</div>
</div>

<style>
	.jdg-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.jdg-overlay-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
	}

	.jdg-overlay-title-bar {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: end;
		width: 100%;
	}

	.jdg-overlay-close-button {
		cursor: pointer;
		z-index: 1;
	}
</style>
