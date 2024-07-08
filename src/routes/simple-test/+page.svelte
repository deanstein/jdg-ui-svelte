<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="TEST SECTION">
		<JDGBodyCopy paddingTop="0">
			This page should serve as a place to test a single component that needs debugging. Keep it simple!
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.aerial_60s70s_1}
			fillContainer={false}
		/>
		<JDGImageTile fillContainer={false} href="/about" />
	</JDGContentBoxFloating>
</JDGContentContainer>
