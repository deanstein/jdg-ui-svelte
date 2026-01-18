<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Optional hint text
	export let hint = undefined;
	export let showHintIcon = true;
	// Justification for hint text alignment
	export let justification = 'left';

	const descriptionCss = css`
		color: ${jdgColors.textLight};
		text-align: ${justification};
	`;
</script>

{#if hint}
	<div class="description-container">
		<div class="description {descriptionCss}">
			{#if showHintIcon}
				<i class="fa-solid fa-info-circle"></i>&nbsp;&nbsp;
			{/if}
			{hint}
		</div>
	</div>
{/if}

<style>
	.description {
		font-size: 0.8rem;
		margin-bottom: 0.5svh;
		line-height: normal;
	}
</style>
