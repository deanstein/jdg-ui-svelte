<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import uiState from '$lib/states/ui-state.js';

	import { getBuildCode } from '../jdg-utils.js';
	import { jdgUiRepoName } from '../jdg-persistence-management.js';
	import { toggleDevTools } from '$lib/jdg-state-management.js';

	import { jdgColors, jdgSizes } from '../jdg-shared-styles.js';
	import { JDGButton, JDGStripesHorizontal } from '../index.js';

	export let repoName = jdgUiRepoName;
	export let appVersion = undefined;
	export let additionalVersionData = undefined; // optional additional version data, applicable to some sites
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

	const footerDevToolsCss = css`
		justify-content: ${alignItems};
	`;

	onMount(async () => {
		// get the lgetBuildCode the deployment repo
		buildCode = await getBuildCode(repoName);
	});
</script>

<footer class="jdg-footer-outer-container {footerOuterContainerCss}">
	<!-- horizontal stripes at top of footer -->
	{#if $uiState.showHeaderStripes}
		<JDGStripesHorizontal />
	{/if}
	<div class="footer-content-container {footerContentContainerCss}">
		<!-- copyright row -->
		<div class="footer-row">
			<div class="jdg-footer-item">© {copyrightYear} Joshua Dean Goldstein</div>
		</div>
		<!-- disclaimer row -->
		{#if disclaimer}
			<div class="footer-row">
				<div class="jdg-footer-item">
					{disclaimer}
				</div>
			</div>
		{/if}
		<!-- any extra content goes here -->
		<slot />
		<!-- versions row -->
		<div class="footer-row">
			{#if appVersion}
				{#if additionalVersionData}
					<div class="jdg-footer-item">
						App: v{appVersion}
					</div>
				{:else}
					<div class="jdg-footer-item">
						v{appVersion}
					</div>
				{/if}
			{/if}
			{#if additionalVersionData}
				<div>{divider}</div>
				<div class="jdg-footer-item">
					{additionalVersionData}
				</div>
			{/if}
			<div>{divider}</div>
			<div class="jdg-footer-item">
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
					label={$uiState.showDevTools ? 'Hide Dev Tools' : 'Show Dev Tools'}
					paddingTopBottom="5px"
					paddingLeftRight="10px"
					faIcon={null}
					fontSize={jdgSizes.fontSizeBodyXSm}
				/>
			</div>
		{/if}
		{#if $uiState.showDevTools}
			<div class="dev-tools">
				<div class="state-view">
					{JSON.stringify($uiState)}
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
		gap: 1.25vh;
	}

	.footer-row {
		display: flex;
		gap: 7px;
	}

	.state-view {
		word-wrap: break-word;
	}
</style>
