<script>
	import { css } from '@emotion/css';

	import { jdgBreakpoints } from '$lib/jdg-shared-styles.js';

	export let title = undefined; // optional

	const flexContainerCss = css`
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			flex-direction: column;
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			flex-direction: row;
		}
	`;
</script>

<div class="jdg-dev-toolbar-container">
	{#if title}
		<p class="toolbar-row-label">{title}</p>
	{/if}
	<div class="toolbar-button-flex-container {flexContainerCss}">
		<slot />
	</div>
</div>

<style>
	.jdg-dev-toolbar-container {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.toolbar-row-label {
		margin: 0;
		font-size: var(--toolbar-label-font-size, 0.75rem);
		font-weight: bold;
		text-align: center;
	}

	.toolbar-button-flex-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		gap: 10px;
	}
</style>
