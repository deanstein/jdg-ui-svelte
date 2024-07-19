<script>
	import { openUrl, scrollToAnchor } from '$lib/jdg-utils.js';

	import uiState from '$lib/states/ui-state.js';

	import {
		JDGAccentBlock,
		JDGAccentBlockWithText,
		JDGAccentText,
		JDGBodyCopy,
		JDGButton,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFeatureCard,
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageCompare,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile,
		JDGJumpTo,
		JDGUpNext
	} from '$lib/index.js';

	import { imageAttributesCollection } from './image-attributes-collection.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	let isTestButtonEnabled = true;
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
	<JDGJumpTo />
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
	<JDGContentBoxFloating title="BODY COPY">
		<JDGBodyCopy textColor="#7C5353">
			This JDGBodyCopy has a text color override. And a <a href="./">hyperlink for testing!</a> The hyperlink
			should have the same color as the text.
		</JDGBodyCopy>
		<JDGBodyCopy textColor="#484848" simpleHyperlinkStyle={true}>
			This JDGBodyCopy has a text color override and simple hyperlinks. And a <a href="./"
				>hyperlink for testing!</a
			> The hyperlink should remain the "simple hyperlink" color.
		</JDGBodyCopy>
		<JDGBodyCopy>
			This body copy has <a href="./about">regular hyperlink styles</a>. They're useful for short
			words, no more than a <a href="./about">few at a time</a>.
		</JDGBodyCopy>
		<JDGBodyCopy simpleHyperlinkStyle={true}>
			This body copy has <a href="./about">simplified hyperlink styles</a>. These are useful for
			<a href="./about">longer sections of text which might be hyperlinks but could also wrap</a>.
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
	<JDGContentBoxFloating title="BUTTONS">
		<JDGBodyCopy textAlign="center" paddingTop="0" paddingBottom="0">Varying widths:</JDGBodyCopy>
		<div
			style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;"
		>
			<JDGButton onClickFunction={() => {}} label="This is a primary button" />
			<JDGButton
				onClickFunction={() => {
					scrollToAnchor('background');
				}}
				label="This button has no icon, and scrolls to an anchor"
				faIcon={null}
			/>
			<JDGButton
				onClickFunction={() => {}}
				label="This is a secondary button"
				backgroundColor={jdgColors.buttonSecondaryBackground}
				isPrimary={false}
			/>
			<JDGButton
				onClickFunction={() => {}}
				label="This is a custom button"
				backgroundColor={jdgColors.accentColorsJDG[1]}
			/>
			<JDGButton onClickFunction={() => {}} label="This is a disabled button" isEnabled={false} />
			<JDGButton
				onClickFunction={() => {
					isTestButtonEnabled = !isTestButtonEnabled;
				}}
				label="This button will disable when clicked"
				isEnabled={isTestButtonEnabled}
			/>
		</div>
		<JDGBodyCopy textAlign="center" paddingBottom="0">Consistent width:</JDGBodyCopy>
		<div
			style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;"
		>
			<JDGButton onClickFunction={() => {}} label="This is a primary button" width="300px" />
			<JDGButton
				onClickFunction={() => {}}
				label="This is a secondary button"
				isPrimary={false}
				backgroundColor={jdgColors.buttonSecondaryBackground}
				width="300px"
			/>
		</div>
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
	<JDGContentBoxFloating title="IMAGE COMPARE">
		<JDGBodyCopy textAlign="center">ImageCompare in GridLayout</JDGBodyCopy>
		<JDGGridLayout maxColumns={2}>
			<div style="display: flex; flex-basis: auto;">
				<JDGImageTile
					imageAttributes={imageAttributesCollection.cc_1}
					fillContainer={false}
					showCaption={false}
					showAttribution={false}
					maxHeight="400px"
				/>
			</div>
			<div style="display: flex; flex-basis: auto;">
				<JDGImageCompare
					imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
					imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
					animateSlider={true}
					useFullWidthAnimation={true}
					maxHeight="400px"
					showBlurInUnfilledSpace={false}
				/>
			</div>
		</JDGGridLayout>
		<JDGGridLayout maxColumns={2}>
			<div style="display: flex; flex-basis: auto;">
				<JDGImageCompare
					imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
					imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
					animateSlider={true}
					useFullWidthAnimation={true}
					maxHeight="400px"
					showBlurInUnfilledSpace={false}
				/>
			</div>
			<div style="display: flex; flex-basis: auto;">
				<JDGImageTile
					imageAttributes={imageAttributesCollection.cc_1}
					fillContainer={false}
					showCaption={false}
					showAttribution={false}
					maxHeight="400px"
				/>
			</div>
		</JDGGridLayout>
		<JDGBodyCopy textAlign="center">ImageCompare in FullWidthContainer</JDGBodyCopy>
		<JDGFullWidthContainer>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={true}
				useFullWidthAnimation={false}
				caption="Gold Mall simulated in 1968-1978 and 1987-1997. And this is an even longer caption to test a possible failure case."
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
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="IMAGE CAROUSEL">
		<JDGFullWidthContainer>
			<JDGImageCarousel
				imageAttributeObjects={[
					imageAttributesCollection.fairgrounds_aerial,
					imageAttributesCollection.speer_point_after
				]}
			/>
		</JDGFullWidthContainer>
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
			href="./about"
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
	<JDGContentBoxFloating title="LONG SECTION NAME">
		<JDGImageFullWidth imageAttributes={imageAttributesCollection.aerial_60s70s_1} />
	</JDGContentBoxFloating>
	<JDGUpNext
		item1Label={'LEARN MORE ABOUT THE PROJECT'}
		item1Href={'./about'}
		item1ImageAttributes={imageAttributesCollection.cc_1}
		item2Label={'READ THE FULL HISTORY'}
		item2Href="./history"
		item2ImageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
		item3Label="EXPERIENCE THE SIMULATION"
		item3Href="./simulation"
		item3ImageAttributes={imageAttributesCollection.ccp_blue_mall_80s90s_1}
	/>
</JDGContentContainer>
