<script>
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import {
		JDGAccentBlock,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImageTile
	} from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="SECTION TITLE">
		<div>
			This is a <a href="www.google.com">hyperlink test.</a>
		</div>
		<JDGGridLayout>
			<JDGImageTile label={'SOME PROJECT 1'} />
			<JDGImageTile label={'SOME PROJECT 2'} />
			<JDGImageTile />
			<JDGImageTile />
			<JDGImageTile />
		</JDGGridLayout>
	</JDGContentBoxFloating>
	<JDGAccentBlock blockQuote="This is a block quote." />
	<JDGContentBoxFloating />
	<JDGAccentBlock
		blockQuote="This is another block quote."
		backgroundColor={jdgColors.accentStripesJDG[1]}
	/>
</JDGContentContainer>
