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
	export let justifyContent = 'flex-start';

	const justificationCss = css`
		justify-content: ${justifyContent};
		align-items: ${justifyContent === 'right' ? 'end' : 'flex-start'};
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
	{#each imageMetaSet ?? [] as imageAttributesObject, i}
		<div
			class="jdg-thumbnail-group-wrapper"
			style={imageAttributesObject === activeImageMeta
				? `outline: 3px solid ${activeThumbnailColor}; outline-offset: 2px;`
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
		flex-wrap: wrap;
		gap: 8px;
		/* Ensure container respects parent bounds on iOS */
		max-width: 100%;
	}

	.jdg-thumbnail-group-wrapper {
		flex-shrink: 0;
		/* Allow proper sizing within flex parent on iOS */
		max-width: 100%;
	}
</style>
