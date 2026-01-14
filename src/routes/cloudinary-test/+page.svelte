<script>
	import imageMetaRegistry from '../image-meta-registry.js';

	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile
	} from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="CLOUDINARY TEST">
		<JDGBodyCopy paddingTop="0">Test out Cloudinary optimization and resizing here.</JDGBodyCopy>

		{#if false}
			<JDGImageFullWidth
				imageMeta={imageMetaRegistry.cc_1}
				showOverlay={true}
				overlayImageAttributes={imageMetaRegistry.ccp_ouatacc_white}
				overlayImageText="A Secondary Text Test"
				overlayImageTextFontFamily="Righteous"
				overlapWithHeader={true}
			/>
			<JDGImageTile imageMeta={imageMetaRegistry.fairgrounds_aerial} cropToFillContainer={false} />
		{/if}
		{#if true}
			<JDGImageHybridGridCarousel
				imageMetaSet={[
					imageMetaRegistry.aerial_60s70s_1,
					imageMetaRegistry.cc_1,
					imageMetaRegistry.architecture_1
				]}
			/>
			<JDGImageCarousel
				imageMetaSet={[
					imageMetaRegistry.mindful_multifamily,
					imageMetaRegistry.mindful_multifamily_close,
					imageMetaRegistry.mindful_multifamily_highway
				]}
			/>
		{/if}
		{#if false}
			<JDGImageCarousel
				imageMetaSet={[imageMetaRegistry.fairgrounds_aerial, imageMetaRegistry.rose_mall_60s70s_2]}
			/>
		{/if}
	</JDGContentBoxFloating>
</JDGContentContainer>
