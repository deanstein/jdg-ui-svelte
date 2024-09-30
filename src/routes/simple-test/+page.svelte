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
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				cropToFillContainer={true}
				showCaption={true}
				showAttribution={true}
				objectPosition="left"
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				cropToFillContainer={true}
				showCaption={true}
				showAttribution={true}
				objectPosition="center"
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				cropToFillContainer={true}
				showCaption={true}
				showAttribution={true}
				objectPosition="right"
			/>
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>
