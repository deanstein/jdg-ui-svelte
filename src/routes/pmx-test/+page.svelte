<script>
	import imageMetaRegistry from '../image-meta-registry.js';
	import { appAccentColors } from '$lib/stores/jdg-ui-store.js';

	import { JDGContentBoxFloating, JDGContentContainer } from '$lib/index.js';
	import PMXProductDetailsSection from './PMXProductDetailsSection.svelte';
	import PMXProductTypeContainer from './PMXProductTypeContainer.svelte';
	import PMXProductTypeSelector from './PMXProductTypeSelector.svelte';

	const model003D = '003D';
	const model003F = '003F';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating
		title="DENVER CITYSCAPE"
		titleColor={$appAccentColors[2]}
		subtitle="Denver in the palm of your hands"
	>
		<PMXProductTypeSelector
			activeProductId={model003F}
			productTypeIds={[model003D, model003F]}
			productTypeThumbnailImageAttributes={[
				imageMetaRegistry.aerial_60s70s_1,
				imageMetaRegistry.architecture_1
			]}
		>
			<PMXProductTypeContainer
				productId={model003D}
				imageMetaSet={[
					imageMetaRegistry.cc_1,
					imageMetaRegistry.ccp_blue_mall_80s90s_1,
					imageMetaRegistry.ccp_blue_mall_60s70s_1
				]}
			>
				<PMXProductDetailsSection sectionTitle={`MODEL ${model003D}`}>
					A blended pentagon-based form, small enough for windowsills.
					<br /><br />
					Features an overflow protection reservoir.
					<br /><br />
					Available with choice of exterior relief patterns.
				</PMXProductDetailsSection>
				<PMXProductDetailsSection sectionTitle={'DETAILS'}>
					Dimensions: 4.71"W x 4.71"D x 3.21"H
					<br />
					Latest version: v1.10.5
				</PMXProductDetailsSection>
			</PMXProductTypeContainer>
			<PMXProductTypeContainer
				productId={model003F}
				imageMetaSet={[
					imageMetaRegistry.ccp_blue_mall_80s90s_1,
					imageMetaRegistry.ccp_gold_mall_60s70s_1,
					imageMetaRegistry.ccp_gold_mall_80s90s_1
				]}
			>
				<PMXProductDetailsSection sectionTitle={`MODEL ${model003F}`}>
					A simple cuboid shape, enhanced with a hidden aeration system and overflow protection
					reservoir.
					<br /><br />
					Optionally features a subtle exterior relief pattern.
					<br /><br />
					Other sizes and proportions available below.
				</PMXProductDetailsSection>
				<PMXProductDetailsSection sectionTitle={'DETAILS'}>
					Dimensions: 4.00"W x 4.00"D x 3.69"H
					<br />
					Latest version: v1.15.4
				</PMXProductDetailsSection>
			</PMXProductTypeContainer>
		</PMXProductTypeSelector></JDGContentBoxFloating
	>
</JDGContentContainer>
