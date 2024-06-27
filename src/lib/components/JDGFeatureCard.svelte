<script>
	import { css } from '@emotion/css';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { adjustColorForContrast } from '$lib/jdg-utils.js';

	import { jdgBreakpoints, jdgColors, jdgFonts, jdgSizes } from '$lib/jdg-styling-constants.js';
	import { JDGImageTile } from '$lib/index.js';

	export let featureImageAttributes;
	export let featureTitle = undefined;
	export let featureDescription;
	export let titleFontFamily = jdgFonts.body;
	export let descriptionTextColor = jdgColors.textDm;
	export let descriptionTextFontFamily = jdgFonts.body;
	export let nDescriptionTextSizeMultiplier = 1.25; // factor of body copy size
	export let backgroundColor = getAccentColors()[0];
	export let imageAlign = 'left'; // image on this side, text on opposite
	export let maxImageHeight = '400px';
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
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			border: ${showBorderImage ? `10px solid ${descriptionTextColor}` : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			border: ${showBorderImage ? `15px solid ${descriptionTextColor}` : '0'};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			border: ${showBorderImage ? `20px solid ${descriptionTextColor}` : '0'};
		}
	`;
</script>

<div class="jdg-feature-card-container {featureCardContainerCss}">
	<div class="feature-card-row {featureCardRowCss}">
		<div class="image-cell {featureImageCss}">
			<JDGImageTile
				imageAttributes={featureImageAttributes}
				maxHeight={maxImageHeight}
				compactModeOnMobile={true}
			/>
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
	.feature-card-row {
		display: flex;
	}

	.image-cell {
		flex: 6;
		background-size: cover;
		background-position: center;
	}

	.text-cell {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 4;
	}

	.description {
		display: grid;
		text-align: center;
	}
</style>
