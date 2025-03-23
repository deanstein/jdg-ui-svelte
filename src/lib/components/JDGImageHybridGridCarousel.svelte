<script>
	import { isMobileBreakpoint } from '$lib/states/ui-state.js';

	import {
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';

	// shared props
	export let imageMetaSet = []; // all images shown in thumbnail collection
	export let objectPosition = 'center';
	export let cropToFillContainer = true;
	export let showBlurInUnfilledSpace = false;
	export let showCaption = true;
	export let showAttribution = true;
	// carousel props
	export let fullWidthCarouselOnMobile = true;
	// image + grid layout props
	export let useAutoHeightOnMobile = true;
	export let maxColumns = 3;
</script>

<div class="jdg-hybrid-image-grid-carousel-container">
	<!-- mobile always uses image carousel -->
	{#if $isMobileBreakpoint}
		<!-- carousel can be full-width or not -->
		{#if fullWidthCarouselOnMobile}
			<JDGFullWidthContainer>
				<JDGImageCarousel {imageMetaSet} {showCaption} {showAttribution}
				></JDGImageCarousel>
			</JDGFullWidthContainer>
		{:else}
			<JDGImageCarousel {imageMetaSet} {showCaption} {showAttribution}></JDGImageCarousel>
		{/if}
		<!-- all other breakpoints use the grid layout with image tiles -->
	{:else}
		<JDGGridLayout {maxColumns}>
			{#each imageMetaSet as imageMeta, i}
				<JDGImageTile
					{imageMeta}
					{objectPosition}
					{cropToFillContainer}
					{showBlurInUnfilledSpace}
					{showCaption}
					{showAttribution}
					{useAutoHeightOnMobile}
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
