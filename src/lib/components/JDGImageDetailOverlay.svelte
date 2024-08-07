<script>
	import { scale } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { setImageDetailAttributes, setShowImageDetailModal } from '$lib/jdg-state-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGOverlay } from '$lib/index.js';
	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';

	export let imageAttributes = instantiateObject(jdgImageAttributes);

	const imageAndCaptionWrapperCss = css`
		display: ${imageAttributes.allowBlur ? 'flex' : 'grid'};
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
		setShowImageDetailModal(false);
		setImageDetailAttributes(undefined);
	}}
	closeOnOverlayClick={true}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<div class="image-and-caption-wrapper {imageAndCaptionWrapperCss}" transition:scale>
		<JDGImage
			{imageAttributes}
			maxHeight="auto"
			fillContainer={false}
			showBlurInUnfilledSpace={true}
			transition={scale}
		/>
		<JDGImageCaptionAttribution {imageAttributes} truncateText={false} />
	</div>
</JDGOverlay>

<style>
	.image-and-caption-wrapper {
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		z-index: 1;
		pointer-events: none;
	}
</style>
