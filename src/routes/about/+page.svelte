<script>
	import {
		JDGAccentBlock,
		JDGAccentBlockWithText,
		JDGAccentText,
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFullWidthContainer,
		JDGImageFullWidth,
		JDGJumpTo
	} from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer overlapWithHeader={false} paddingTop="0">
	<JDGImageFullWidth
		imageAttributes={imageAttributesCollection.ccp_gold_mall_80s90s_1}
		showOverlay={true}
		overlayColorRgba="rgba(30, 30, 30, 0.5)"
		primaryText="EXPERIENCE THE FAIRYTALE"
		primaryTextFontFamily="Righteous"
		secondaryText="at the Historic Englewood Museum"
		secondaryTextFontFamily="Righteous"
		overlapWithHeader={false}
	/>
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
</JDGContentContainer>
