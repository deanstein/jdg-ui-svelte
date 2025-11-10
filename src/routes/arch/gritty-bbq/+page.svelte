<script>
	import { imageMetaRegistry } from '../../image-meta-registry.js';
	import { JDGContentBoxFloating, JDGContentContainer, JDGImageCarousel } from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating
		title="GRITTY BARBECUE"
		subtitle="Studies for transforming a derelict duplex into a new restaurant"
	>
		<JDGImageCarousel
			imageMetaSet={[
				imageMetaRegistry.arch.gritty_bbq_option_2,
				imageMetaRegistry.arch.gritty_bbq_option_3,
				imageMetaRegistry.arch.gritty_bbq_option_5
			]}
			maxHeight="600px"
		/>
	</JDGContentBoxFloating>
</JDGContentContainer>
