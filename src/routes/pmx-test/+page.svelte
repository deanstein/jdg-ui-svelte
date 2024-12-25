<script>
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageCarousel } from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
	import { appAccentColors } from '$lib/states/ui-state.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating
		title="DENVER CITYSCAPE"
		titleColor={$appAccentColors[2]}
		subtitle="Denver in the palm of your hands"
	>
		<div class="pmx-product-container-flex">
			<div class="flex-container-left">
				<JDGImageCarousel
					imageAttributeObjects={[
						imageAttributesCollection.aerial_60s70s_1,
						imageAttributesCollection.architecture_1,
						imageAttributesCollection.cc_2,
						imageAttributesCollection.ccp_blue_mall_60s70s_1
					]}
					showCaption={false}
					showAttribution={false}
					showBlurInUnfilledSpace={false}
					justifyContent="right"
					matchMaxImageWidth
				/>
			</div>
			<div class="flex-container-right">
				<div class="right-panel-container">
					The Denver Cityscape features over 70 of Denver's most iconic buildings at 1:5280 scale.
					<br /><br />
					Our custom algorithm approximates the building locations based on actual addresses, then adjusts
					their locations on the platform to minimize overlap and maximize visibility.
					<br /><br />
					The Cityscape model is occasionally updated as Denver's skyline changes. Check the version
					number on the bottom of the product and match it with the legend below.
				</div>
			</div>
		</div></JDGContentBoxFloating
	>
</JDGContentContainer>

<style>
	.pmx-product-container-flex {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 20px;
	}

	.flex-container-left {
		display: flex;
		justify-content: right;
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
