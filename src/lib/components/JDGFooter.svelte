<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { getBuildCode } from '../jdg-utils.js';
	import { jdgUiRepoName } from '../jdg-persistence-management.js';

	import { jdgColors, jdgSizes } from '../jdg-styling-constants.js';
	import { JDGStripesHorizontal } from '../index.js';

	export let repoName = jdgUiRepoName;
	export let appVersion = undefined;
	export let additionalVersionData = undefined; // optional additional version data, applicable to some sites
	export let disclaimer = undefined; // optional disclaimer, applicable to some sites
	export let alignItems = 'left';
	export let backgroundColorRgba = jdgColors.headerBackground;
	export let showHorizontalStripes = false;

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
		font-size: ${jdgSizes.fontSizeSmall};
		padding: ${jdgSizes.headerTopBottomPadding} ${jdgSizes.headerSidePadding}
			${jdgSizes.headerTopBottomPadding} ${jdgSizes.headerSidePadding};
	`;

	onMount(async () => {
		// get the lgetBuildCode the deployment repo
		buildCode = await getBuildCode(repoName);
	});
</script>

<footer class="jdg-footer-outer-container {footerOuterContainerCss}">
	<!-- horizontal stripes at top of footer -->
	{#if showHorizontalStripes}
		<JDGStripesHorizontal reverseColors={true} />
	{/if}
	<div class="jdg-footer-content-container {footerContentContainerCss}">
		<!-- copyright and versions row -->
		<div class="jdg-footer-row">
			<div class="jdg-footer-item">© {copyrightYear} J. Dean Goldstein</div>
			<div>{divider}</div>
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
		<!-- disclaimer row -->
		{#if disclaimer}
			<div class="jdg-footer-row">
				<div class="jdg-footer-item">
					{disclaimer}
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

	.jdg-footer-content-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.25vh;
	}

	.jdg-footer-row {
		display: flex;
		gap: 7px;
	}
</style>
