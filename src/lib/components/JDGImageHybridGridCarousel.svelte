<script>
	import { isMobileBreakpoint } from '$lib/states/ui-state.js';

	import {
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';

	// shared props
	export let imageAttributeObjects = []; // all images shown in thumbnail collection
	export let objectPosition = 'center';
	export let cropToFillContainer = true;
	export let showBlurInUnfilledSpace = false;
	export let showCaption = true;
	export let showAttribution = true;
	// carousel props
	export let fullWidthCarouselOnMobile = true;
	// image + grid layout props
	export let useCompactHeightOnMobile = true;
	export let maxColumns = 3;
</script>

<div class="jdg-hybrid-image-grid-carousel-container">
	<!-- mobile always uses image carousel -->
	{#if $isMobileBreakpoint}
		<!-- carousel can be full-width or not -->
		{#if fullWidthCarouselOnMobile}
			<JDGFullWidthContainer>
				<JDGImageCarousel {imageAttributeObjects} {showCaption} {showAttribution}
				></JDGImageCarousel>
			</JDGFullWidthContainer>
		{:else}
			<JDGImageCarousel {imageAttributeObjects} {showCaption} {showAttribution}></JDGImageCarousel>
		{/if}
		<!-- all other breakpoints use the grid layout with image tiles -->
	{:else}
		<JDGGridLayout {maxColumns}>
			{#each imageAttributeObjects as imageAttributes, i}
				<JDGImageTile
					{imageAttributes}
					{objectPosition}
					{cropToFillContainer}
					{showBlurInUnfilledSpace}
					{showCaption}
					{showAttribution}
					{useCompactHeightOnMobile}
				/>
			{/each}
		</JDGGridLayout>
	{/if}
</div>

<style>
	.jdg-hybrid-image-grid-carousel-container {
		width: 100%;
	}
</style>
