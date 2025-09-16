<script>
	import { onDestroy } from 'svelte';
	import { scale } from 'svelte/transition';
	import { css } from '@emotion/css';

	import jdgImageMeta from '$lib/schemas/jdg-image-meta.js';

	import { hideImageDetailModal } from '$lib/jdg-state-management.js';
	import { instantiateObject } from '$lib/jdg-utils.js';

	import { JDGImage, JDGImageCaptionAttribution, JDGOverlay } from '$lib/index.js';
	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';
	import { imageDetailScale, imageDetailWidth } from '$lib/stores/jdg-ui-store.js';

	export let imageMeta = instantiateObject(jdgImageMeta);

	const imageAndCaptionWrapperCss = css`
		display: ${imageMeta.doShowBackgroundBlur ? 'flex' : 'grid'};
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

	// when the overlay is closed, reset the scale so we show caption/attribution next time
	onDestroy(() => {
		imageDetailScale.set(1.0);
	});
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
			{imageMeta}
			maxHeight="auto"
			maxWidth="100%"
			cropToFillContainer={false}
			showBlurInUnfilledSpace={true}
			transition={scale}
			stopEventPropagation={true}
			isForImageDetailOverlay={true}
			doScaleOnScrollOrZoom={true}
		/>
		<!-- only show caption/attribution if image is not scaled -->
		{#if $imageDetailScale === 1.0 && (imageMeta.caption || imageMeta.attribution)}
			<div class="image-caption-attribution-wrapper" style="width: {$imageDetailWidth}px">
				<JDGImageCaptionAttribution {imageMeta} truncateText={false} />
			</div>
		{/if}
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
