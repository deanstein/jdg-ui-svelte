<script>
	import {
		JDGClipFade,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGH3H4,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGClipFade>
			<JDGGridLayout>
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
				<JDGImageTile imageAttributes={imageAttributesCollection.rose_mall_60s70s_2} />
			</JDGGridLayout>
		</JDGClipFade>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="THIS IS A TITLE">
		<JDGH3H4 h3String="THIS IS AN H3 STRING" h4String="And this is an h4" />
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.fairgrounds_aerial,
				imageAttributesCollection.speer_point_after,
				imageAttributesCollection.cc_1,
				imageAttributesCollection.ccp_blue_mall_60s70s_1
			]}
			justifyContent="center"
			showBlurInUnfilledSpace={true}
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
			cropToFillContainer={false}
			maxHeight="400px"
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
