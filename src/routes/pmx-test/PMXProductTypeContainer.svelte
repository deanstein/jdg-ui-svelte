<script>
	import { css } from '@emotion/css';

	import { imageMetaCollection } from '../image-meta-collection.js';
	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';

	import { JDGImageCarousel } from '$lib/index.js';
	import { appAccentColors } from '$lib/stores/jdg-ui-store.js';

	export let productId = undefined; // optional, for use in ProductTypeSelector parent component (if multiple types)
	export let imageMetaSet = [
		imageMetaCollection.products.CITYSCAPE_021A_1,
		imageMetaCollection.products.CITYSCAPE_021A_2,
		imageMetaCollection.products.CITYSCAPE_021A_3,
		imageMetaCollection.products.CITYSCAPE_021A_4
	];

	const productTypeContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			flex-direction: row;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			flex-direction: row;
		}
	`;
</script>

<!-- product detail contains an image carousel and a series of product detail sections -->
<div id={productId ?? '000X'} class="pmx-product-type-flex-container {productTypeContainerCss}">
	<div class="flex-container-left">
		<JDGImageCarousel
			{imageMetaSet}
			showCaption={false}
			showAttribution={false}
			showBlurInUnfilledSpace={false}
			justifyContent="right"
			activeThumbnailColor={$appAccentColors[2]}
		/>
	</div>
	<div class="flex-container-right">
		<div class="right-panel-container">
			<!-- any required ProductDetailsSections go here -->
			<!-- for example, product name, description, availability -->
			<slot />
		</div>
	</div>
</div>

<style>
	:global(.icon-and-text) {
		display: flex;
		gap: 5px;
	}

	:global(.list-item) {
		line-height: 2;
	}

	:global(.indented) {
		margin-left: 20px;
	}

	.pmx-product-type-flex-container {
		display: flex;
		justify-content: center;
		gap: 20px;
	}

	.flex-container-left {
		display: flex;
		justify-content: right;
		align-items: baseline;
	}

	.flex-container-right {
		flex: 0 0 30%;
	}

	.right-panel-container {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
</style>
