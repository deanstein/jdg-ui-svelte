<script>
	import { css } from '@emotion/css';

	import { jdgSizes } from '$lib/jdg-shared-styles.js';
	import { convertStringToAnchorTag } from '$lib/jdg-utils.js';

	export let navItem;
	export let onClickFunction = () => {};
	/** When true, shows the persistent underline bar (same as hover) */
	export let active = false;
	export let nLetterSpacing = 5;
	export let letterSpacingUnit = 'px';
	export let marginBottom = '0';

	const navItemCss = css`
		font-size: ${jdgSizes.fontSizeHeaderTitle};
		letter-spacing: ${nLetterSpacing.toString() + letterSpacingUnit};
		padding-left: ${(nLetterSpacing / 2).toString() + letterSpacingUnit};
		margin-bottom: ${marginBottom};
	`;

	$: hrefResolved =
		navItem?.href?.startsWith('#') || navItem?.href?.startsWith('.')
			? convertStringToAnchorTag(navItem?.href)
			: navItem?.href;
</script>

<a
	class="jdg-nav-item no-initial-highlight {active ? 'jdg-nav-current' : ''} {navItemCss}"
	href={hrefResolved}
	aria-current={active ? (hrefResolved?.startsWith('#') ? 'location' : 'page') : undefined}
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
