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
		<JDGBodyCopy textAlign="center">
			<b>IMAGE</b>
			<br />
			This is a .gif, and won't get the height or width set if it's Cloudinary (for some reason, that
			causes an error).
		</JDGBodyCopy>
		<JDGImage
			imageAttributes={imageAttributesCollection.exp.ranch_elsie_roof_optioneering}
			maxHeight="600px"
			cropToFillContainer={false}
			showBlurInUnfilledSpace={false}
			showCaption={true}
		/>
		<JDGBodyCopy textAlign="center"></JDGBodyCopy>
	</JDGContentBoxFloating>
</JDGContentContainer>
