<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="TEST SECTION">
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>
