<script>
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageTile } from '$lib/index.js';
	import { imageMetaCollection } from '../image-meta-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGImageTile
			imageMeta={imageMetaCollection.ecc_existing_north}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
		<JDGImageTile
			imageMeta={imageMetaCollection.cc_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
