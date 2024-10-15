<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
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
	</JDGContentBoxFloating>
</JDGContentContainer>
