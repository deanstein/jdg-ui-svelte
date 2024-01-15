<script>
	import { css } from '@emotion/css';

	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import {
		JDGAccentBlock,
		JDGBackground,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFooter,
		JDGGridLayout,
		JDGHeader,
		JDGImageTile,
		JDGNotificationBanner
	} from '$lib/index.js';

	// get the app version from package.json
	//@ts-expect-error
	const appVersion = packageJson.version;
	const disclaimerMessage =
		'This is a UI library demo site. UI may load slowly and flash while loading because this is using raw UI library components, not compiled code.';

	// global styles, but using emotion css
	const demoContainerCss = css`
		a {
			color: ${jdgColors.text};
		}
		a:before {
			background-color: ${jdgColors.accentStripesJDG[2]};
		}
	`;
</script>

<div class="jdg-ui-demo-container {demoContainerCss}">
	<JDGNotificationBanner message={disclaimerMessage} color={jdgColors.notificationInformation} />

	<JDGHeader logoTitle={'JDG SVELTE UI'} logoSupertitle={'INTRODUCING'} useMobileNav={false} />

	<JDGBackground />

	<JDGContentContainer>
		<JDGContentBoxFloating>
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

	<JDGFooter {appVersion} disclaimer={disclaimerMessage} />
</div>

<style>
	.jdg-ui-demo-container {
		display: flex;
		flex-direction: column;
	}
</style>
