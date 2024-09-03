<script>
	import { scale } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

	import { hideImageDetailModal } from '$lib/jdg-state-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGOverlay } from '$lib/index.js';
	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';
	import { imageDetailWidth } from '$lib/states/ui-state.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes);

	const imageAndCaptionWrapperCss = css`
		display: ${imageAttributes.allowBackgroundBlur ? 'flex' : 'grid'};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: 0px;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: 1rem;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: 2rem;
		}
	`;
</script>

<JDGOverlay
	showTitleBar={true}
	onCloseFunction={() => {
		hideImageDetailModal();
	}}
	closeOnOverlayClick={true}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<div
		class="image-and-caption-wrapper {imageAndCaptionWrapperCss}"
		transition:scale
		on:click={hideImageDetailModal}
		role="button"
		tabindex="0"
		on:keypress={() => {}}
	>
		<JDGImage
			{imageAttributes}
			maxHeight="auto"
			maxWidth="100%"
			cropToFillContainer={false}
			showBlurInUnfilledSpace={true}
			transition={scale}
			stopEventPropagation={true}
			isForImageDetailOverlay={true}
			doScaleOnScrollOrZoom={true}
		/>
		<div class="image-caption-attribution-wrapper" style="width: {$imageDetailWidth}px">
			<JDGImageCaptionAttribution {imageAttributes} />
		</div>
	</div>
</JDGOverlay>

<style>
	.image-and-caption-wrapper {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.image-caption-attribution-wrapper {
		position: relative;
	}
</style>
