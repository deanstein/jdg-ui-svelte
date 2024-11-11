<script>
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { css } from '@emotion/css';

	export let h3String = undefined;
	export let h4String = undefined;
	export let paddingTop = '0';
	export let paddingBottom = '0';

	const h3h4ContainerCss = css`
		padding-top: ${paddingTop};
		padding-bottom: ${paddingBottom};
	`;

	const h3Css = css`
		color: ${jdgColors.title};
	`;

	// h4 gets top margin when h3 is present
	const h4Css = css`
		margin: ${h3String ? '10px' : '0'} 0 0 0;
		color: ${jdgColors.textLight};
	`;
</script>

<div class="jdg-h3-h4-container {h3h4ContainerCss}">
	{#if h3String}
		<h3 class={h3Css}>
			{h3String}
		</h3>
	{/if}
	{#if h4String}
		<h4 class={h4Css}>
			{h4String}
		</h4>
	{/if}
</div>

<style>
	h3 {
		text-align: center;
		margin: 0;
		padding: 0;
	}

	h4 {
		text-align: center;
		padding: 0;
	}
</style>
