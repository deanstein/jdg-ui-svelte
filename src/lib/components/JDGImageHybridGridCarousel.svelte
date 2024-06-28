<script>
	import uiState from '$lib/states/ui-state.js';

	import {
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageCarousel,
		JDGImageTile
	} from '$lib/index.js';

	export let imageAttributeObjects = []; // all images shown in thumbnail collection
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
		<JDGGridLayout {maxColumns} >
			{#each imageAttributeObjects as imageAttributesObject, i}
				<JDGImageTile
					imageAttributes={imageAttributesObject}
					showBlurInUnfilledSpace={true}
					showCaption={true}
					showAttribution={true}
					compactModeOnMobile={true}
				/>
			{/each}
		</JDGGridLayout>
	{/if}
</div>
