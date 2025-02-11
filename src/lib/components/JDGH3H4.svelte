<script>
	import { css } from '@emotion/css';

	import { jdgSharedIdentifiers } from '$lib/jdg-shared-strings.js';
	import { convertStringToAnchorTag } from '$lib/jdg-utils.js';

	import { JDGAnchorTag } from '$lib/index.js';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	export let h3String = undefined;
	export let h3Id = undefined; // optionally specify a different id than the string
	export let h4String = undefined;
	export let paddingTop = '0';
	export let paddingBottom = '0';

	const h3h4ContainerCss = css`
		position: relative;
		padding-top: ${paddingTop};
		padding-bottom: ${paddingBottom};
	`;

	const h3Css = css`
		color: ${jdgColors.title};
	`;

	// h4 gets top margin when h3 is present
	const h4Css = css`
		margin: ${h3String ? '10px' : '0'} 0 0 0;
		color: ${jdgColors.textLight};
	`;
</script>

<div class="{jdgSharedIdentifiers.h3h4Container} {h3h4ContainerCss}">
	{#if h3String}
		<JDGAnchorTag
			anchorTagString={convertStringToAnchorTag(h3Id, false) ??
				convertStringToAnchorTag(h3String, false)}
		/>
		<h3 class={h3Css}>
			{h3String}
		</h3>
	{/if}
	{#if h4String}
		<h4 class={h4Css}>
			{h4String}
		</h4>
	{/if}
</div>

<style>
	h3 {
		font-size: 1.4rem;
		text-align: center;
		margin: 0;
		padding: 0;
		line-height: 1;
	}

	h4 {
		font-size: 1.15rem;
		text-align: center;
		padding: 0;
		line-height: 1;
	}
</style>
