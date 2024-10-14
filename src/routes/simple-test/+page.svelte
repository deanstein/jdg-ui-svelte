<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageFullWidth,
		JDGImageTile,
		JDGJumpTo,
		JDGMetaTags
	} from '$lib/index.js';
	import { jdgSharedUrls } from '$lib/jdg-shared-strings.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
	import sharedStrings from '../shared-strings.js';
</script>

<JDGMetaTags
	title1={sharedStrings.websiteTitle}
	title2={'Simple Test'}
	description={sharedStrings.websiteDescription}
/>
<JDGContentContainer overlapWithHeader={true} paddingTop="0">
	<JDGContentBoxFloating>
		<JDGImageFullWidth
			imageAttributes={imageAttributesCollection.cc_1}
			showOverlay={true}
			overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
			overlayImageText="A Secondary Text Test"
			overlayImageTextFontFamily="Righteous"
			overlapWithHeader={true}
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.aerial_60s70s_1}
			cropToFillContainer={false}
			showCaption={true}
			showAttribution={true}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
