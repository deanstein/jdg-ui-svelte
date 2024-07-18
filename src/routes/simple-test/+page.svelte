<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="TEST SECTION">
		<JDGBodyCopy paddingTop="0">
			This page should serve as a place to test a single component that needs debugging. Keep it
			simple!
		</JDGBodyCopy>
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
