<script>
	import imageMetaRegistry from '../image-meta-registry.js';

	import {
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFullWidthContainer,
		JDGImageCompare,
		JDGImageTile
	} from '$lib/index.js';
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating>
		<JDGImageTile
			imageMeta={imageMetaRegistry.ccm._1967_blue_mall_interior_rendering}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
		<JDGImageTile
			imageMeta={imageMetaRegistry.swe.ccp_1}
			showCaption={true}
			showAttribution={true}
			cropToFillContainer={false}
		/>
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
		<JDGFullWidthContainer>
			<JDGImageCompare
				imageMeta1={imageMetaRegistry.ccp_gold_mall_60s70s_1}
				imageMeta2={imageMetaRegistry.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={false}
				caption="Gold Mall simulated in 1968-1978 and 1987-1997. And this is an even longer caption to test a possible failure case."
				maxHeight="60vh"
				showBlurInUnfilledSpace={true}
			/>
		</JDGFullWidthContainer>
	</JDGContentBoxFloating>
</JDGContentContainer>
