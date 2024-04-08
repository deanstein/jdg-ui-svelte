<script>
	import { openUrl } from '$lib/jdg-ui-management.js';

	import uiState from '$lib/states/ui-state.js';

	import {
		JDGAccentBlock,
		JDGAccentText,
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFullWidthContainer,
		JDGImageCarousel,
		JDGImageCompare,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile,
		JDGGridLayout
	} from '$lib/index.js';
	import imageAttributesCollection from './image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={true} topBottomPadding="0" gap="0">
	<JDGImageFullWidth
		imageAttributes={imageAttributesCollection.cc_1}
		primaryText="STEP BACK IN TIME"
		secondaryText="to Cinderella City Mall"
	/>
	<JDGContentBoxFloating>
		<JDGBodyCopy>
			The <strong>Cinderella City Project</strong> is an examination of a unique mid-century shopping
			destination, developed by its creator as a "city under a roof", which became both a fairtyale and
			a nightmare for the actual city of Englewood, Colorado.
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
		<JDGFullWidthContainer>
			<JDGAccentBlock>
				<JDGAccentText
					primaryText={`Cinderella City's short but explosive life provides lessons \nin retail design, land use, and placemaking.`}
					secondaryText="Some attribution text to test a really long, run-on sentence. Or even a bit of a subtitle!"
				></JDGAccentText>
			</JDGAccentBlock>
		</JDGFullWidthContainer>
		<JDGBodyCopy>
			From concept to details, Cinderella City was unconventional and unexpected. Originally planned
			for another location, it settled on an unwitting community, replacing a beloved park and
			ushering in an era of prosperity never seen in Englewood before.
			<br /><br />
			and its short 30-year life provided lessons in retail design, architecture, and placemaking.
			<br /><br />
			Take a trip into history and see the good, the bad, and the ugly of Cinderella City through
			<a href="./history">historic photographs</a>
			and an accurate digital 3D re-creation called the
			<a href="./simulation">Cinderella City Simulation.</a>
		</JDGBodyCopy>
		<JDGImageCompare />
		<JDGBodyCopy>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.lakeside_1}
				fillContainer={false}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>
		<JDGFullWidthContainer>
			<JDGImageCarousel
				imageAttributeObjects={[
					imageAttributesCollection.cc_1,
					imageAttributesCollection.rose_mall_60s70s_1
				]}
				maxHeight="70vh"
			/>
		</JDGFullWidthContainer>
	</JDGContentBoxFloating>
</JDGContentContainer>
<JDGContentContainer>
	<JDGContentBoxFloating title="ARCHITECTURE">
		<span>
			Some text above.
			<br /><br />
			This is a <a href="#ANOTHER-SECTION">hyperlink test.</a> And these are more words!
			<br /><br />
			Some text below
		</span>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.architecture_1}
				label={'SCROLL EXAMPLE'}
				href="#ANOTHER-SECTION"
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
				label={'IMAGE DETAIL EXAMPLE'}
			/>
			<JDGImageTile
				label={'EXTERNAL EXAMPLE'}
				onClickFunction={() => {
					openUrl('http://www.google.com', true);
				}}
			/>
			<JDGImageTile />
			<JDGImageTile />
		</JDGGridLayout>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="TEST SECTION">
		<JDGImageTile
			imageAttributes={imageAttributesCollection.aerial_60s70s_1}
			fillContainer={false}
		/>
		<JDGImageTile fillContainer={false} href="/about" />
	</JDGContentBoxFloating>
	<JDGAccentBlock>
		<JDGAccentText primaryText={`"Another quote."`} secondaryText="Another Someone, 1998" />
	</JDGAccentBlock>
	<JDGContentBoxFloating title="ANOTHER SECTION">
		<JDGBodyCopy>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.lakeside_1}
				fillContainer={false}
				showBlurInUnfilledSpace={true}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>
		<JDGBodyCopy>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				fillContainer={false}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGAccentBlock backgroundColor={$uiState.accentColors[1]}>
		<JDGAccentText
			primaryText={`"The people of the City of Englewood want this mall in their community."`}
			secondaryText="Gerri Von Frellick, 1960"
		/>
	</JDGAccentBlock>
	<JDGContentBoxFloating title="A THIRD SECTION" />
	<JDGAccentBlock backgroundColor={$uiState.accentColors[2]} />
	<JDGContentBoxFloating title="A FOURTH SECTION" />
</JDGContentContainer>
