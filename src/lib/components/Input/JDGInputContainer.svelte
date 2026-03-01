<script>
	import { css } from '@emotion/css';

	import JDGInputHint from './JDGInputHint.svelte';
	import { jdgColors, jdgBreakpoints, jdgSizes } from '$lib/jdg-shared-styles.js';

	// Primary label for input component
	export let label = 'Some Fact or Field Name';
	// Optional description of the input
	export let hint = undefined;
	export let showHintIcon = true;
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
		margin-bottom: ${hint ? '' : '0.5svh'};
	`;

	/* Label: small/medium/large by breakpoint (matches site strategy) */
	const labelCss = css`
		color: ${jdgColors.text};
		@media (max-width: ${jdgBreakpoints.width[0].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyXSm};
		}
		@media (min-width: ${jdgBreakpoints.width[0].toString() +
			jdgBreakpoints.unit}) and (max-width: ${jdgBreakpoints.width[1].toString() +
			jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyMd};
		}
		@media (min-width: ${jdgBreakpoints.width[1].toString() + jdgBreakpoints.unit}) {
			font-size: ${jdgSizes.fontSizeBodyLg};
		}
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
		<JDGInputHint {hint} {justification} {showHintIcon} />
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
		line-height: normal;
	}

	.label-container {
		display: flex;
		margin-bottom: 0.5svh;
		font-weight: bold;
	}
</style>
