<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		allUiStoreValues,
		appCssHyperlinkSimple,
		clientWidth,
		showDevTools,
		showHeaderStripes,
		isAdminMode,
		showAdminLoginModal,
		showImageMetaModal,
		showImageGalleryModal,
		showImageEditButtons,
		showDevToolbarSticky,
		showDevModal,
		allowTextSelection
	} from '$lib/stores/jdg-ui-store.js';
	import { draftImageMeta } from '$lib/stores/jdg-temp-store.js';

	import { getBuildCode, instantiateObject } from '$lib/jdg-utils.js';
	import { endAdminMode } from '$lib/jdg-ui-management.js';
	import jdgImageMeta from '$lib/schemas/jdg-image-meta.js';
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
	export let showShadow = true; // subtle shadow to give the illusion of depth
	export let showJdgUiVersion = true;
	export let showDevToolsButton = false;

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
		box-shadow: ${showShadow ? '-3px -3px 5px rgba(0, 0, 0, 0.3)' : ''};
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
				{#if additionalVersionData || showJdgUiVersion}
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
			{#if showJdgUiVersion}
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
				{#if additionalVersionData || showJdgUiVersion}
					Build: <a href={buildCodeHref} target="_blank">{buildCode}</a>
				{:else}
					<a href={buildCodeHref} target="_blank">{buildCode}</a>
				{/if}
			</div>
		</div>
		<!-- slot for any extra content below the versions -->
		<slot name="footer-slot-bottom" />
		<!-- access point for devTools -->
		{#if showDevToolsButton}
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
				<JDGDevToolbar title="ADMIN MODE">
					{#if $isAdminMode}
						<JDGButton
							onClickFunction={endAdminMode}
							faIcon="fa-right-from-bracket"
							label="End admin mode"
							backgroundColor={jdgColors.activeSecondary}
							paddingTopBottom="5px"
							paddingLeftRight="10px"
							fontSize={jdgSizes.fontSizeBodyXSm}
						/>
					{:else}
						<JDGButton
							onClickFunction={() => showAdminLoginModal.set(true)}
							faIcon="fa-right-to-bracket"
							label="Start admin mode"
							backgroundColor={jdgColors.active}
							paddingTopBottom="5px"
							paddingLeftRight="10px"
							fontSize={jdgSizes.fontSizeBodyXSm}
						/>
					{/if}
				</JDGDevToolbar>
				<JDGDevToolbar title="IMAGE TOOLS">
					<JDGButton
						onClickFunction={() => {
							const newImageMeta = instantiateObject(jdgImageMeta);
							draftImageMeta.set(newImageMeta);
							showImageMetaModal.set(true);
						}}
						faIcon="fa-upload"
						label="Upload New Image"
						backgroundColor={jdgColors.active}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
					<JDGButton
						onClickFunction={() => showImageGalleryModal.set(true)}
						faIcon="fa-images"
						label="View Image Gallery"
						backgroundColor={jdgColors.active}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
					<JDGButton
						onClickFunction={() => showImageEditButtons.set(!$showImageEditButtons)}
						faIcon={$showImageEditButtons ? 'fa-eye-slash' : 'fa-pencil'}
						label={$showImageEditButtons ? 'Hide Image Edit Buttons' : 'Show Image Edit Buttons'}
						backgroundColor={jdgColors.activeSecondary}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
				</JDGDevToolbar>
				<JDGDevToolbar title="GENERAL TOOLS">
					<JDGButton
						onClickFunction={() => showAdminLoginModal.set(!$showAdminLoginModal)}
						faIcon={$showAdminLoginModal ? 'fa-eye-slash' : 'fa-right-to-bracket'}
						label={$showAdminLoginModal ? 'Hide Admin Login' : 'Show Admin Login'}
						backgroundColor={jdgColors.activeSecondary}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
					<JDGButton
						onClickFunction={() => showDevToolbarSticky.set(!$showDevToolbarSticky)}
						faIcon={$showDevToolbarSticky ? 'fa-eye-slash' : 'fa-eye'}
						label={$showDevToolbarSticky ? 'Hide Sticky Dev Toolbar' : 'Show Sticky Dev Toolbar'}
						backgroundColor={jdgColors.activeSecondary}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
					<JDGButton
						onClickFunction={() => showDevModal.set(!$showDevModal)}
						faIcon={$showDevModal ? 'fa-eye-slash' : 'fa-eye'}
						label={$showDevModal ? 'Hide Dev Overlay' : 'Show Dev Overlay'}
						backgroundColor={jdgColors.activeSecondary}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
					<JDGButton
						onClickFunction={() => allowTextSelection.set(!$allowTextSelection)}
						faIcon={$allowTextSelection ? 'fa-text-slash' : 'fa-arrow-pointer'}
						label={$allowTextSelection ? 'Disallow Text Selection' : 'Allow Text Selection'}
						backgroundColor={jdgColors.activeSecondary}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						fontSize={jdgSizes.fontSizeBodyXSm}
					/>
				</JDGDevToolbar>
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

	.dev-tools {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
</style>
