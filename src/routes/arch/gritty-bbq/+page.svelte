<script>
	import { imageMetaCollection } from '../../image-meta-collection.js';
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageCarousel } from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating
		title="GRITTY BARBECUE"
		subtitle="Studies for transforming a derelict duplex into a new restaurant"
	>
		<JDGImageCarousel
			imageMetaSet={[
				imageMetaCollection.arch.gritty_bbq_option_2,
				imageMetaCollection.arch.gritty_bbq_option_3,
				imageMetaCollection.arch.gritty_bbq_option_5
			]}
			maxHeight="600px"
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
