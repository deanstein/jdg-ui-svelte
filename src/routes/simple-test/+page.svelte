<script>
	import {
		JDGClipFade,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGH3H4,
		JDGImageCarousel,
		JDGImageHybridGridCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.ecc_existing_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.cc_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
