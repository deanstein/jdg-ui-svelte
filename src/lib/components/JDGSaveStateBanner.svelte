<script>
	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import jdgSaveStatus from '$lib/schemas/jdg-save-status.js';

	import { saveFunction, saveStatus } from '$lib/stores/jdg-temp-store.js';

	import { JDGButton, JDGNotificationBanner, runFnSyncOrAsync } from '$lib/index.js';

	export let showBanner = false;
	export let scrollOnStatusChange = true;

	// Show the banner when there's a valid save status
	$: {
		if ($saveStatus !== null && $saveStatus !== undefined) {
			showBanner = true;
		} else {
			showBanner = false;
		}

		// Auto-dismiss success messages after a delay (but not successPersistent)
		if ($saveStatus?.notificationType !== jdgNotificationTypes.successPersistent) {
			if ($saveStatus === jdgSaveStatus.loadSucccess || $saveStatus === jdgSaveStatus.saveSuccess) {
				setTimeout(() => {
					saveStatus.set(null);
				}, 2000);
			}
		}
	}
</script>

<JDGNotificationBanner
	{showBanner}
	message={$saveStatus?.label}
	notificationType={$saveStatus?.notificationType}
	standalone={true}
	showCloseButton={false}
	scrollOnStatusChange={scrollOnStatusChange}
>
	{#if $saveStatus === jdgSaveStatus.unsavedChanges}
		<JDGButton
			label={'Save'}
			faIcon={'fa-floppy-disk'}
			onClickFunction={() => {
				runFnSyncOrAsync($saveFunction);
			}}
			fontSize={'1.35svh'}
			paddingTopBottom={'3px'}
			paddingLeftRight={'10px'}
		/>
	{/if}
</JDGNotificationBanner>
