<script>
	import { scale } from 'svelte/transition';
	import { css } from '@emotion/css';

	import { setShowImageDetailModal } from '$lib/jdg-state-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGOverlay } from '$lib/index.js';

	import jdgImageAttributes from '$lib/schemas/jdg-image-attributes.js';
	import { jdgBreakpoints } from '$lib/jdg-styling-constants.js';
	export let imageAttributes = instantiateObject(jdgImageAttributes);

	const imageWrapperCss = css`
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
	}}
	closeOnOverlayClick={true}
	colorRgba="rgba(255, 255, 255, 0.6)"
>
	<div class="image-wrapper {imageWrapperCss}">
		<JDGImage
			{imageAttributes}
			maxHeight="auto"
			fillContainer={false}
			showBlurInUnfilledSpace={true}
			transition={scale}
		/>
		<JDGImageCaptionAttribution {imageAttributes} />
	</div>
</JDGOverlay>

<style>
	.image-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
</style>
