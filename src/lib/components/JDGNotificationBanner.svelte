<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';

	import { incrementHighestZIndex } from '$lib/jdg-state-management.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { darkenColor } from '$lib/jdg-utils.js';
	import { JDGButton } from '$lib/index.js';

	export let showBanner = true;
	export let notificationType = jdgNotificationTypes.information; // Inits color and icon
	export let faIcon = 'fa-solid ' + notificationType.faIcon;
	export let message = jdgNotificationTypes.information.message;
	export let backgroundColor = undefined;
	export let standalone = true; // set to false if included in a header already in a fixed position
	export let forceOnTop = false; // if true, will use z-index store to ensure always on top
	export let showCloseButton = true;

	let bannerId;

	const onClickCloseButton = () => {
		showBanner = false;
	};

	let notificationContainerCss = css`
		font-size: ${jdgSizes.fontSizeBodyXSm};
		z-index: ${forceOnTop ? incrementHighestZIndex() : 1};
		color: ${jdgColors.text};
	`;

	const notificationMessageContainerCss = css`
		margin: 0 ${jdgSizes.headerSidePadding} 0 ${jdgSizes.headerSidePadding};
	`;

	onMount(() => {
		if (standalone) {
			// give this banner a unique id
			bannerId = uuidv4();
		}
	});

	// Ensure the icon updates if the notification type updates
	$: {
		faIcon = 'fa-solid ' + notificationType?.faIcon;
	}

	// Dynamic styles
	$: {
		notificationContainerCss = css`
			${notificationContainerCss};
			background-color: ${backgroundColor ?? notificationType?.color};
		`;
	}
</script>

{#if showBanner}
	<div class="notification-banner-outer-container {notificationContainerCss}" transition:slide>
		<!-- Icon and message -->
		<div class="notification-banner-message-container {notificationMessageContainerCss}">
			<i class={'fa-solid ' + faIcon} />
			{message}
		</div>
		<div class="notification-button-container">
			<slot />
			{#if showCloseButton}
				<JDGButton
					onClickFunction={onClickCloseButton}
					faIcon={'fa-circle-xmark'}
					label={null}
					backgroundColor="transparent"
					paddingTopBottom="6px"
					paddingLeftRight="6px"
					tooltip="Dismiss"
					textColor={darkenColor(notificationType.color, 0.4).toString()}
					textColorHover={darkenColor(notificationType.color, 0.8).toString()}
					backgroundColorHover="transparent"
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
	.notification-banner-outer-container {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 100%;
		width: -moz-available;
		width: -webkit-fill-available;
		padding: 10px;
	}

	.notification-banner-message-container {
		display: flex;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		gap: 7px;
	}

	.notification-button-container {
		position: absolute;
		display: flex;
		right: 10px;
	}
</style>
