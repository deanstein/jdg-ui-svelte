<script>
	import { accentColors, appFont } from '$lib/states/ui-state.js';
	import { adjustColorForContrast } from '$lib/jdg-utils.js';

	import { JDGAccentBlock, JDGAccentText } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// pass-through all the props from accent text
	export let isQuote = false;
	export let superText = undefined;
	export let superTextFontFamily = $appFont;
	export let superTextBold = false;
	export let primaryText = undefined;
	export let primaryTextFontFamily = $appFont;
	export let primaryTextBold = false;
	export let secondaryText = undefined;
	export let secondaryTextFontFamily = $appFont;
	export let secondaryTextBold = false;
	export let textColor = jdgColors.textDm;
	// pass-through all the props from accent block
	export let backgroundColor = $accentColors[0];
</script>

<!-- this combo of AccentBlock and AccentText always ensures the right background color for given text color -->
<JDGAccentBlock backgroundColor={adjustColorForContrast(backgroundColor, textColor)}>
	<JDGAccentText
		{isQuote}
		{superText}
		{superTextFontFamily}
		{superTextBold}
		{primaryText}
		{primaryTextBold}
		{primaryTextFontFamily}
		{secondaryText}
		{secondaryTextBold}
		{secondaryTextFontFamily}
		{textColor}
	></JDGAccentText>
</JDGAccentBlock>
