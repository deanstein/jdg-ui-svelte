<script>
	import { css } from '@emotion/css';

	import { colorMode, isMobileBreakpoint, carouselHintHeightPx } from '$lib/stores/jdg-ui-store.js';
	import { darkenColor, setRgbaAlpha } from '$lib/jdg-utils.js';

	import { jdgSizes, jdgBreakpoints, getThemePalette, themeColors } from '$lib/index.js';
	import { JDGOverlay, JDGRandomGradient } from '$lib/index.js';

	export let onClickCloseButton = undefined;
	export let closeOnOverlayClick = true;
	export let title = undefined;
	export let subtitle = undefined;
	export let width = 'auto';
	export let height = 'auto';
	// Only applies to desktop/tablet
	export let minWidth = undefined;
	// Only applies to desktop/tablet
	export let maxWidth = undefined;
	// Ignores width and ensures mobile is always as wide as possible
	export let maximizeWidthOnMobile = true;
	export let padding = '10px';
	// Default to auto for proper scrolling
	export let overflow = 'auto';
	// Content colors
	export let backgroundColor = undefined;
	export let opacity = undefined;
	// Optional gradient colors - if provided, use JDGRandomGradient instead of backgroundColor
	export let gradientColor1 = undefined;
	export let gradientColor2 = undefined;
	export let gradientColor3 = undefined;
	// Backdrop colors — only applies in the non-contentOnly path.
	// overlayColorRgba sets the backdrop base color; overlayOpacity overrides its alpha.
	// Blur is intentionally left to JDGOverlay's default (always blurs).
	export let overlayColorRgba = undefined;
	export let overlayOpacity = 0.5;
	// When true, only the modal content box is rendered (no JDGOverlay). Use inside JDGOverlay + JDGOverlayCarousel for carousel modals.
	export let contentOnly = false;

	// Minimum padding around content when it maximizes available space
	const minPadding = '20px';

	$: palette = getThemePalette($colorMode);
	$: resolvedBackgroundColor = backgroundColor ?? palette.contentBoxBackground;

	// Resolve the backdrop color forwarded to JDGOverlay.
	// When no overlay props are set, pass undefined so JDGOverlay keeps its own default.
	// Use != null (not truthiness) so an explicit overlayOpacity of 0 is honored.
	$: resolvedOverlayColorRgba =
		overlayOpacity != null
			? setRgbaAlpha(overlayColorRgba ?? palette.headerBackground, overlayOpacity)
			: overlayColorRgba;

	$: titleBarDarkenAmount = $colorMode === 'dark' ? 0.15 : 0.05;
	$: titleBarGradient1 = gradientColor1
		? darkenColor(gradientColor1, titleBarDarkenAmount)
		: gradientColor1;
	$: titleBarGradient2 = gradientColor2
		? darkenColor(gradientColor2, titleBarDarkenAmount)
		: gradientColor2;
	$: titleBarGradient3 = gradientColor3
		? darkenColor(gradientColor3, titleBarDarkenAmount)
		: gradientColor3;

	let modalContentContainerCss = css``;
	$: {
		// Only set background-color if gradient colors are not provided
		const bgColor =
			gradientColor1 && gradientColor2 && gradientColor3
				? 'transparent'
				: opacity
					? setRgbaAlpha(resolvedBackgroundColor, opacity)
					: resolvedBackgroundColor;

		modalContentContainerCss = css`
			width: ${$isMobileBreakpoint && maximizeWidthOnMobile
				? `calc(100vw - ${minPadding})`
				: width};
			height: ${$isMobileBreakpoint && maximizeWidthOnMobile ? '90dvh' : height};
			min-width: ${!$isMobileBreakpoint && minWidth ? minWidth : 'auto'};
			max-width: ${!$isMobileBreakpoint && maxWidth ? maxWidth : 'none'};
			/* Constrain max-height so header stays visible and (when contentOnly + carousel) hint row + bottom visible */
			/* Use dvh (dynamic viewport height) to handle iOS browser chrome appearing/disappearing */
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				max-height: ${contentOnly
					? `calc(100dvh - ${jdgSizes.headerHeightSm} - ${minPadding} - ${$carouselHintHeightPx}px)`
					: `calc(100dvh - ${jdgSizes.headerHeightSm} - ${minPadding})`};
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				max-height: ${contentOnly
					? `calc(100dvh - ${jdgSizes.headerHeightMd} - ${minPadding} - ${$carouselHintHeightPx}px)`
					: `calc(100dvh - ${jdgSizes.headerHeightMd} - ${minPadding})`};
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				max-height: ${contentOnly
					? `calc(100dvh - ${jdgSizes.headerHeightLg} - ${minPadding} - ${$carouselHintHeightPx}px)`
					: `calc(100dvh - ${jdgSizes.headerHeightLg} - ${minPadding})`};
			}
			background-color: ${bgColor};
		`;
	}

	const modalContentSlotCss = css`
		overflow: ${overflow};
		padding: ${padding};
	`;

	let modalTitleBarContainerCss = css``;
	$: modalTitleBarContainerCss = css`
		background-color: ${$themeColors.headerBackground};
	`;

	let modalTitleCss = css``;
	$: modalTitleCss = css`
		color: ${$themeColors.title};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 1.1rem;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 1.25rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 1.4rem;
		}
	`;

	let modalSubtitleCss = css``;
	$: modalSubtitleCss = css`
		color: ${$themeColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: 0.9rem;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: 1rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: 1.05rem;
		}
	`;

	const exitDurationMs = 250;
	let isClosing = false;

	function handleClose() {
		if (isClosing) return;
		isClosing = true;
		setTimeout(() => {
			if (typeof onClickCloseButton === 'function') {
				onClickCloseButton();
			}
		}, exitDurationMs);
	}

	function handleBackdropClick() {
		if (closeOnOverlayClick && typeof onClickCloseButton === 'function') {
			handleClose();
		}
	}
</script>

{#if contentOnly}
	<div
		class="modal-outer-container"
		on:click|stopPropagation
		on:keydown={(e) => {
			if (e.key === 'Escape') handleClose();
		}}
		role="presentation"
		tabindex="-1"
	>
		<div class="modal-outer-center">
			<div
				class="modal-content-container {modalContentContainerCss}"
				class:modal-closing={isClosing}
			>
				{#if gradientColor1 && gradientColor2 && gradientColor3}
					<div class="modal-background-gradient" style="background-color: {gradientColor3};">
						<JDGRandomGradient
							numberOfPoints={10}
							edgeBufferRatio={0.1}
							drawDebugBorders={false}
							color1={gradientColor1}
							color2={gradientColor2}
							color3={gradientColor3}
							opacity={0.75}
						/>
					</div>
				{/if}
				{#if title || subtitle}
					<div
						class="modal-title-bar-container {modalTitleBarContainerCss}"
						style="position: relative; z-index: 1;"
					>
						{#if gradientColor1 && gradientColor2 && gradientColor3}
							<div class="modal-title-bar-gradient" style="background-color: {titleBarGradient2};">
								<JDGRandomGradient
									numberOfPoints={8}
									edgeBufferRatio={0.1}
									drawDebugBorders={false}
									color1={titleBarGradient3}
									color2={titleBarGradient1}
									color3={titleBarGradient2}
									opacity={0.75}
								/>
							</div>
						{/if}
						<div class="modal-title-container" style="position: relative; z-index: 1;">
							{#if title}
								<div class="modal-title {modalTitleCss}">
									{title}
								</div>
							{/if}
						</div>
						{#if subtitle}
							<div class="modal-subtitle-container" style="position: relative; z-index: 1;">
								<div class="modal-subtitle {modalSubtitleCss}">
									{subtitle}
								</div>
							</div>
						{/if}
					</div>
				{/if}
				<div
					class="modal-content-slot {modalContentSlotCss}"
					style="position: relative; z-index: 1;"
				>
					<slot name="modal-content-slot" {handleClose} />
				</div>
				<div class="modal-toolbar-slot" style="position: relative; z-index: 1;">
					<slot name="modal-toolbar-slot" {handleClose} />
				</div>
			</div>
		</div>
	</div>
{:else}
	<JDGOverlay onCloseFunction={handleClose} {closeOnOverlayClick} colorRgba={resolvedOverlayColorRgba}>
		<div
			class="modal-outer-container"
			on:click|self={handleBackdropClick}
			on:keydown={(e) => e.key === 'Escape' && handleClose()}
			role="presentation"
			tabindex="-1"
		>
			<div class="modal-outer-center">
				<div
					class="modal-content-container {modalContentContainerCss}"
					class:modal-closing={isClosing}
				>
					{#if gradientColor1 && gradientColor2 && gradientColor3}
						<div class="modal-background-gradient" style="background-color: {gradientColor3};">
							<JDGRandomGradient
								numberOfPoints={10}
								edgeBufferRatio={0.1}
								drawDebugBorders={false}
								color1={gradientColor1}
								color2={gradientColor2}
								color3={gradientColor3}
								opacity={0.75}
							/>
						</div>
					{/if}
					{#if title || subtitle}
						<div
							class="modal-title-bar-container {modalTitleBarContainerCss}"
							style="position: relative; z-index: 1;"
						>
							{#if gradientColor1 && gradientColor2 && gradientColor3}
								<div
									class="modal-title-bar-gradient"
									style="background-color: {titleBarGradient2};"
								>
									<JDGRandomGradient
										numberOfPoints={8}
										edgeBufferRatio={0.1}
										drawDebugBorders={false}
										color1={titleBarGradient3}
										color2={titleBarGradient1}
										color3={titleBarGradient2}
										opacity={0.75}
									/>
								</div>
							{/if}
							<div class="modal-title-container" style="position: relative; z-index: 1;">
								{#if title}
									<div class="modal-title {modalTitleCss}">
										{title}
									</div>
								{/if}
							</div>
							{#if subtitle}
								<div class="modal-subtitle-container" style="position: relative; z-index: 1;">
									<div class="modal-subtitle {modalSubtitleCss}">
										{subtitle}
									</div>
								</div>
							{/if}
						</div>
					{/if}
					<div
						class="modal-content-slot {modalContentSlotCss}"
						style="position: relative; z-index: 1;"
					>
						<slot name="modal-content-slot" {handleClose} />
					</div>
					<div class="modal-toolbar-slot" style="position: relative; z-index: 1;">
						<slot name="modal-toolbar-slot" {handleClose} />
					</div>
				</div>
			</div>
		</div>
	</JDGOverlay>
{/if}

<style>
	.modal-outer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-height: 100%;
		outline: none;
	}
	.modal-outer-container:focus,
	.modal-outer-container:focus-visible {
		outline: none;
	}

	.modal-outer-center {
		flex: 0 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		max-height: 100%;
	}

	.modal-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
		animation: modal-enter 0.35s ease-out;
	}

	@keyframes modal-enter {
		from {
			transform: translateY(20px) scale(0.95);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}

	.modal-closing {
		animation: modal-exit 0.25s ease-in forwards;
	}

	@keyframes modal-exit {
		from {
			transform: none;
			opacity: 1;
		}
		to {
			transform: translateY(20px) scale(0.95);
			opacity: 0;
		}
	}

	.modal-background-gradient {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.modal-title-bar-container {
		position: relative;
		flex-shrink: 0;
		width: -webkit-fill-available;
		width: -moz-available;
		padding-bottom: 10px;
		border-radius: 10px 10px 0px 0px;
		overflow: hidden;
	}

	.modal-title-bar-gradient {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.modal-title-bar-actions-container {
		position: absolute;
		display: flex;
		justify-content: right;
		align-items: center;
		padding: 0px 5px 0px 5px;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.modal-title-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-title {
		text-align: center;
		width: 100%;
		font-weight: bold;
		padding: 7px 20px 5px 20px;
		box-sizing: border-box;
	}

	.modal-subtitle-container {
		width: 100%;
	}

	.modal-subtitle {
		width: 100%;
		text-align: center;
		padding: 0px 20px 5px 20px;
		box-sizing: border-box;
	}

	.modal-content-slot {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1vh;
		/* Use flex: 1 with min-height: 0 for proper flex shrinking and scrolling */
		flex: 1 1 auto;
		min-height: 0;
		overscroll-behavior: contain;
		width: -webkit-fill-available;
		width: -moz-available;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch;
	}

	.modal-toolbar-slot {
		display: flex;
		flex-shrink: 0;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: right;
	}
</style>
