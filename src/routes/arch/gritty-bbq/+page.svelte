<script>
	import { imageAttributesCollection } from '../../image-attributes-collection.js';
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageCarousel } from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating
		title="GRITTY BARBECUE"
		subtitle="Studies for transforming a derelict duplex into a new restaurant"
	>
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.arch.gritty_bbq_option_2,
				imageAttributesCollection.arch.gritty_bbq_option_3,
				imageAttributesCollection.arch.gritty_bbq_option_5
			]}
			maxHeight="600px"
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
