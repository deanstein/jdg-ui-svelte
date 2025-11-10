<script>
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageTile } from '$lib/index.js';
	import { imageMetaRegistry } from '../image-meta-registry.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGImageTile
			imageMeta={imageMetaRegistry.ecc_existing_north}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
		<JDGImageTile
			imageMeta={imageMetaRegistry.cc_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
