<script>
	import { css } from '@emotion/css';

	import { JDGContentBoxFloating, JDGNavItem } from '$lib/index.js';

	import jdgNavItem from '$lib/schemas/jdg-nav-item.js';
	import { instantiateObject } from '$lib/jdg-utils.js';
	import { jdgSizes } from '$lib/jdg-styling-constants.js';

	export let sectionTitle = 'JUMP TO';
	export let jumpToNavItems = [
		instantiateObject(jdgNavItem, {
			label: 'EXAMPLE ITEM 1',
			href: '#example1'
		}),
		instantiateObject(jdgNavItem, {
			label: 'EXAMPLE ITEM 2',
			href: '#example2'
		})
	];
	export let showArrowInItems = true;

	const jumpToItemCss = css`
		min-height: ${(jdgSizes.nFontSizeHeaderTitle * 2.5).toString() + jdgSizes.fontUnit};
	`;
</script>

<JDGContentBoxFloating title={sectionTitle}>
	<div class="jumpToItemContainer">
		{#each jumpToNavItems as tocItem, i}
			{#if showArrowInItems}
				<div class="jumpToItemWithSymbol {jumpToItemCss}">
					<JDGNavItem navItem={tocItem} nLetterSpacing={3} />
					<i class="fa-solid fa-arrow-right"></i>
				</div>
			{:else}
				<div class="jumpToItem {jumpToItemCss}">
					<JDGNavItem navItem={tocItem} nLetterSpacing={3} />
				</div>
			{/if}
		{/each}
	</div>
</JDGContentBoxFloating>

<style>
	.jumpToItemsContainer {
		display: flex;
		flex-direction: column;
	}

	.jumpToItem {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.jumpToItemWithSymbol {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 10px;
	}
</style>
