<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import {
		isAdminMode,
		doShowAdminLoginModal,
		postAdminLoginFunction
	} from '$lib/stores/jdg-ui-store.js';
	import { adminFormPassphrase } from '$lib/stores/jdg-temp-store.js';
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

<JDGModal title={'Admin Login'} subtitle={'Access admin-only features'} {onClickCloseButton}>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<form on:submit|preventDefault={onClickSubmitButton} class="form {formCss}">
			<!-- only show form and button if not already in admin mode -->
			{#if !$isAdminMode}
				<JDGInputContainer label="Passphrase:" justification={'center'}>
					<JDGTextInput onInputFunction={onPassphraseInput} />
				</JDGInputContainer>

				<JDGButton
					onClickFunction={onClickSubmitButton}
					label={'Log in as Admin'}
					faIcon={'fa-lock'}
					backgroundColor={jdgColors.active}
					textColor="white"
				/>
				<JDGButton
					onClickFunction={onClickCloseButton}
					label={'Cancel'}
					faIcon={null}
					backgroundColor={jdgColors.activeSecondary}
					textColor="white"
				/>
			{/if}
			<!-- show status messaging -->
			<div class="status-message">
				{#if $isAdminMode}
					<div class="status-message logged-in">
						<i class="fa-solid fa-circle-check">&nbsp;</i>{"You're logged in as an admin!"}
					</div>
				{/if}
				{#if showLoadingMessage}
					<div class="status-message loading">
						<i class="fa-solid fa-circle-dot">&nbsp;</i>{'Checking your passphrase...'}
					</div>
				{/if}
				{#if showErrorMessage}
					<div class="status-message error">
						<i class="fa-solid fa-circle-xmark">&nbsp;</i>{'That passphrase is incorrect!'}
					</div>
				{/if}
			</div>
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
		min-height: 1rem;
	}

	.logged-in {
		color: green;
	}

	.error {
		color: red;
	}

	.loading {
		color: goldenrod;
	}
</style>
