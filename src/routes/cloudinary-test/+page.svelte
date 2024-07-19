<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGImageFullWidth,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="CLOUDINARY TEST">
		<JDGBodyCopy paddingTop="0">
			Test out Cloudinary optimization and resizing here.
		</JDGBodyCopy>
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
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.fairgrounds_aerial,
				imageAttributesCollection.rose_mall_60s70s_2
			]}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
