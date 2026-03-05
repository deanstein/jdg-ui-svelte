<script>
	import { carouselNav } from '$lib/stores/jdg-ui-store.js';
	import { JDGButton } from '$lib/index.js';

	/** Which button(s) to show: 'prev' | 'next' | 'both' (default). For modal edges use 'prev' in left slot and 'next' in right. */
	export let side = 'both';
</script>

{#if $carouselNav}
	<div class="carousel-nav-buttons" data-side={side}>
		{#if side === 'prev' || side === 'both'}
			<JDGButton
				label={null}
				faIcon="fa-chevron-left"
				onClickFunction={$carouselNav.goPrev}
				isEnabled={$carouselNav.canGoPrev}
				isPrimary={false}
				doForceSquareAspect={true}
				tooltip="Previous"
				paddingLeftRight="10px"
				paddingTopBottom="10px"
			/>
		{/if}
		{#if side === 'next' || side === 'both'}
			<JDGButton
				label={null}
				faIcon="fa-chevron-right"
				onClickFunction={$carouselNav.goNext}
				isEnabled={$carouselNav.canGoNext}
				isPrimary={false}
				doForceSquareAspect={true}
				tooltip="Next"
				paddingLeftRight="10px"
				paddingTopBottom="10px"
			/>
		{/if}
	</div>
{/if}

<style>
	.carousel-nav-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	.carousel-nav-buttons[data-side='both'] {
		justify-content: space-between;
		width: 100%;
	}
</style>
