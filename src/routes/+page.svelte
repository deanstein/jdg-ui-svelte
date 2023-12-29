<script>
	import { jdgColors } from '$lib/jdg-styling-constants.js';
	import { JDGBackground, JDGNotificationBanner, JDGHeader } from '$lib/index.js';
</script>

<JDGNotificationBanner
	message={'UI MAY FLASH AND LOAD SLOWLY. This is a UI library demo site and is not compiled into static assets.'}
	color={jdgColors.notificationInformation}
/>

<JDGBackground />

<JDGHeader logoTitle={'JDG SVELTE UI'} useMobileNav={true} />
