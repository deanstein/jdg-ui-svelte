<script>
	import { css } from '@emotion/css';

	import { jumpToNavItems } from '$lib/states/ui-state.js';

	import { JDGContentBoxFloating, JDGNavItem } from '$lib/index.js';
	import { jdgSizes } from '$lib/jdg-shared-styles.js';

	export let sectionTitle = 'JUMP TO';
	export let showArrowInItems = false;

	const jumpToItemCss = css`
		min-height: ${(jdgSizes.nFontSizeHeaderTitle * 2.5).toString() + jdgSizes.fontUnit};
	`;
</script>

<JDGContentBoxFloating title={sectionTitle} includeInJumpTo={false}>
	<div class="jumpToItemContainer">
		{#each $jumpToNavItems as tocItem, i}
			{#if tocItem.label && tocItem.href}
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
