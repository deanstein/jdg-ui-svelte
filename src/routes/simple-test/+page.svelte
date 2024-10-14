<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageCarousel,
		JDGMetaTags
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
	import sharedStrings from '../shared-strings.js';
</script>

<JDGMetaTags
	title1={sharedStrings.websiteTitle}
	title2={'Simple Test'}
	description={sharedStrings.websiteDescription}
/>
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
