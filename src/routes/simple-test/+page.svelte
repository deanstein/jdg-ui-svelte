<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={true} paddingTop="0">
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
