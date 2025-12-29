<script>
	import { css } from '@emotion/css';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	// Primary label for input component
	export let label = 'Some Fact or Field Name';
	// Optional description
	export let description = undefined;
	// Justification for all inputContainer content
	export let justification = 'left';
	// Whether the inputContainer should grow to fill available space
	export let grow = false;

	const inputContainerCss = css`
		justify-content: ${justification};
		flex-grow: ${grow ? 1 : 'auto'};
	`;

	const labelContainercss = css`
		justify-content: ${justification};
		margin-bottom: ${description ? '' : '0.5svh'};
	`;

	const labelCss = css`
		color: ${jdgColors.text};
	`;

	const descriptionCss = css`
		color: ${jdgColors.textLight};
		text-align: ${justification};
	`;
</script>

<div class="jdg-input-container {inputContainerCss}">
	<!-- Title and optional description for input component-->
	<div class="label-and-description-container">
		<div class="label-container {labelContainercss}">
			<div class="label {labelCss}">
				{label}
			</div>
		</div>
		{#if description}
			<div class="description-container">
				<div class="description {descriptionCss}">
					<i class="fa-solid fa-info-circle"></i>&nbsp;&nbsp;{description}
				</div>
			</div>
		{/if}
	</div>
	<!-- Slot for the actual input component -->
	<slot />
</div>

<style>
	.jdg-input-container {
		display: flex;
		flex-direction: column;
		min-height: 2svh;
		width: 100%;
		min-width: 0; /* Allow container to shrink in flex layouts */
		max-width: 100%; /* Prevent expanding beyond parent */
		margin-bottom: 1svh;
	}

	.label-and-description-container {
		margin-bottom: 0.5svh;
	}

	.label {
		font-size: 1.05rem;
		line-height: normal;
	}

	.description {
		font-size: 0.8rem;
		margin-bottom: 0.5svh;
		line-height: normal;
	}

	.label-container {
		display: flex;
		margin-bottom: 0.5svh;
		font-weight: bold;
	}
</style>
