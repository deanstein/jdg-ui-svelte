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

<JDGContentContainer paddingTop="0" overlapWithHeader={true}>
	<JDGContentBoxFloating>
		<JDGImageFullWidth
			imageAttributes={imageAttributesCollection.cc_1}
			showOverlay={true}
			overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
			overlayImageText="A Secondary Text Test"
			overlayImageTextFontFamily="Righteous"
			overlapWithHeader={true}
		/>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE</b>
			<br />
			No fill container, show blur, show caption/attribution
			<br />
			Inside BodyCopy
			<br /><br />
			<JDGImage
				imageAttributes={imageAttributesCollection.lakeside_1}
				cropToFillContainer={false}
				showBlurInUnfilledSpace={false}
				showCaption
				showAttribution
				useCompactHeightOnMobile
			/>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center" paddingBottom="0" paddingTop="0">
			<b>2 ITEMS</b>
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.ehs_1920_broadway_northeast}
				showCaption={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.fms_2013_broadway_northeast}
				showCaption={true}
			/>
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>
