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
	import { imageMetaCollection } from '../image-meta-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="CLOUDINARY TEST">
		<JDGBodyCopy paddingTop="0">Test out Cloudinary optimization and resizing here.</JDGBodyCopy>

		{#if false}
			<JDGImageFullWidth
				imageMeta={imageMetaCollection.cc_1}
				showOverlay={true}
				overlayImageAttributes={imageMetaCollection.ccp_ouatacc_white}
				overlayImageText="A Secondary Text Test"
				overlayImageTextFontFamily="Righteous"
				overlapWithHeader={true}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.fairgrounds_aerial}
				cropToFillContainer={false}
			/>
		{/if}
		{#if true}
			<JDGImageHybridGridCarousel
				imageMetaSet={[
					imageMetaCollection.aerial_60s70s_1,
					imageMetaCollection.cc_1,
					imageMetaCollection.architecture_1
				]}
			/>
			<JDGImageCarousel
				imageMetaSet={[
					imageMetaCollection.mindful_multifamily,
					imageMetaCollection.mindful_multifamily_close,
					imageMetaCollection.mindful_multifamily_highway
				]}
			/>
		{/if}
		{#if false}
			<JDGImageCarousel
				imageMetaSet={[
					imageMetaCollection.fairgrounds_aerial,
					imageMetaCollection.rose_mall_60s70s_2
				]}
			/>
		{/if}
	</JDGContentBoxFloating>
</JDGContentContainer>
