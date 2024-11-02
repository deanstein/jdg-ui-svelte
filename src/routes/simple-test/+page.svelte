<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayoutFade,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGGridLayoutFade>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				showCaption={true}
				showAttribution={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.cc_1}
				showCaption={true}
				showAttribution={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.architecture_1}
				showCaption={true}
				showAttribution={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
				showCaption={true}
				showAttribution={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_2}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGGridLayoutFade>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating>
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.fairgrounds_aerial,
				imageAttributesCollection.speer_point_after
			]}
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
			cropToFillContainer={false}
			maxHeight="400px"
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
