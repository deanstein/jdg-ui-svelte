<script>
	import { css } from '@emotion/css';

	import { JDGImageTile } from '$lib/index.js';
	import { appAccentColors } from '$lib/stores/jdg-ui-store.js';

	export let imageMetaSet;
	export let activeImageMeta = undefined;
	export let maxImageHeight = '10svh';
	export let maxContainerWidth = undefined;
	export let activeThumbnailColor = $appAccentColors[0];
	export let showBlurInUnfilledSpace = false;
	export let justifyContent = 'center';

	const justificationCss = css`
		justify-content: ${justifyContent};
		align-items: ${justifyContent === 'right' ? 'end' : 'center'};
	`;

	// the thumbnail container shouldn't be wider than the image
	let dynamicThumbnailContainerWidthCss = css``;
	$: {
		if (isFinite(maxContainerWidth)) {
			dynamicThumbnailContainerWidthCss = css`
				width: ${showBlurInUnfilledSpace ? '100%' : `${maxContainerWidth}px`};
			`;
		}
	}
</script>

<div class="jdg-thumbnail-group-container {dynamicThumbnailContainerWidthCss} {justificationCss}">
	{#each imageMetaSet as imageAttributesObject, i}
		<div
			class="jdg-thumbnail-group-wrapper"
			style={imageAttributesObject === activeImageMeta
				? `outline: 5px solid ${activeThumbnailColor}`
				: ''}
		>
			<JDGImageTile
				imageMeta={imageAttributesObject}
				maxHeight={maxImageHeight}
				useAutoHeightOnMobile={false}
				recordAspectRatioInState
			/>
		</div>
	{/each}
</div>

<style>
	.jdg-thumbnail-group-container {
		display: flex;
		gap: 10px;
		justify-content: left;
	}
</style>
