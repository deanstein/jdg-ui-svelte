<script>
	import { jdgColors, jdgSizes } from '$lib/jdg-styling-constants.js';
	import {
		JDGAccentBlock,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGImageFullWidth,
		JDGImageTile,
		JDGGridLayout
	} from '$lib/index.js';
	import { openUrl, scrollToAnchorFloatingContentBox } from '$lib/jdg-ui-management.js';
</script>

<JDGContentContainer overlapWithHeader={true} topBottomPadding="0" gap="0">
	<JDGImageFullWidth />
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
	</JDGContentBoxFloating>
</JDGContentContainer>
<JDGContentContainer>
	<JDGContentBoxFloating title="ARCHITECTURE">
		<div>
			This is a <a href="#ANOTHER-SECTION">hyperlink test.</a>
		</div>
		<JDGGridLayout>
			<JDGImageTile
				imgSrc={'./project-tiles/architecture.jpg'}
				label={'SCROLL EXAMPLE'}
				onClickFunction={() => {
					scrollToAnchorFloatingContentBox('ANOTHER-SECTION');
				}}
			/>
			<JDGImageTile label={'PAGE EXAMPLE'} href="/about" />
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
	<JDGContentBoxFloating isForBodyCopy={true}>
		<JDGImageTile aspectRatio="1.77" label={'PAGE EXAMPLE'} href="/about" />
	</JDGContentBoxFloating>
	<JDGAccentBlock blockQuote="This is a block quote." />
	<JDGContentBoxFloating title="ANOTHER SECTION" />
	<JDGAccentBlock
		blockQuote="This is another block quote."
		backgroundColor={jdgColors.accentStripesJDG[1]}
	/>
	<JDGContentBoxFloating title="A THIRD SECTION" />
	<JDGAccentBlock
		blockQuote="This is another block quote."
		backgroundColor={jdgColors.accentStripesJDG[0]}
	/>
	<JDGContentBoxFloating title="A FOURTH SECTION" />
</JDGContentContainer>
