<script>
	import { css } from '@emotion/css';

	import { adminFormPassphrase } from '$lib/stores/jdg-ui-store.js';

	import { JDGButton } from '$lib/index.js';
	import { lightenColor } from '$lib/index.js';

	import { JDGInputContainer } from '$lib/index.js';
	import { JDGTextInput } from '$lib/index.js';
	import { jdgColors } from '$lib/index.js';

	export let buttonText = 'Log in as Admin';
	export let buttonFaIcon = 'fa-key';
	export let onClickButtonFunction;

	// status messaging
	export let showLoadingMessage = false;
	export let loadingMessage = 'Checking your passphrase...';
	export let showErrorMessage = false;
	export let errorMessage = 'Sorry, that passphrase is incorrect.';

	const onPassphraseInput = (event) => {
		adminFormPassphrase.set(event.target.value);
	};

	const formCss = css`
		background-color: ${lightenColor(jdgColors.headerBackground, 0.45)};
	`;
</script>

<form on:submit|preventDefault={onClickButtonFunction} class="form {formCss}">
	<JDGInputContainer label="Admin Passphrase">
		<JDGTextInput onInputFunction={onPassphraseInput} placeholder="Enter your passphrase" />
	</JDGInputContainer>

	<JDGButton
		onClickFunction={onClickButtonFunction}
		label={buttonText}
		faIcon={buttonFaIcon}
		backgroundColor={jdgColors.activeSubtle}
		textColor="white"
	/>

	{#if showLoadingMessage}
		<div class="status-message loading">
			{loadingMessage}
		</div>
	{/if}

	{#if showErrorMessage}
		<div class="status-message error">
			{errorMessage}
		</div>
	{/if}
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
	}

	.status-message {
		text-align: center;
		text-wrap: balance;
		font-size: 0.8rem;
	}

	.error {
		color: red;
	}

	.loading {
		color: goldenrod;
	}
</style>
