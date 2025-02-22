<script>
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageTile } from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.ecc_existing_north}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.cc_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
