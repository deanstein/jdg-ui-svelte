<script>
	import { accentColors } from '$lib/states/ui-state.js';
	import { scrollToAnchor } from '$lib/jdg-utils.js';

	import {
		JDGAccentBlock,
		JDGAccentBlockWithText,
		JDGAccentText,
		JDGBodyCopy,
		JDGButton,
		JDGClipFade,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFeatureCard,
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImage,
		JDGImageCarousel,
		JDGImageCompare,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile,
		JDGJumpTo,
		JDGUpNext
	} from '$lib/index.js';
	import { jdgColors, jdgFonts } from '$lib/jdg-shared-styles.js';

	import { imageAttributesCollection } from './image-attributes-collection.js';

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
		<JDGContentBoxFloating animateWhenVisible={false}>
			<JDGBodyCopy fontSizeMultiplier={1.15}>
				<strong>JDG SVELTE UI</strong> is an in-progress UI framework by
				<a href="./about">Joshua Dean Goldstein.</a>
				<br /><br />
				Standard usages and tests of components are below.
				<br /><br />
				Enjoy!
			</JDGBodyCopy>
		</JDGContentBoxFloating>
	</div>
	<JDGJumpTo />
	<JDGContentBoxFloating title="IMAGES">
		<JDGBodyCopy textAlign="center" paddingTop="0">We've got lots of image components!</JDGBodyCopy>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE</b>
			<br />
			No fill container, show blur, show caption/attribution
			<br />
			Inside BodyCopy
			<br /><br />
			<JDGImage
				imageAttributes={imageAttributesCollection.lakeside_1}
				cropToFillContainer={false}
				showBlurInUnfilledSpace={false}
				showCaption
				showAttribution
				useCompactHeightOnMobile
			/>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE</b>
			<br />
			This is a .gif, and won't get the height or width optimized if it's Cloudinary (for some reason,
			that causes an error).
		</JDGBodyCopy>
		<JDGImage
			imageAttributes={imageAttributesCollection.exp.ranch_elsie_optioneering}
			maxHeight="600px"
			cropToFillContainer={false}
			showBlurInUnfilledSpace={false}
			showCaption={true}
		/>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE TILE</b>
			<br />
			No fill container, show blur, show caption/attribution
			<br />
			Inside BodyCopy
			<br /><br />
			<JDGImageTile
				imageAttributes={imageAttributesCollection.lakeside_1}
				cropToFillContainer={false}
				showBlurInUnfilledSpace={true}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE TILE</b>
			<br />
			No fill container, no blur in unfilled space
			<br />
			Inside BodyCopy
			<br /><br />
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				cropToFillContainer={false}
				showCaption={true}
				showAttribution={true}
			/>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			No fill container, no blur in unfilled space, no caption/attr
			<br />
			Clicking goes to "./about"
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.aerial_60s70s_1}
			cropToFillContainer={false}
			href="./about"
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			Clicking goes to Google but in a new tab.
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.aerial_60s70s_1}
			cropToFillContainer={false}
			href="https://www.google.com"
			hrefOpenInNewTab={true}
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			No blur allowed in imageAttributes
		</JDGBodyCopy>
		<JDGImageTile
			imageAttributes={imageAttributesCollection.hst.fms_2000s_plan_additions}
			cropToFillContainer={false}
			showCaption={true}
			showAttribution={true}
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0"><b>IMAGE FULL WIDTH</b></JDGBodyCopy>
		<JDGImageFullWidth imageAttributes={imageAttributesCollection.aerial_60s70s_1} />
		<JDGBodyCopy textAlign="center" paddingBottom="0"
			><b>IMAGE CAROUSEL</b>
			<br />
			in a full-width container</JDGBodyCopy
		>
		<JDGFullWidthContainer>
			<JDGImageCarousel
				imageAttributeObjects={[
					imageAttributesCollection.fairgrounds_aerial,
					imageAttributesCollection.speer_point_after
				]}
			/>
		</JDGFullWidthContainer>
		<JDGBodyCopy textAlign="center" paddingBottom="0"
			><b>IMAGE COMPARE</b>
			<br />
			in a full-width container</JDGBodyCopy
		>
		<JDGFullWidthContainer>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={false}
				caption="Gold Mall simulated in 1968-1978 and 1987-1997. And this is an even longer caption to test a possible failure case."
				maxHeight="60vh"
				showBlurInUnfilledSpace={true}
			/>
		</JDGFullWidthContainer>
	</JDGContentBoxFloating>

	<JDGContentBoxFloating title="GRID LAYOUTS">
		<JDGBodyCopy textAlign="center" paddingBottom="0" paddingTop="0">
			<b>2 ITEMS</b>
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.ehs_1920_broadway_northeast}
				showCaption={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.fms_2013_broadway_northeast}
				showCaption={true}
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_blue_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_blue_mall_80s90s_1}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
				cropToFillContainer={false}
				maxHeight="400px"
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.cc_2}
				cropToFillContainer={false}
				showCaption={true}
				showAttribution={false}
				maxHeight="400px"
			/>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageCompare
				imageAttributes1={imageAttributesCollection.ccp_gold_mall_60s70s_1}
				imageAttributes2={imageAttributesCollection.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.cc_1}
				cropToFillContainer={false}
				showCaption={true}
				showAttribution={false}
				maxHeight="400px"
			/>
		</JDGGridLayout>
		<JDGImageHybridGridCarousel
			imageAttributeObjects={[
				imageAttributesCollection.hst.ehs_1919_plan,
				imageAttributesCollection.hst.fms_2000s_plan_additions
			]}
			cropToFillContainer={false}
		/>
		<JDGBodyCopy paddingBottom="0" textAlign="center"
			><b>3+ ITEMS</b>
			<br />
			compactModeOnMobile true:</JDGBodyCopy
		>
		ClipFade Test
		<JDGClipFade>
			<JDGGridLayout>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.aerial_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.cc_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.architecture_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.rose_mall_60s70s_2}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.aerial_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.cc_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.architecture_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.rose_mall_60s70s_2}
					showCaption={true}
					showAttribution={true}
				/>
			</JDGGridLayout>
		</JDGClipFade>
		<JDGBodyCopy paddingBottom="0" textAlign="center">
			<b>3+ ITEMS</b>
			<br />
			compactModeOnMobile false:</JDGBodyCopy
		>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.aerial_60s70s_1}
				useCompactHeightOnMobile={false}
				label={'A LABEL WITH BODY FONT'}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.cc_1}
				useCompactHeightOnMobile={false}
				label={'A LABEL WITH A RETRO FONT'}
				labelFontFamily={jdgFonts.righteous}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.architecture_1}
				useCompactHeightOnMobile={false}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
				useCompactHeightOnMobile={false}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_2}
				useCompactHeightOnMobile={false}
			/>
		</JDGGridLayout>
		<JDGBodyCopy paddingBottom="0" textAlign="center">
			<b>HYBRID GRID/CAROUSEL</b>
			<br />
			<b>3+ ITEMS</b>
			<br />
			(will become ImageCarousel on smallest breakpoint)
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
	<JDGContentBoxFloating title="ACCENT BLOCKS">
		<JDGBodyCopy textAlign="center">
			Accent blocks can be used with a couple of different approaches:
		</JDGBodyCopy>
		<hr />
		<h2 style="text-align: center;">Composite, high-contrast</h2>
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
		<hr />
		<h2 style="text-align: center;">Manually-assembled</h2>
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
					scrollToAnchor('grid-layouts');
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
		<JDGBodyCopy textAlign="center" paddingBottom="0">Square aspect ratio:</JDGBodyCopy>
		<div
			style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px;"
		>
			<JDGButton
				onClickFunction={() => {}}
				faIcon="fa-solid fa-expand"
				label={null}
				paddingLeftRight={'8px'}
				paddingTopBottom={'8px'}
				backgroundColor={$accentColors[0]}
				tooltip="Expand image"
				doForceSquareRatio
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
				useCompactHeightOnMobile={true}
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
				animateSlider={false}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={true}
			/>
		</JDGFeatureCard>
		<JDGBodyCopy paddingTop="0">
			Displays a colorful rectangle containing an imageTile and description text.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title="NICE TO MEET YOU">
		<JDGBodyCopy textAlign="center" textWrap="balance" paddingTop="0">
			This section tests the floating content box. The title should balance itself thanks to
			text-wrap: balance;.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
	<JDGAccentBlock>
		<JDGAccentText primaryText={`"Another quote."`} secondaryText="Another Someone, 1998" />
	</JDGAccentBlock>
	<JDGAccentBlock backgroundColor={$accentColors[1]}>
		<JDGAccentText
			isQuote={true}
			primaryText={`"The people of the City of Englewood want this mall in their community."`}
			secondaryText="Gerri Von Frellick, 1960"
		/>
	</JDGAccentBlock>
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
