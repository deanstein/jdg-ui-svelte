<script>
	import { colorMode } from '$lib/stores/jdg-ui-store.js';
	import { JDGButton } from '$lib/index.js';
	import { themeColors } from '$lib/jdg-shared-styles.js';

	function toggleColorMode() {
		colorMode.set($colorMode === 'dark' ? 'light' : 'dark');
	}
</script>

<JDGButton
	onClickFunction={toggleColorMode}
	label={null}
	faIcon={$colorMode === 'dark' ? 'fa-sun' : 'fa-moon'}
	faClass="fa-solid"
	backgroundColor="transparent"
	textColor={$themeColors.text}
	textColorHover={$themeColors.text}
	backgroundColorHover="transparent"
	doAdjustBackgroundColorForContrast={false}
	shadow={false}
	fontSize="1rem"
	paddingTopBottom="0"
	paddingLeftRight="0"
	tooltip={$colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
/>
