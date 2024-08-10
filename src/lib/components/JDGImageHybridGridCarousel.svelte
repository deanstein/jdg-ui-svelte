<script>
	import uiState from '$lib/states/ui-state.js';

	import {
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';

	export let imageAttributeObjects = []; // all images shown in thumbnail collection
	export let fillContainer = true;
	export let showBlurInUnfilledSpace = false;
	export let showCaption = true;
	export let showAttribution = true;
	export let compactModeOnMobile = true;
	export let maxColumns = 3;
</script>

<div class="jdg-hybrid-image-grid-carousel-container">
	<!-- mobile always uses image carousel -->
	{#if $uiState.isMobileBreakpoint}
		<JDGFullWidthContainer>
			<JDGImageCarousel {imageAttributeObjects}></JDGImageCarousel>
		</JDGFullWidthContainer>
	{:else}
		<!-- other breakpoints use the grid layout with image tiles -->
		<JDGGridLayout {maxColumns}>
			{#each imageAttributeObjects as imageAttributes, i}
				<JDGImageTile
					{imageAttributes}
					{fillContainer}
					{showBlurInUnfilledSpace}
					{showCaption}
					{showAttribution}
					{compactModeOnMobile}
				/>
			{/each}
		</JDGGridLayout>
	{/if}
</div>
