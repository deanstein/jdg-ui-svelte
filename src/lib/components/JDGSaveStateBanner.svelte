<script>
	import { saveFunction, saveStatus } from '$lib/stores/jdg-temp-store.js';

	import { JDGButton, JDGNotificationBanner, runFnSyncOrAsync } from '$lib/index.js';
	import jdgSaveStatus from '$lib/schemas/jdg-save-status.js';

	let showBanner;

	// Show the banner when there's a valid save status
	$: {
		if ($saveStatus !== null) {
			showBanner = true;
		} else {
			showBanner = false;
		}

		// success messages get a delay before dismissing
		if ($saveStatus === jdgSaveStatus.loadSucccess || $saveStatus === jdgSaveStatus.saveSuccess) {
			setTimeout(() => {
				saveStatus.set(undefined);
			}, 2000);
		}
	}
</script>

{#if showBanner}
	<JDGNotificationBanner
		message={$saveStatus.label}
		backgroundColor={$saveStatus.color}
		standalone={true}
		showCloseButton={false}
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
{/if}
