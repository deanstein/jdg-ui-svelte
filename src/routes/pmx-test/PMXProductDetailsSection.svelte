<script>
	import { css } from '@emotion/css';
	import { appAccentColors } from '$lib/states/ui-state.js';

	export let sectionTitle = 'PRODUCT SECTION';

	const accentColorBar = css`
		background-color: ${$appAccentColors[2]};
		color: white;
	`;
</script>

<div class="pmx-product-detail-section">
	<div class="product-detail-heading {accentColorBar}">{sectionTitle}</div>
	<div class="product-detail-content">
		<slot />
	</div>
</div>

<style>
	.pmx-product-detail-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.product-detail-heading {
		font-size: 1.25em;
		padding: 0 10px 0 10px;
	}

	.product-detail-content {
		line-height: 1.3;
		padding: 0 10px 0 10px;
	}
</style>
