<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { getBuildCode } from './jdg-utils.js';
	import { jdgUiRepoName } from './jdg-persistence-management.js';

	import { jdgColors, jdgSizes } from './jdg-styling-constants.js';
	import { JDGStripesHorizontal } from './index.js';

	export let repoName = jdgUiRepoName;
	export let appVersion = undefined;
	export let additionalVersionData = undefined; // optional additional version data, applicable to some sites
	export let disclaimer = undefined; // optional disclaimer, applicable to some sites
	export let alignItems = 'left';
	export let backgroundColorRgba = jdgColors.headerBackground;

	const divider = '|';

	let buildCode = 'yyymmdd.nnn'; // date and number of commits

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

<div class="jdg-footer-outer-container {footerOuterContainerCss}">
	<!-- horizontal stripes at top of footer -->
	<JDGStripesHorizontal reverseColors={true}/>
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
			<div>{divider}</div>
			<div class="jdg-footer-item">
				{buildCode}
			</div>
			{#if additionalVersionData}
				<div>{divider}</div>
				<div class="jdg-footer-item">
					{additionalVersionData}
				</div>
			{/if}
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
</div>

<style>
	.jdg-footer-outer-container {
		display: flex;
		flex-direction: column;
		width: -moz-available;
		width: -webkit-fill-available;
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
