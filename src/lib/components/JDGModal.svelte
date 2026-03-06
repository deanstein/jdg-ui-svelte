<script>
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { setRgbaAlpha } from '$lib/jdg-utils.js';

	import { jdgColors, jdgSizes, jdgBreakpoints } from '$lib/index.js';
	import { JDGOverlay, JDGRandomGradient, JDGCarouselNavButtons } from '$lib/index.js';
	import { jdgDurations } from '$lib/index.js';
	import { drawCrossfade } from '$lib/jdg-graphics-factory.js';

	export let showModal = true;
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
	export let backgroundColor = jdgColors.contentBoxBackground;
	export let transparency = undefined;
	// Optional gradient colors - if provided, use JDGRandomGradient instead of backgroundColor
	export let gradientColor1 = undefined;
	export let gradientColor2 = undefined;
	export let gradientColor3 = undefined;
	// When true, prev/next carousel nav buttons are shown at the left/right edges of the modal (driven by carouselNav)
	export let showCarouselNav = false;

	// Minimum padding around content when it maximizes available space
	const minPadding = '20px';
	// Configure crossfade animation
	const [send, receive] = drawCrossfade(jdgDurations.fadeIn);

	let modalContentContainerCss = css``;
	$: {
		// Only set background-color if gradient colors are not provided
		const bgColor =
			gradientColor1 && gradientColor2 && gradientColor3
				? 'transparent'
				: transparency
					? setRgbaAlpha(backgroundColor, transparency)
					: backgroundColor;

		modalContentContainerCss = css`
			width: ${$isMobileBreakpoint && maximizeWidthOnMobile
				? `calc(100vw - ${minPadding})`
				: width};
			height: ${$isMobileBreakpoint && maximizeWidthOnMobile ? '90dvh' : height};
			min-width: ${!$isMobileBreakpoint && minWidth ? minWidth : 'auto'};
			max-width: ${!$isMobileBreakpoint && maxWidth ? maxWidth : 'none'};
			/* Constrain max-height to available viewport minus overlay header */
			/* Use dvh (dynamic viewport height) to handle iOS browser chrome appearing/disappearing */
			@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
				max-height: calc(100dvh - ${jdgSizes.headerHeightSm} - ${minPadding});
			}
			@media (min-width: ${jdgBreakpoints.width[0].toString() +
				jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
				jdgBreakpoints.unit}) {
				max-height: calc(100dvh - ${jdgSizes.headerHeightMd} - ${minPadding});
			}
			@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
				max-height: calc(100dvh - ${jdgSizes.headerHeightLg} - ${minPadding});
			}
			background-color: ${bgColor};
		`;
	}

	const modalContentSlotCss = css`
		overflow: ${overflow};
		padding: ${padding};
	`;

	const modalTitleBarContainerCss = css`
		background-color: ${jdgColors.headerBackground};
	`;

	/* Title: small/medium/large by breakpoint, slightly bigger than body (site strategy) */
	const modalTitleCss = css`
		color: ${jdgColors.title};
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

	/* Subtitle: same breakpoint strategy, one step down from title */
	const modalSubtitleCss = css`
		color: ${jdgColors.text};
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

	function handleBackdropClick() {
		if (closeOnOverlayClick && typeof onClickCloseButton === 'function') {
			onClickCloseButton();
		}
	}
</script>

<JDGOverlay onCloseFunction={onClickCloseButton} {closeOnOverlayClick}>
	<div
		in:receive={{ key: showModal }}
		out:send={{ key: showModal }}
		class="modal-outer-container"
		class:modal-outer-container-with-nav={showCarouselNav}
		on:click|self={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && handleBackdropClick()}
		role="presentation"
		tabindex="-1"
	>
		{#if showCarouselNav}
			<div class="modal-outer-edge modal-outer-edge-left">
				<JDGCarouselNavButtons side="prev" />
			</div>
		{/if}
		<div class="modal-outer-center">
			<div class="modal-content-container {modalContentContainerCss}">
				<!-- Background gradient if gradient colors are provided -->
				{#if gradientColor1 && gradientColor2 && gradientColor3}
					<div class="modal-background-gradient">
						<JDGRandomGradient
							numberOfPoints={10}
							edgeBufferRatio={0.1}
							drawDebugBorders={false}
							color1={gradientColor1}
							color2={gradientColor2}
							color3={gradientColor3}
						/>
					</div>
				{/if}
				{#if title || subtitle}
					<div
						class="modal-title-bar-container {modalTitleBarContainerCss}"
						style="position: relative; z-index: 1;"
					>
						<!-- Title bar gradient if gradient colors are provided -->
						{#if gradientColor1 && gradientColor2 && gradientColor3}
							<div class="modal-title-bar-gradient">
								<JDGRandomGradient
									numberOfPoints={8}
									edgeBufferRatio={0.1}
									drawDebugBorders={false}
									color1={gradientColor1}
									color2={gradientColor2}
									color3={gradientColor3}
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
					<slot name="modal-content-slot" />
				</div>
				<div class="modal-toolbar-slot" style="position: relative; z-index: 1;">
					<slot name="modal-toolbar-slot" />
				</div>
			</div>
		</div>
		{#if showCarouselNav}
			<div class="modal-outer-edge modal-outer-edge-right">
				<JDGCarouselNavButtons side="next" />
			</div>
		{/if}
	</div>
</JDGOverlay>

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

	.modal-outer-container-with-nav {
		flex-direction: row;
		justify-content: stretch;
	}

	.modal-outer-center {
		flex: 0 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		max-height: 100%;
	}

	/* Edge columns grow to fill space between screen and modal; buttons centered in that space */
	.modal-outer-edge {
		flex: 1 1 auto;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.modal-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		overflow: hidden;
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
