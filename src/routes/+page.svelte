<script>
	import { appAccentColors } from '$lib/states/ui-state.js';
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
		JDGH3H4,
		JDGImage,
		JDGImageCarousel,
		JDGImageCompare,
		JDGImageFullWidth,
		JDGImageHybridGridCarousel,
		JDGImageTile,
		JDGJumpTo,
		JDGUpNext,
		JDGVersionPackageJson
	} from '$lib/index.js';
	import { jdgBreakpoints, jdgColors, jdgFonts } from '$lib/jdg-shared-styles.js';

	import { imageMetaCollection } from './image-meta-collection.js';
	import { css } from '@emotion/css';
	import {
		ccpWebsiteRepoName,
		familyTreeRepoName,
		jdgRepoOwner,
		jdgUiSvelteRepoName,
		jdgWebsiteRepoName,
		pmx3dWebsiteRepoName
	} from '$lib/jdg-persistence-management.js';

	let isTestButtonEnabled = true;

	const pmxTestCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			flex-direction: row;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			flex-direction: row;
		}
	`;
</script>

<JDGContentContainer overlapWithHeader={true}>
	<div style="display: flex; flex-direction: column;">
		<JDGImageFullWidth
			imageMeta={imageMetaCollection.cc_1}
			showOverlay={true}
			overlayImageAttributes={imageMetaCollection.ccp_ouatacc_white}
			overlayImageText="A Secondary Text Test"
			overlayImageTextFontFamily="Righteous"
			overlapWithHeader={true}
			parallax
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
	<JDGContentBoxFloating title="VERSIONS" animateWhenVisible={false}>
		<JDGBodyCopy paddingTop="0" textAlign="center">
			<b>VersionPackageJson</b>
			<br />
			Gets the version field of the package.json from a repo.
			<br />
			To demo, here's the version of JDG UI SVELTE and all consuming websites:
			<br /><br />
			<div class="repo-package-version-group">
				JDG UI SVELTE
				<div class="repo-package-version">
					<JDGVersionPackageJson
						repoOwner={jdgRepoOwner}
						repoName={jdgUiSvelteRepoName}
						showIfInvalid={false}
					/>
				</div>
			</div>
			<div class="repo-package-version-group">
				JDG WEBSITE
				<div class="repo-package-version">
					<JDGVersionPackageJson
						repoOwner={jdgRepoOwner}
						repoName={jdgWebsiteRepoName}
						showIfInvalid={false}
					/>
				</div>
			</div>
			<div class="repo-package-version-group">
				CCP WEBSITE
				<div class="repo-package-version">
					<JDGVersionPackageJson
						repoOwner={jdgRepoOwner}
						repoName={ccpWebsiteRepoName}
						showIfInvalid={false}
					/>
				</div>
			</div>
			<div class="repo-package-version-group">
				PMX3D WEBSITE
				<div class="repo-package-version">
					<JDGVersionPackageJson
						repoOwner={jdgRepoOwner}
						repoName={pmx3dWebsiteRepoName}
						showIfInvalid={false}
					/>
				</div>
			</div>
			<div class="repo-package-version-group">
				FAMILY TREE
				<div class="repo-package-version">
					<JDGVersionPackageJson
						repoOwner={jdgRepoOwner}
						repoName={familyTreeRepoName}
						showIfInvalid={false}
					/>
				</div>
			</div>
		</JDGBodyCopy>
	</JDGContentBoxFloating>
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
				imageMeta={imageMetaCollection.lakeside_1}
				cropToFillContainer={false}
				showBlurInUnfilledSpace={false}
				showCaption
				showAttribution
				useAutoHeightOnMobile
			/>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center">
			<b>IMAGE</b>
			<br />
			This is a .gif, and won't get the height or width optimized if it's Cloudinary (for some reason,
			that causes an error).
		</JDGBodyCopy>
		<JDGImage
			imageMeta={imageMetaCollection.exp.ranch_elsie_roof_optioneering}
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
				imageMeta={imageMetaCollection.lakeside_1}
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
				imageMeta={imageMetaCollection.rose_mall_60s70s_2}
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
			imageMeta={imageMetaCollection.ecc_existing_north}
			cropToFillContainer={false}
			href="./about"
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			Clicking goes to Google but in a new tab. It also shows a label.
		</JDGBodyCopy>
		<JDGImageTile
			imageMeta={imageMetaCollection.aerial_60s70s_1}
			cropToFillContainer={false}
			href="https://www.google.com"
			hrefOpenInNewTab={true}
			label="THIS OPENS GOOGLE"
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			The label on this ImageTile is centered.
		</JDGBodyCopy>
		<JDGImageTile
			imageMeta={imageMetaCollection.rose_mall_60s70s_1}
			cropToFillContainer={false}
			href="https://www.google.com"
			hrefOpenInNewTab={true}
			label="CENTERED LABEL"
			labelJustification="center"
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			With label and custom label background color. Also has a custom "pre-label."
		</JDGBodyCopy>
		<JDGImageTile
			imageMeta={imageMetaCollection.cc_1}
			cropToFillContainer={false}
			label="THIS IS A LABEL"
			labelColor="rgba(255, 255, 255, 1)"
			labelContainerColor="rgba(50, 100, 255, 0.2)"
			labelContainerBlurSize="5px"
		>
			<div
				style="display: flex; align-items: center; font-weight: thin; color: white; font-family: REM; font-style: italic; padding-left: 17px; padding-right: 2px;"
			>
				#014
			</div></JDGImageTile
		>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<b>IMAGE TILE</b>
			<br />
			No blur allowed in imageMeta
		</JDGBodyCopy>
		<JDGImageTile
			imageMeta={imageMetaCollection.hst.fms_2000s_plan_additions}
			cropToFillContainer={false}
			showCaption={true}
			showAttribution={true}
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0"><b>IMAGE FULL WIDTH</b></JDGBodyCopy>
		<JDGImageFullWidth
			imageMeta={imageMetaCollection.aerial_60s70s_1}
			superText="This is a"
			primaryText="FULL WIDTH IMAGE"
			secondaryText="better known as a HERO image"
			overlayColorRgba={'rgba(100, 100, 100, 0.5)'}
			parallax
		/>
		<JDGBodyCopy textAlign="center" paddingBottom="0"
			><b>IMAGE CAROUSEL</b>
			<br />
			in a full-width container
			<br /><br />
			Note that the 2nd image will not have a blur</JDGBodyCopy
		>
		<JDGFullWidthContainer>
			<JDGImageCarousel
				imageMetaSet={[
					imageMetaCollection.fairgrounds_aerial,
					imageMetaCollection.speer_point_after
				]}
			/>
			<JDGBodyCopy textAlign="center" paddingBottom="0"
				><b>IMAGE CAROUSEL</b>
				<br />
				right-aligned, and in a flex box</JDGBodyCopy
			>
		</JDGFullWidthContainer>
		<div class="pmx-product-container-flex {pmxTestCss}">
			<div class="flex-container-left">
				<JDGImageCarousel
					imageMetaSet={[
						imageMetaCollection.aerial_60s70s_1,
						imageMetaCollection.architecture_1,
						imageMetaCollection.cc_2,
						imageMetaCollection.ccp_blue_mall_60s70s_1,
						imageMetaCollection.fairgrounds_aerial
					]}
					showCaption={false}
					showAttribution={false}
					showBlurInUnfilledSpace={false}
					justifyContent="right"
				/>
			</div>
			<div class="flex-container-right">
				<div class="right-panel-container">
					The Denver Cityscape features over 70 of Denver's most iconic buildings at 1:5280 scale.
					<br /><br />
					Our custom algorithm approximates the building locations based on actual addresses, then adjusts
					their locations on the platform to minimize overlap and maximize visibility.
					<br /><br />
					The Cityscape model is occasionally updated as Denver's skyline changes. Check the version
					number on the bottom of the product and match it with the legend below.
				</div>
			</div>
		</div>
		<JDGBodyCopy textAlign="center" paddingBottom="0"
			><b>IMAGE COMPARE</b>
			<br />
			in a full-width container</JDGBodyCopy
		>
		<JDGFullWidthContainer>
			<JDGImageCompare
				imageMeta1={imageMetaCollection.ccp_gold_mall_60s70s_1}
				imageMeta2={imageMetaCollection.ccp_gold_mall_80s90s_1}
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
				imageMeta={imageMetaCollection.hst.ehs_1920_broadway_northeast}
				showCaption={true}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.hst.fms_2013_broadway_northeast}
				showCaption={true}
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageCompare
				imageMeta1={imageMetaCollection.ccp_blue_mall_60s70s_1}
				imageMeta2={imageMetaCollection.ccp_blue_mall_80s90s_1}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.rose_mall_60s70s_1}
				cropToFillContainer={false}
				maxHeight="400px"
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageTile
				imageMeta={imageMetaCollection.cc_2}
				cropToFillContainer={false}
				showCaption={true}
				showAttribution={false}
				maxHeight="400px"
			/>
			<JDGImageCompare
				imageMeta1={imageMetaCollection.ccp_gold_mall_60s70s_1}
				imageMeta2={imageMetaCollection.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageCompare
				imageMeta1={imageMetaCollection.ccp_gold_mall_60s70s_1}
				imageMeta2={imageMetaCollection.ccp_gold_mall_80s90s_1}
				animateSlider={false}
				useFullWidthAnimation={true}
				maxHeight="400px"
				showBlurInUnfilledSpace={false}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.cc_1}
				cropToFillContainer={false}
				showCaption={true}
				showAttribution={false}
				maxHeight="400px"
			/>
		</JDGGridLayout>
		<JDGImageHybridGridCarousel
			imageMetaSet={[
				imageMetaCollection.hst.ehs_1919_plan,
				imageMetaCollection.hst.fms_2000s_plan_additions
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
					imageMeta={imageMetaCollection.aerial_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.cc_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.architecture_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.rose_mall_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.rose_mall_60s70s_2}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.aerial_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.cc_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.architecture_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile
					imageMeta={imageMetaCollection.rose_mall_60s70s_1}
					showCaption={true}
					showAttribution={true}
				/>
				<JDGImageTile imageMeta={imageMetaCollection.rose_mall_60s70s_2} />
			</JDGGridLayout>
		</JDGClipFade>
		<JDGBodyCopy paddingBottom="0" textAlign="center">
			<b>3+ ITEMS</b>
			<br />
			compactModeOnMobile false:</JDGBodyCopy
		>
		<JDGGridLayout>
			<JDGImageTile
				imageMeta={imageMetaCollection.aerial_60s70s_1}
				useAutoHeightOnMobile={false}
				label={'A LABEL WITH BODY FONT'}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.cc_1}
				useAutoHeightOnMobile={false}
				label={'A LABEL WITH A RETRO FONT'}
				labelFontFamily={jdgFonts.righteous}
			/>
			<JDGImageTile imageMeta={imageMetaCollection.architecture_1} useAutoHeightOnMobile={false} />
			<JDGImageTile
				imageMeta={imageMetaCollection.rose_mall_60s70s_1}
				useAutoHeightOnMobile={false}
			/>
			<JDGImageTile
				imageMeta={imageMetaCollection.rose_mall_60s70s_2}
				useAutoHeightOnMobile={false}
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
			imageMetaSet={[
				imageMetaCollection.aerial_60s70s_1,
				imageMetaCollection.cc_1,
				imageMetaCollection.architecture_1,
				imageMetaCollection.rose_mall_60s70s_1,
				imageMetaCollection.rose_mall_60s70s_2
			]}
		/>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating
		title="TITLES + SUBHEADERS"
		titleColor="#336E68FF"
		subtitle="This is a colorful subtitle"
		subtitleColor="#BF6B6BFF"
	>
		<JDGH3H4 h3String="THIS IS AN H3 STRING" h4String="And this is an h4" />
		<JDGH3H4 h3String="PARAMETRIX3D" h4String="Generative 3D-printed products" />
		<JDGH3H4 h3String="LEGACY ARCHITECTURE" h4String="2012-2015" />
		<JDGH3H4 h3String="CUSTOM ID" h3Id="custom-id-test" h4String="Sets a custom ID for AnchorTag" />
		<JDGBodyCopy>And this is body copy!</JDGBodyCopy>
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
		<JDGBodyCopy paddingTop="0" textAlign="center">
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
		<JDGFullWidthContainer>
			<JDGAccentBlockWithText
				superText={'This is'}
				primaryText={'ANOTHER EXAMPLE'}
				secondaryText={'for fun!'}
				backgroundColor={jdgColors.accentColorsCCP[1]}
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
			<JDGButton onClickFunction={() => {}} label="This is a secondary button" isPrimary={false} />
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
				backgroundColor={$appAccentColors[0]}
				tooltip="Expand image"
				doForceSquareAspect
			/>
			<JDGButton
				onClickFunction={() => {}}
				label={null}
				faIcon={'fa-x'}
				doForceSquareAspect
				isEnabled={isTestButtonEnabled}
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
				imageMeta={imageMetaCollection.ccp_blue_mall_60s70s_1}
				maxHeight={'400px'}
				useAutoHeightOnMobile={true}
			/>
		</JDGFeatureCard>
		<JDGFeatureCard
			featureTitle="INCREDIBLE GAMEPLAY"
			featureDescription="Another really cool feature!"
			imageAlign="right"
			backgroundColor={jdgColors.accentColorsJDG[1]}
		>
			<JDGImageCompare
				imageMeta1={imageMetaCollection.ccp_gold_mall_60s70s_1}
				imageMeta2={imageMetaCollection.ccp_gold_mall_80s90s_1}
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
	<JDGAccentBlock backgroundColor={$appAccentColors[1]}>
		<JDGAccentText
			isQuote={true}
			primaryText={`"The people of the City of Englewood want this mall in their community."`}
			secondaryText="Gerri Von Frellick, 1960"
		/>
	</JDGAccentBlock>
	<JDGUpNext
		item1Label={'LEARN MORE ABOUT THE PROJECT'}
		item1Href={'./about'}
		item1ImageAttributes={imageMetaCollection.cc_1}
		item2Label={'READ THE FULL HISTORY'}
		item2Href="./history"
		item2ImageAttributes={imageMetaCollection.rose_mall_60s70s_1}
		item3Label="EXPERIENCE THE SIMULATION"
		item3Href="./simulation"
		item3ImageAttributes={imageMetaCollection.ccp_blue_mall_80s90s_1}
	/>
</JDGContentContainer>

<style>
	.pmx-product-container-flex {
		display: flex;
		justify-content: center;
		gap: 20px;
		width: 100%;
	}

	.flex-container-left {
		display: flex;
		justify-content: right;
	}

	.flex-container-right {
		flex: 0 0 30%;
	}

	.right-panel-container {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.repo-package-version-group {
		padding: 15px 0 15px 0;
		text-align: center;
	}

	.repo-package-version {
		font-size: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		color: gray;
	}
</style>
