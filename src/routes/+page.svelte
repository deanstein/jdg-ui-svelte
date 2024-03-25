<script>
	import { setImageDetailAttributes, setShowImageDetailModal } from '$lib/jdg-state-management.js';
	import { openUrl } from '$lib/jdg-ui-management.js';

	import uiState from '$lib/states/ui-state.js';

	import {
		JDGAccentBlock,
		JDGAccentText,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageFullWidth,
		JDGImageTile,
		JDGGridLayout,
		JDGImageCarousel
	} from '$lib/index.js';
	import imageAttributesCollection from './image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={true} topBottomPadding="0" gap="0">
	<JDGImageFullWidth
		imageAttributes={imageAttributesCollection.get('cc-1')}
		primaryText="STEP BACK IN TIME"
		secondaryText="to Cinderella City Mall"
	/>
	<JDGContentBoxFloating isForBodyCopy={true}>
		In 1968, Englewood changed forever when mall magnate Gerri Von Frellick opened a 1.35
		million-square foot shopping center on the site of Englewood’s beloved City Park. Cinderella
		City was more than a mall - it was a city under a roof, and a novel precursor to today’s
		mixed-use retail developments.
		<br /><br />
		Not all fairytales last, and Cinderella City eventually fell on hard times. Modernization in the
		1980s helped somewhat, but the mall eventually closed with just one store left. The City of Englewood
		redeveloped the mall in 1998, resulting in the City Center you’re standing in today.
		<br /><br />
		But the legend lives on! Cinderella City is being brought back to life virtually as an interactive
		exhibit known as The Cinderella City Project - an accurate simulation of the mall which transports
		visitors back in time to the mall’s two distinct periods: 1968-1987, and 1988-1997.
		<br /><br />
		Follow along as we dive into Cinderella City’s fairytale from beginning to end, including rare photos
		and little-known details of each mall.
		<span>
			The Cinderella City Project is an examination of a unique mid-century shopping destination,
			developed by its creator as a "city under a roof", which became both a fairtyale and a
			nightmare for its actual city: Englewood, Colorado.
			<br /><br />
			<JDGImageTile
				maxHeight="400px"
				imageAttributes={imageAttributesCollection.get('aerial-60s70s-1')}
				onClickFunction={() => {
					setShowImageDetailModal(true);
					setImageDetailAttributes(imageAttributesCollection.get('aerial-60s70s-1'));
				}}
				fillContainer={false}
			/>
			<br /><br />
			From concept to layout, Cinderella City was quirky, thematic, and unconventional in its every detail,
			and its short 30-year life provided lessons in retail design, architecture, and placemaking.
			<br /><br />
			Take a trip into history and see the good, the bad, and the ugly of Cinderella City through
			<a href="./history">historic photographs</a>
			and an accurate digital 3D re-creation called the
			<a href="./simulation">Cinderella City Simulation.</a>
		</span>
		<JDGImageCarousel
			imageAttributeObjects={[
				imageAttributesCollection.get('cc-1'),
				imageAttributesCollection.get('rose-mall-60s70s-1')
			]}
		/>
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
				imageAttributes={imageAttributesCollection.get('architecture-1')}
				label={'SCROLL EXAMPLE'}
				href="#ANOTHER-SECTION"
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.get('rose-mall-60s70s-1')}
				label={'IMAGE DETAIL EXAMPLE'}
				onClickFunction={() => {
					setShowImageDetailModal(true);
					setImageDetailAttributes(imageAttributesCollection.get('rose-mall-60s70s-1'));
				}}
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
	<JDGContentBoxFloating title="TEST SECTION" isForBodyCopy={true}>
		<JDGImageTile
			onClickFunction={() => {
				setShowImageDetailModal(true);
				setImageDetailAttributes(imageAttributesCollection.get('aerial-60s70s-1'));
			}}
			imageAttributes={imageAttributesCollection.get('aerial-60s70s-1')}
			fillContainer={false}
		/>
		<JDGImageTile fillContainer={false} href="/about" />
	</JDGContentBoxFloating>
	<JDGAccentBlock>
		<JDGAccentText primaryText={`"Another quote."`} secondaryText="Another Someone, 1998" />
	</JDGAccentBlock>
	<JDGContentBoxFloating title="ANOTHER SECTION" isForBodyCopy={true}>
		<JDGImageTile
			onClickFunction={() => {
				setShowImageDetailModal(true);
				setImageDetailAttributes(imageAttributesCollection.get('lakeside-1'));
			}}
			imageAttributes={imageAttributesCollection.get('lakeside-1')}
			fillContainer={false}
			showBlurInUnfilledSpace={true}
		/>
		<JDGImageTile
			onClickFunction={() => {
				setShowImageDetailModal(true);
				setImageDetailAttributes(imageAttributesCollection.get('aerial-60s70s-1'));
			}}
			imageAttributes={imageAttributesCollection.get('aerial-60s70s-1')}
			fillContainer={false}
		/>
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
