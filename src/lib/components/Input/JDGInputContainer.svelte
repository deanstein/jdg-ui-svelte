<script>
	import { jdgColors } from '$lib/jdg-shared-styles.js';
	import { css } from '@emotion/css';

	export let label = 'Some Fact or Field Name';
	export let grow = false;
	export let justification = 'left';

	const labelAndInputContainerCss = css`
		flex-grow: ${grow ? 1 : 'auto'};
	`;

	const labelContainercss = css`
		justify-content: ${justification};
	`;

	const labelCss = css`
		color: ${jdgColors.text};
	`;
</script>

<div class="label-and-input-container {labelAndInputContainerCss}">
	<div class="input-content">
		<div class="label-container {labelContainercss}">
			<div class={labelCss}>
				{label}
			</div>
		</div>
		<slot />
	</div>
</div>

<style>
	.label-and-input-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 1svh;
	}

	.input-content {
		display: flex;
		flex-direction: column;
		min-height: 2svh;
		height: 100%;
	}

	.label-container {
		display: flex;
		margin-bottom: 0.5svh;
		font-weight: bold;
	}
</style>
