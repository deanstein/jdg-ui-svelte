<script>
	import { css } from '@emotion/css';

	import { isMobileBreakpoint } from '$lib/stores/jdg-ui-store.js';
	import { setRgbaAlpha } from '$lib/jdg-utils.js';

	import { jdgColors, jdgSizes } from '$lib/index.js';
	import { JDGOverlay } from '$lib/index.js';
	import { jdgDurations } from '$lib/index.js';
	import { drawCrossfade } from '$lib/jdg-graphics-factory.js';

	export let showModal = true;
	export let onClickCloseButton = undefined;
	export let title = 'This is a modal title';
	export let subtitle = 'This is a modal subtitle';
	export let width = 'auto';
	export let height = 'auto';
	export let maximizeOnMobile = false; // maximize size on mobile
	export let padding = '10px';
	export let overflow = ''; // default is not set but can be set per instance
	export let backgroundColor = jdgColors.contentBoxBackground;
	export let transparency = undefined; // default is in default bg color

	const [send, receive] = drawCrossfade(jdgDurations.fadeIn);

	let modalContentContainerCss = css``;
	$: {
		modalContentContainerCss = css`
			width: ${$isMobileBreakpoint && maximizeOnMobile ? '90vw' : width};
			height: ${$isMobileBreakpoint && maximizeOnMobile ? '90svh' : height};
			overflow: ${overflow};
			background-color: ${transparency
				? setRgbaAlpha(backgroundColor, transparency)
				: backgroundColor};
		`;
	}

	const modalContentSlotCss = css`
		padding: ${padding};
	`;

	const modalTitleBarContainerCss = css`
		background-color: ${jdgColors.headerBackground};
	`;

	const modalTitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxTitle};
		color: ${jdgColors.text};
	`;

	const modalSubtitleCss = css`
		font-size: ${jdgSizes.fontSizeFloatingContentBoxSubtitle};
		color: ${jdgColors.text};
	`;
</script>

<JDGOverlay onCloseFunction={onClickCloseButton} closeOnOverlayClick>
	<div in:receive={{ key: showModal }} out:send={{ key: showModal }} class="modal-outer-container">
		<div class="modal-content-container {modalContentContainerCss}">
			{#if title || onClickCloseButton}
				<div class="modal-title-bar-container {modalTitleBarContainerCss}">
					<div class="modal-title-container">
						<div class="modal-title {modalTitleCss}">
							{title}
						</div>
					</div>
					{#if subtitle}
						<div class="modal-subtitle-container">
							<div class="modal-subtitle {modalSubtitleCss}">
								{subtitle}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			<div class="modal-content-slot {modalContentSlotCss}">
				<slot name="modal-content-slot" />
			</div>
			<div class="modal-toolbar-slot">
				<slot name="modal-toolbar-slot" />
			</div>
		</div>
	</div>
</JDGOverlay>

<style>
	.modal-outer-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.modal-content-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}

	.modal-title-bar-container {
		width: -webkit-fill-available;
		width: -moz-available;
		border-radius: 10px 10px 0px 0px;
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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1vh;
		min-height: 0;
	}

	.modal-toolbar-slot {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: right;
	}
</style>
