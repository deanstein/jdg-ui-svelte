<script>
	import { css } from '@emotion/css';

	import { setShowImageDetailModal } from '$lib/jdg-ui-management.js';

	import { JDGCloseIcon, JDGOverlay } from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import jdgImageDetails from '$lib/schemas/image-details.js';

	export let imageDetails = instantiateObject(jdgImageDetails);

	const onClickCloseButton = () => {
		setShowImageDetailModal(false);
	};

	const modalTitleBarCss = css`
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
</script>

<JDGOverlay
	onClickFunction={() => {
		setShowImageDetailModal(false);
	}}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<div class="image-modal-content">
		<div class="image-modal-title-bar {modalTitleBarCss}">
			<div
				class="image-modal-close-button {closeButtonCss}"
				role="button"
				tabindex="0"
				on:click={onClickCloseButton}
				on:keypress={() => {}}
			>
				<div class="jdg-highlight-container">
					<span class="jdg-highlight no-initial-highlight" style="display: flex;">
						<JDGCloseIcon />
					</span>
				</div>
			</div>
		</div>
		<div class="image-container">
			<img src={imageDetails.imgSrc} alt={imageDetails.imgAlt} />
		</div>
	</div>
</JDGOverlay>

<style>
	.image-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
	}

	.image-modal-title-bar {
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: end;
		width: 100%;
	}

	.image-modal-close-button {
		cursor: pointer;
		z-index: 1;
	}

	.image-container {
		display: flex;
		padding: 10px;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
	}
</style>
