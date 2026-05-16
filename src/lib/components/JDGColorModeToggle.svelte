<script>
	import {
		appAccentColors,
		colorMode,
		colorModeSetting,
		COLOR_MODE_STORAGE_KEY
	} from '$lib/stores/jdg-ui-store.js';
	import { JDGButton } from '$lib/index.js';
	import { themeColors } from '$lib/jdg-shared-styles.js';

	export let fontSize = '1rem';

	const states = ['auto', 'light', 'dark'];

	const icons = {
		auto: 'fa-circle-half-stroke',
		light: 'fa-sun',
		dark: 'fa-moon'
	};

	const labels = {
		auto: 'Auto (OS)',
		light: 'Light',
		dark: 'Dark'
	};

	$: hoverColor = $appAccentColors?.[0] ?? $themeColors.text;

	function cycleColorMode() {
		const currentIndex = states.indexOf($colorModeSetting);
		const next = states[(currentIndex + 1) % states.length];

		colorModeSetting.set(next);
		try {
			localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
		} catch {}

		if (next === 'auto') {
			const isDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
			colorMode.set(isDark ? 'dark' : 'light');
		} else {
			colorMode.set(next);
		}
	}
</script>

<JDGButton
	onClickFunction={cycleColorMode}
	label={null}
	faIcon={icons[$colorModeSetting]}
	faClass="fa-solid"
	backgroundColor="transparent"
	textColor={$themeColors.text}
	textColorHover={hoverColor}
	backgroundColorHover="transparent"
	doAdjustBackgroundColorForContrast={false}
	shadow={false}
	{fontSize}
	paddingTopBottom="0"
	paddingLeftRight="0"
	tooltip="{labels[$colorModeSetting]} mode - click to change"
/>
