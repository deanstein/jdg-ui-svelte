<script>
	import { get } from 'svelte/store';

	import {
		isAdminMode,
		adminFormPassphrase,
		doShowAdminLoginModal,
		postAdminLoginFunction
	} from '$lib/stores/jdg-ui-store.js';
	import { fetchIsAdmin } from '$lib/jdg-persistence-management.js';

	import { JDGAdminLoginForm } from '$lib/index.js';
	import { JDGModal } from '$lib/index.js';

	// bind variables to the form component
	let showErrorMessage = false;
	let showLoadingMessage = false;

	const onClickCloseButton = () => {
		doShowAdminLoginModal.set(false);
	};

	const onClickSubmitButton = async () => {
		showLoadingMessage = true;
		const isAdminResponse = await fetchIsAdmin(get(adminFormPassphrase), get(adminFormLastName));

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
</script>

<JDGModal title={'Admin Only'} subtitle={'This action requires admin access.'} {onClickCloseButton}>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<JDGAdminLoginForm
			buttonText="Log in as Admin"
			buttonFaIcon="fa-pencil"
			onClickButtonFunction={onClickSubmitButton}
			{showLoadingMessage}
			errorMessage={"Sorry, you're not an admin!"}
			{showErrorMessage}
		/>
	</div>
</JDGModal>
