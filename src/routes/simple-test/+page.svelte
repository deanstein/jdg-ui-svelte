<script>
	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageHybridGridCarousel
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="TEST SECTION">
		<JDGImageHybridGridCarousel
			imageAttributeObjects={[
				imageAttributesCollection.hst.ehs_1919_plan,
				imageAttributesCollection.hst.fms_2000s_plan_additions
			]}
			fillContainer={false}
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
