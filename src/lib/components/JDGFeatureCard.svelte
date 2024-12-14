<script>
	import { css } from '@emotion/css';
	import { adjustColorForContrast } from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgFonts, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { appAccentColors, appFontFamily } from '$lib/states/ui-state.js';

	export let featureTitle = undefined;
	export let featureDescription;
	export let titleFontFamily = $appFontFamily;
	export let descriptionTextColor = jdgColors.textDm;
	export let descriptionTextFontFamily = $appFontFamily;
	export let nDescriptionTextSizeMultiplier = 1.25; // factor of body copy size
	export let backgroundColor = $appAccentColors[0];
	export let imageAlign = 'left'; // image on this side, text on opposite
	export let showBorderImage = true;

	const featureCardContainerCss = css`
		color: ${descriptionTextColor};
		background-color: ${adjustColorForContrast(backgroundColor, descriptionTextColor)};
	`;

	const featureCardRowCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			flex-direction: column;
            font-size: ${
							(jdgSizes.nFontSizeBodySm * nDescriptionTextSizeMultiplier).toString +
							jdgSizes.fontUnit
						};
            padding: 20px;
            gap: 20px;
            h3 {
                margin: 10px;}
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) and (max-width: ${
			jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit
		}) {
			flex-direction: ${imageAlign == 'left' ? '' : 'row-reverse'};
            font-size: ${
							(jdgSizes.nFontSizeBodyMd * nDescriptionTextSizeMultiplier).toString() +
							jdgSizes.fontUnit
						};
            padding: 30px;
            gap: 30px;
            h3 {
            margin: 15px;}
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			flex-direction: ${imageAlign == 'left' ? '' : 'row-reverse'};
            font-size: ${
							(jdgSizes.nFontSizeBodyLg * nDescriptionTextSizeMultiplier).toString() +
							jdgSizes.fontUnit
						};
            padding: 40px;
            gap: 40px;
            h3 {
            margin: 20px;}
		    }
		}
	`;

	const featureTitleCss = css`
		font-family: ${titleFontFamily};
	`;

	const featureDescriptionCss = css`
		font-family: ${descriptionTextFontFamily};
	`;

	const featureImageCss = css`
		background-color: ${descriptionTextColor};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			padding: ${showBorderImage ? '10px' : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			padding: ${showBorderImage ? '15px' : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			padding: ${showBorderImage ? '20px' : '0'};
		}
	`;
</script>

<div class="jdg-feature-card-container {featureCardContainerCss}">
	<div class="feature-card-row {featureCardRowCss}">
		<div class="image-cell {featureImageCss}">
			<!-- anything can go here - ImageTile, ImageCompare, ImageCarousel, etc -->
			<slot />
		</div>
		<div class="text-cell">
			{#if featureTitle}
				<h3 class="title {featureTitleCss}">
					{featureTitle}
				</h3>
			{/if}
			<div class="description {featureDescriptionCss}">
				{featureDescription}
			</div>
		</div>
	</div>
</div>

<style>
	.jdg-feature-card-container {
		width: 100%;
	}

	.feature-card-row {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-cell {
		flex: 6;
		background-size: cover;
		background-position: center;
		z-index: 1;
		height: 100%;
	}

	.text-cell {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex: 4;
	}

	.description {
		display: grid;
		text-align: center;
	}
</style>
