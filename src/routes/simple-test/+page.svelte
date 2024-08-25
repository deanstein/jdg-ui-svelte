<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImage,
		JDGImageFullWidth,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer topPadding="0" overlapWithHeader={true}>
	<JDGImageFullWidth
		imageAttributes={imageAttributesCollection.cc_1}
		showOverlay={true}
		overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
		overlayImageText="A Secondary Text Test"
		overlayImageTextFontFamily="Righteous"
		overlapWithHeader={true}
	/>
</JDGContentContainer>
