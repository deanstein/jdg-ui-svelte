<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		allUiStoreValues,
		appCssHyperlinkSimple,
		clientWidth,
		showDevTools,
		showHeaderStripes
	} from '$lib/stores/jdg-ui-store.js';

	import { getBuildCode } from '$lib/jdg-utils.js';
	import {
		fetchLatestCommitUrl,
		getCommitHistoryUrl,
		jdgRepoOwner,
		jdgUiSvelteRepoName
	} from '$lib/jdg-persistence-management.js';
	import { jdgSharedStrings } from '$lib/jdg-shared-strings.js';
	import { toggleDevTools } from '$lib/jdg-state-management.js';

	import {
		JDGButton,
		JDGDevToolbar,
		JDGStripesHorizontal,
		JDGStoreView,
		JDGGridLayout
	} from '$lib/index.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { allTempStoreValues } from '$lib/stores/jdg-temp-store.js';

	export let repoName = jdgUiSvelteRepoName;
	export let appVersion = undefined;
	export let additionalVersionData = undefined; // optional additional version data, applicable to some sites
	export let copyright = jdgSharedStrings.jdgCopyrightName; // appears after the (C) symbol
	export let copyrightHref = undefined; // optional href for <a> element around copyright name
	export let disclaimer = undefined; // optional disclaimer, applicable to some sites
	export let alignItems = 'left';
	export let backgroundColorRgba = jdgColors.headerBackground;
	export let webAppVersionLabel = 'Website';
	export let doShowShadow = true; // subtle shadow to give the illusion of depth
	export let doShowJdgUiVersion = true;
	export let doShowDevToolsButton = false;

	const divider = '|';

	// for debugging: show additional version info
	const forceShowAdditionalVersionData = false;
	forceShowAdditionalVersionData ??
		(additionalVersionData = `Additional Version: ${additionalVersionData}`);

	// date and number of commits is in this format
	let buildCode = 'yyymmdd.nnn';
	let buildCodeHref = undefined; // href for build code

	// define versions to be shown in the footer
	// @ts-expect-error
	const jdgUiSvelteVersion = packageJson?.dependencies['jdg-ui-svelte']; // jdg-ui-svelte version
	let jdgUiSvelteVersionHref = undefined; // href on jdg-ui-svelte version number
	// @ts-expect-error
	const packageJsonName = packageJson?.name; // this package name
	// @ts-expect-error
	const packageJsonVersion = packageJson?.version; // this package version
	let packageJsonVersionHref = undefined; // href on this package version number

	// ensure the copyright is always the current year
	const copyrightYear = new Date().getFullYear();

	const footerOuterContainerCss = css`
		background-color: ${backgroundColorRgba};
		backdrop-filter: blur(10px);
	`;

	const footerContentContainerCss = css`
		align-items: ${alignItems};
		font-size: ${jdgSizes.fontSizeBodyXSm};
		padding: ${jdgSizes.headerTopBottomPadding} ${jdgSizes.headerSidePadding}
			${jdgSizes.headerTopBottomPadding} ${jdgSizes.headerSidePadding};
		box-shadow: ${doShowShadow ? '-3px -3px 5px rgba(0, 0, 0, 0.3)' : ''};
	`;

	const footerDisclaimerCss = css`
		color: ${jdgColors.textLight};
	`;

	const footerDevToolsCss = css`
		justify-content: ${alignItems};
	`;

	const footerItemCss = css`
		text-align: ${alignItems};
	`;

	// for some reason, with URLs included in state, need to set the width to match clientWidth
	let stateViewCss = css``;
	$: {
		stateViewCss = css`
			width: ${$clientWidth - 20}px;
		`;
	}

	onMount(async () => {
		// get the version of jdg-ui-svelte and this package
		jdgUiSvelteVersionHref = getCommitHistoryUrl(jdgRepoOwner, jdgUiSvelteRepoName);
		packageJsonVersionHref = getCommitHistoryUrl(jdgRepoOwner, repoName);

		// get the build code from the deployment repo
		buildCode = await getBuildCode(repoName);
		buildCodeHref = await fetchLatestCommitUrl(jdgRepoOwner, repoName);
	});
</script>

<footer class="jdg-footer-outer-container {footerOuterContainerCss}">
	<!-- horizontal stripes at top of footer -->
	{#if $showHeaderStripes}
		<JDGStripesHorizontal />
	{/if}
	<div class="footer-content-container {footerContentContainerCss}">
		<!-- slot for any extra content above the copyright -->
		<slot name="footer-slot-top" />
		<!-- copyright row -->
		{#if copyright}
			<div class="footer-row">
				<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
					<!-- wrap copyright in href if provided -->
					{#if copyrightHref}
						© {copyrightYear}
						<a href={copyrightHref}>
							{copyright}
						</a>
						<!-- otherwise just copyright, no href -->
					{:else}
						© {copyrightYear} {copyright}
					{/if}
				</div>
			</div>
		{/if}
		<!-- disclaimer row -->
		{#if disclaimer}
			<div class="footer-row {footerDisclaimerCss}">
				<div class="footer-item {footerItemCss}">
					{disclaimer}
				</div>
			</div>
		{/if}
		<!-- versions row -->
		<div class="footer-row">
			{#if appVersion}
				{#if additionalVersionData || doShowJdgUiVersion}
					<!-- version of this app or website -->
					<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
						{webAppVersionLabel}: <a href={packageJsonVersionHref} target="_blank">v{appVersion}</a>
					</div>
				{:else}
					<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
						v{appVersion}
					</div>
				{/if}
			{/if}
			<!-- version of jdg-ui-svelte package -->
			{#if doShowJdgUiVersion}
				<div>{divider}</div>
				<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
					JDG UI: <a href={jdgUiSvelteVersionHref} target="_blank"
						>v{packageJsonName === jdgUiSvelteRepoName ? packageJsonVersion : jdgUiSvelteVersion}</a
					>
				</div>
			{/if}
			<!-- optional: additional version data -->
			{#if additionalVersionData}
				<div>{divider}</div>
				<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
					{additionalVersionData}
				</div>
			{/if}
			<div>{divider}</div>
			<!-- latest buid code -->
			<div class="footer-item {footerItemCss} {$appCssHyperlinkSimple}">
				{#if additionalVersionData || doShowJdgUiVersion}
					Build: <a href={buildCodeHref} target="_blank">{buildCode}</a>
				{:else}
					<a href={buildCodeHref} target="_blank">{buildCode}</a>
				{/if}
			</div>
		</div>
		<!-- slot for any extra content below the versions -->
		<slot name="footer-slot-bottom" />
		<!-- access point for devTools -->
		{#if doShowDevToolsButton}
			<div class="footer-row {footerDevToolsCss}">
				<JDGButton
					onClickFunction={toggleDevTools}
					label={null}
					tooltip={$showDevTools ? 'Hide JDG UI Dev Tools' : 'Show JDG UI Dev Tools'}
					isPrimary={false}
					paddingTopBottom="5px"
					paddingLeftRight="10px"
					faIcon={$showDevTools ? 'fa-eye-slash' : 'fa-wrench'}
					fontSize={jdgSizes.fontSizeBodyXSm}
					doForceSquareAspect
				/>
				<!-- slot for any extra dev tools -->
				<slot name="footer-slot-dev-tools" />
			</div>
		{/if}
		<!-- all devTools -->
		{#if $showDevTools}
			<div class="dev-tools">
				<JDGDevToolbar />
				<JDGGridLayout>
					<JDGStoreView store={allUiStoreValues} storeName="UI STORE" />
					<JDGStoreView store={allTempStoreValues} storeName="TEMP STORE" />
				</JDGGridLayout>
			</div>
		{/if}
	</div>
</footer>

<style>
	.jdg-footer-outer-container {
		display: flex;
		flex-direction: column;
		width: -moz-available;
		width: -webkit-fill-available;
	}

	.footer-content-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 20px;
	}

	.footer-row {
		display: flex;
		gap: 7px;
	}

	.footer-item {
		text-wrap: balance;
	}

	.state-view {
		word-wrap: break-word;
		text-align: center;
	}
</style>
