<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import {
		allStateValues,
		clientWidth,
		doShowDevTools,
		doShowHeaderStripes
	} from '$lib/states/ui-state.js';

	import { getBuildCode } from '../jdg-utils.js';
	import { jdgUiRepoName } from '../jdg-persistence-management.js';
	import { jdgSharedStrings } from '$lib/jdg-shared-strings.js';
	import { toggleDevTools } from '$lib/jdg-state-management.js';

	import { jdgColors, jdgSizes } from '../jdg-shared-styles.js';
	import { JDGButton, JDGH3H4, JDGDevToolbar, JDGStripesHorizontal } from '../index.js';

	export let repoName = jdgUiRepoName;
	export let appVersion = undefined;
	export let additionalVersionData = undefined; // optional additional version data, applicable to some sites
	export let copyright = jdgSharedStrings.jdgCopyrightName; // appears after the (C) symbol
	export let copyrightHref = undefined; // optional href for <a> element around copyright name
	export let disclaimer = undefined; // optional disclaimer, applicable to some sites
	export let alignItems = 'left';
	export let backgroundColorRgba = jdgColors.headerBackground;
	export let showDevToolsButton = false;

	const divider = '|';

	// for debugging: show additional version info
	const forceShowAdditionalVersionData = false;
	forceShowAdditionalVersionData ??
		(additionalVersionData = `Additional Version: ${additionalVersionData}`);

	// date and number of commits is in this format
	let buildCode = 'yyymmdd.nnn';

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
		// get the lgetBuildCode the deployment repo
		buildCode = await getBuildCode(repoName);
	});
</script>

<footer class="jdg-footer-outer-container {footerOuterContainerCss}">
	<!-- horizontal stripes at top of footer -->
	{#if $doShowHeaderStripes}
		<JDGStripesHorizontal />
	{/if}
	<div class="footer-content-container {footerContentContainerCss}">
		<!-- any extra content goes here -->
		<slot />
		<!-- copyright row -->
		{#if copyright}
			<div class="footer-row">
				<div class="footer-item {footerItemCss}">
					<!-- wrap copyright in href if provided -->
					{#if copyrightHref}
						© {copyrightYear}
						<a href={copyrightHref} class="no-initial-highlight">
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
				{#if additionalVersionData}
					<div class="footer-item {footerItemCss}">
						App: v{appVersion}
					</div>
				{:else}
					<div class="footer-item {footerItemCss}">
						v{appVersion}
					</div>
				{/if}
			{/if}
			{#if additionalVersionData}
				<div>{divider}</div>
				<div class="footer-item {footerItemCss}">
					{additionalVersionData}
				</div>
			{/if}
			<div>{divider}</div>
			<div class="footer-item {footerItemCss}">
				{#if additionalVersionData}
					Build: {buildCode}
				{:else}
					{buildCode}
				{/if}
			</div>
		</div>
		{#if showDevToolsButton}
			<div class="footer-row {footerDevToolsCss}">
				<JDGButton
					onClickFunction={toggleDevTools}
					label={null}
					tooltip={$doShowDevTools ? 'Hide Dev Tools' : 'Show Dev Tools'}
					isPrimary={false}
					paddingTopBottom="5px"
					paddingLeftRight="10px"
					faIcon={$doShowDevTools ? 'fa-eye-slash' : 'fa-wrench'}
					fontSize={jdgSizes.fontSizeBodyXSm}
					doForceSquareRatio
				/>
			</div>
		{/if}
		{#if $doShowDevTools}
			<div class="dev-tools">
				<JDGDevToolbar />
				<div class="state-view {stateViewCss}">
					<br />
					<JDGH3H4 h3String="UI STATE" paddingTop="10px" />
					<br />
					{#each Object.entries($allStateValues) as [key, value]}
						<b>{key}:</b> {JSON.stringify(value)}<br /><br />
					{/each}
				</div>
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
		box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.3);
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
