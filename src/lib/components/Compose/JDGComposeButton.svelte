<script>
	import { css } from '@emotion/css';
	import JDG_COMPOSE_BUTTON_TYPES from '$lib/schemas/jdg-compose-button-types.js';

	import JDGButton from '$lib/components/Input/JDGButton.svelte';
	import { jdgColors } from '$lib/jdg-shared-styles.js';

	export let onClickFunction;
	export let faIcon = undefined;
	export let label = null;
	export let tooltip = undefined;
	export let isEnabled = true;
	export let buttonType = JDG_COMPOSE_BUTTON_TYPES.edit.type;

	let isCircular =
		buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? true
			: false;

	const composeButtonCss = css`
		border-radius: ${isCircular ? '50%' : '1.5rem'};
	`;
</script>

<div class="compose-button {composeButtonCss}">
	<JDGButton
		{isEnabled}
		{onClickFunction}
		label={buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? null
			: label}
		faIcon={faIcon ?? JDG_COMPOSE_BUTTON_TYPES[buttonType].faIcon}
		textColor={JDG_COMPOSE_BUTTON_TYPES[buttonType].color}
		backgroundColor={JDG_COMPOSE_BUTTON_TYPES[buttonType].backgroundColor}
		backgroundColorHover={buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? jdgColors.compose
			: undefined}
		doForceSquareAspect={isCircular}
		tooltip={tooltip ?? JDG_COMPOSE_BUTTON_TYPES[buttonType].tooltip}
		fontSize={buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? '1.5rem'
			: '0.9rem'}
		paddingLeftRight={buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? '1rem'
			: '0.5rem'}
		paddingTopBottom={buttonType === JDG_COMPOSE_BUTTON_TYPES.add.type ||
		buttonType === JDG_COMPOSE_BUTTON_TYPES.edit.type
			? '1rem'
			: '0.25rem'}
	/>
</div>

<style>
	.compose-button {
		height: fit-content;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* subtle shadow */
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
		pointer-events: all;
	}
</style>
