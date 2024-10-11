<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageTile,
		JDGJumpTo
	} from '$lib/index.js';
	import { jdgSharedUrls } from '$lib/jdg-shared-strings.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGJumpTo />
	<JDGContentBoxFloating title="BACKGROUND">
		<JDGBodyCopy paddingTop="0" paddingBottom="0">
			In 1998, a young <a href={jdgSharedUrls.jdgLinkedIn}>Josh Goldstein</a> was in his parents' car
			when they passed by a vast and shocking demolition site in Englewood, Colorado.
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.ccp_blue_mall_60s70s_1}
			cropToFillContainer={false}
			showCaption={true}
			maxHeight="40vh"
			showDebugOverlay
		/>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.hst.fms_2000s_plan_additions}
			cropToFillContainer={false}
			showCaption={true}
			showAttribution={true}
			showDebugOverlay
		/>
		<JDGBodyCopy>
			The hulking expanse of a partially-demolished structure and its surrounding parking deck was
			jarring, providing eerie views into cavernous spaces of a once-thriving place. Josh asked his
			parents what he was seeing and they described the former magic of a defunct shopping center
			called
			<a href="./history">Cinderella City Mall</a>.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
</JDGContentContainer>
