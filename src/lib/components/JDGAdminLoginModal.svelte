<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import {
		isAdminMode,
		adminFormPassphrase,
		doShowAdminLoginModal,
		postAdminLoginFunction
	} from '$lib/stores/jdg-ui-store.js';
	import { fetchIsAdmin } from '$lib/jdg-persistence-management.js';

	import {
		JDGModal,
		JDGButton,
		JDGInputContainer,
		JDGTextInput,
		lightenColor,
		jdgColors
	} from '$lib/index.js';

	// modal state
	let showErrorMessage = false;
	let showLoadingMessage = false;

	// form props
	let buttonText = 'Log in as Admin';
	let buttonFaIcon = 'fa-pencil';
	let loadingMessage = 'Checking your passphrase...';
	let errorMessage = "Sorry, you're not an admin!";

	const onClickCloseButton = () => {
		doShowAdminLoginModal.set(false);
	};

	const onClickSubmitButton = async () => {
		showLoadingMessage = true;
		const isAdminResponse = await fetchIsAdmin(get(adminFormPassphrase));

		if (isAdminResponse.success && isAdminResponse.isAdmin) {
			// set admin mode to true
			// so no further logins are required
			isAdminMode.set(true);
			doShowAdminLoginModal.set(false);
			showLoadingMessage = false;

			// execute whatever action was invoked before this dialog was shown
			const postLoginFunction = get(postAdminLoginFunction);
			if (postLoginFunction) {
				postLoginFunction();
				postAdminLoginFunction.set(undefined);
			}
		} else {
			showErrorMessage = true;
			showLoadingMessage = false;
		}
	};

	// update passphrase store on input
	const onPassphraseInput = (event) => {
		adminFormPassphrase.set(event.target.value);
	};

	const formCss = css`
		background-color: ${lightenColor(jdgColors.headerBackground, 0.45)};
	`;
</script>

<JDGModal title={'Admin Only'} subtitle={'This action requires admin access.'} {onClickCloseButton}>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<form on:submit|preventDefault={onClickSubmitButton} class="form {formCss}">
			<JDGInputContainer label="Admin Passphrase">
				<JDGTextInput onInputFunction={onPassphraseInput} placeholder="Enter your passphrase" />
			</JDGInputContainer>

			<JDGButton
				onClickFunction={onClickSubmitButton}
				label={buttonText}
				faIcon={buttonFaIcon}
				backgroundColor={jdgColors.active}
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
	</div>
</JDGModal>

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
