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
		JDGGridLayout,
		JDGJumpTo,
		JDGAccentBlockWithText,
		JDGFeatureCard
	} from '$lib/index.js';

	import { imageAttributesCollection } from './image-attributes-collection.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';
	import { jdgColors } from '$lib/jdg-styling-constants.js';

	const jumpToNavItems = [
		instantiateObject(jdgNavItem, {
			label: 'BACKGROUND',
			href: '#BACKGROUND'
		}),
		instantiateObject(jdgNavItem, {
			label: 'ARCHITECTURE',
			href: '#ARCHITECTURE'
		}),
		instantiateObject(jdgNavItem, {
			label: 'ACCENT BLOCKS',
			href: '#ACCENT-BLOCK-1'
		})
	];
</script>

<JDGContentContainer overlapWithHeader={true}>
	<div style="display: flex; flex-direction: column;">
		<JDGImageFullWidth
			imageAttributes={imageAttributesCollection.cc_1}
			showOverlay={true}
			overlayImageAttributes={imageAttributesCollection.ccp_ouatacc_white}
			overlayImageText="A Secondary Text Test"
			overlayImageTextFontFamily="Righteous"
			overlapWithHeader={true}
		/>
		<JDGContentBoxFloating>
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
		</JDGContentBoxFloating>
	</div>
	<JDGJumpTo {jumpToNavItems} />
	<JDGContentBoxFloating title="BACKGROUND">
		<JDGBodyCopy paddingTop="0">
			The city of Englewood, Colorado changed forever in 1968 when mall magnate Gerri Von Frellick
			opened a controversial 1.35 million-square foot shopping center on the site of the community's
			beloved City Park.
			<br /><br />
			Dubbed "Cinderella City," Von Frellick's new development was thrust upon an unwitting community
			after a protracted legal battle over its location.
			<br /><br />
			The result was an oversized complex squeezed into an undersized boundary, utilizing a unique M-shaped
			complex broken up into 5 sub-malls, and surrounded by a two-level parking garage.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="ACCENT BLOCK 1" subtitle="Composite, High-Contrast">
		<JDGFullWidthContainer>
			<JDGAccentBlockWithText
				isQuote={true}
				primaryText={`"A very important quote."`}
				secondaryText="- John K. Doe"
			/>
		</JDGFullWidthContainer>
		<JDGBodyCopy paddingTop="0">
			<ul>
				<li>Uses composite component <b>AccentBlockWithText</b></li>
				<li>
					Adjusts the background color automatically for max contrast with the given text color
				</li>
			</ul>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="ACCENT BLOCK 2" subtitle="Manually Assembled">
		<JDGFullWidthContainer>
			<JDGAccentBlock backgroundColor={jdgColors.accentColorsCCP[0]}>
				<JDGAccentText
					primaryText={`This accent text`}
					secondaryText={'demonstrates the no-quote type.'}
				></JDGAccentText>
			</JDGAccentBlock>
		</JDGFullWidthContainer>
		<JDGBodyCopy paddingTop="0">
			<ul>
				<li>Assembled manually using two components: <b>AccentBlock</b> and <b>AccentText</b></li>
				<li>Does <b>not</b> adjust the background color automatically for most contrast</li>
			</ul>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="FEATURE CARD">
		<JDGFeatureCard
			featureTitle="HISTORICALLY ACCURATE"
			featureDescription="Experience Cinderella City Mall in full 3D, complete with accurate architectural details
			and signage based on real photographs and original blueprints of the mall"
			imageAlign="left"
		>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.ccp_blue_mall_60s70s_1}
				maxHeight={'400px'}
				compactModeOnMobile={true}
			/>
		</JDGFeatureCard>
		<JDGFeatureCard
			featureTitle="INCREDIBLE GAMEPLAY"
			featureDescription="Another really cool feature!"
			imageAlign="right"
			backgroundColor={jdgColors.accentColorsJDG[1]}
		>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={true}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={true}
			/>
		</JDGFeatureCard>
		<JDGBodyCopy paddingTop="0">
			Displays a colorful rectangle containing an imageTile and description text.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating>
		<JDGBodyCopy>
			and its short 30-year life provided lessons in retail design, architecture, and placemaking.
			<br /><br />
			Take a trip into history and see the good, the bad, and the ugly of Cinderella City through
			<a href="./history">historic photographs</a>
			and an accurate digital 3D re-creation called the
			<a href="./simulation">Cinderella City Simulation.</a>
		</JDGBodyCopy>

		<JDGFullWidthContainer>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={true}
				useFullWidthAnimation={false}
				caption="Gold Mall simulated in 1968-1978 and 1987-1997."
				maxHeight="60vh"
				showBlurInUnfilledSpace={true}
			/>
		</JDGFullWidthContainer>

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
			isQuote={true}
			primaryText={`"The people of the City of Englewood want this mall in their community."`}
			secondaryText="Gerri Von Frellick, 1960"
		/>
	</JDGAccentBlock>
	<JDGContentBoxFloating title="A THIRD SECTION" />
	<JDGAccentBlock backgroundColor={$uiState.accentColors[2]} />
	<JDGContentBoxFloating title="LONG SECTION NAME" />
	<JDGContentBoxFloating>
		<JDGImageFullWidth imageAttributes={imageAttributesCollection.aerial_60s70s_1} />
	</JDGContentBoxFloating>
</JDGContentContainer>
