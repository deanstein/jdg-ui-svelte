<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageCompare,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="TEST SECTION">
		<!-- <JDGGridLayout>
			<JDGImageTile />
			<JDGImageTile />
			<JDGImageTile />
		</JDGGridLayout> -->

		<JDGImageFullWidth
			imageAttributes={imageAttributesCollection.cc_1}
			showOverlay={true}
			overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
			overlayImageText="A Secondary Text Test"
			overlayImageTextFontFamily="Righteous"
			overlapWithHeader={true}
		/>

		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.fairgrounds_aerial,
				imageAttributesCollection.rose_mall_60s70s_2
			]}
		/>

		<JDGImageHybridGridCarousel
			imageAttributeObjects={[
				imageAttributesCollection.aerial_60s70s_1,
				imageAttributesCollection.cc_1,
				imageAttributesCollection.architecture_1,
				imageAttributesCollection.rose_mall_60s70s_1,
				imageAttributesCollection.rose_mall_60s70s_2
			]}
		/>

		<JDGBodyCopy>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.lakeside_1}
				fillContainer={false}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>

		<div style="display: flex; flex-direction: column;">
			<!-- <JDGContentBoxFloating>
					<JDGBodyCopy fontSizeMultiplier={1.15}>
						The <strong>Cinderella City Project</strong> is an examination of a unique mid-century
						shopping destination, developed by its creator as a "city under a roof", which became both a
						fairtyale and a nightmare for the actual city of Englewood, Colorado.
						<br /><br />
						There's even more to the story. <a href="./history">Read Cinderella City's history</a>.
					</JDGBodyCopy>
					<JDGImageHybridGridCarousel
						imageAttributeObjects={[
							imageAttributesCollection.aerial_60s70s_1,
							imageAttributesCollection.cc_1,
							imageAttributesCollection.architecture_1,
							imageAttributesCollection.rose_mall_60s70s_1,
							imageAttributesCollection.rose_mall_60s70s_2
						]}
					/>
				</JDGContentBoxFloating> -->
			<!-- <JDGBodyCopy paddingTop="0">
			This page should serve as a place to test a single component that needs debugging. Keep it
			simple!
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.fairgrounds_aerial}
			fillContainer={false}
		/>
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.fairgrounds_aerial,
				imageAttributesCollection.rose_mall_60s70s_2
			]}
		/> -->

			<!-- <JDGGridLayout maxColumns={2}>
			<div style="display: grid; max-width: fit-content;">
				<JDGImageCompare
					imageAttributes1={imageAttributesCollection.ccp_blue_mall_60s70s_1}
					imageAttributes2={imageAttributesCollection.ccp_blue_mall_80s90s_1}
					maxHeight="400px"
					showBlurInUnfilledSpace={false}
				/>
			</div>
			<div style="display: grid; max-width: fit-content;">
				<JDGImageTile
					imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
					fillContainer={false}
					maxHeight="400px"
				/>
			</div>
		</JDGGridLayout> -->
		</div></JDGContentBoxFloating
	>
</JDGContentContainer>
