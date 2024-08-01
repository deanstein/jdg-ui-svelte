<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="CLOUDINARY TEST">
		<JDGBodyCopy paddingTop="0">Test out Cloudinary optimization and resizing here.</JDGBodyCopy>

		{#if false}
			<JDGImageFullWidth
				imageAttributes={imageAttributesCollection.cc_1}
				showOverlay={true}
				overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
				overlayImageText="A Secondary Text Test"
				overlayImageTextFontFamily="Righteous"
				overlapWithHeader={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.fairgrounds_aerial}
				fillContainer={false}
			/>
		{/if}
		{#if true}
			<JDGImageHybridGridCarousel
				imageAttributeObjects={[
					imageAttributesCollection.aerial_60s70s_1,
					imageAttributesCollection.cc_1,
					imageAttributesCollection.architecture_1
				]}
			/>
			<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.mindful_multifamily,
				imageAttributesCollection.mindful_multifamily_close,
				imageAttributesCollection.mindful_multifamily_highway
			]}
		/>
		{/if}
		{#if false}
			<JDGImageCarousel
				imageAttributeObjects={[
					imageAttributesCollection.fairgrounds_aerial,
					imageAttributesCollection.rose_mall_60s70s_2
				]}
			/>
		{/if}
	</JDGContentBoxFloating>
</JDGContentContainer>
