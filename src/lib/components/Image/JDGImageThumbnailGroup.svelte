<script>
	import { css } from '@emotion/css';

	import { JDGImageTile } from '$lib/index.js';
	import { appAccentColors } from '$lib/states/ui-state.js';

	export let imageMetaSet;
	export let activeImageMeta = undefined;
	export let maxWidth = undefined;
	export let activeThumbnailColor = $appAccentColors[0];
	export let showBlurInUnfilledSpace = false;
	export let justifyContent = 'center';

	const setActiveImage = (imageAttributesObject, endAutoAdvance = false) => {
		// only set active image if image is different
		if (activeImageMeta.src !== imageAttributesObject.src) {
			activeImageMeta = imageAttributesObject;
		}
	};

	const justificationCss = css`
		justify-content: ${justifyContent};
		align-items: ${justifyContent === 'right' ? 'end' : 'center'};
	`;

	// the thumbnail container shouldn't be wider than the image
	let dynamicThumbnailContainerWidthCss = css``;
	$: {
		if (isFinite(maxWidth)) {
			dynamicThumbnailContainerWidthCss = css`
				width: ${showBlurInUnfilledSpace ? '100%' : `${maxWidth}px`};
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
				onClickFunction={() => {
					setActiveImage(imageAttributesObject, true);
				}}
				imageMeta={imageAttributesObject}
				maxHeight="50px"
				maxWidth="75px"
				useAutoHeightOnMobile={false}
				recordAspectRatioInState
			/>
		</div>
	{/each}
</div>
