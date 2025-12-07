<script>
	import { css } from '@emotion/css';

	import { jdgSizes } from '$lib/jdg-shared-styles.js';
	import { convertStringToAnchorTag } from '$lib/jdg-utils.js';

	export let navItem;
	export let onClickFunction = () => {};
	export let nLetterSpacing = 5;
	export let letterSpacingUnit = 'px';
	export let marginBottom = '0';

	const navItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		letter-spacing: ${nLetterSpacing.toString() + letterSpacingUnit};
		padding-left: ${(nLetterSpacing / 2).toString() + letterSpacingUnit};
		margin-bottom: ${marginBottom};
	`;
</script>

<a
	class="jdg-nav-item no-initial-highlight {navItemCss}"
	href={navItem?.href?.startsWith('#') || navItem?.href?.startsWith('.')
		? convertStringToAnchorTag(navItem?.href)
		: navItem?.href}
	on:click={() => {
		onClickFunction();
	}}>{navItem?.label}</a
>

<style>
	.jdg-nav-item {
		text-align: center;
		align-items: baseline;
		display: flex;
		font-weight: bold;
	}
</style>
