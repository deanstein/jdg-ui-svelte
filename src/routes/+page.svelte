<script>
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import {
		JDGAccentBlock,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImageTile
	} from '$lib/index.js';
	import { openUrl, scrollToAnchorFloatingContentBox } from '$lib/jdg-ui-management.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="ARCHITECTURE">
		<div>
			This is a <a href="#ANOTHER-SECTION">hyperlink test.</a>
		</div>
		<JDGGridLayout>
			<JDGImageTile
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
