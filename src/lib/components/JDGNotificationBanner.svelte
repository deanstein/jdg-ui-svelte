<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import uiState from '../states/ui-state.js';

	import {
		addNotificationBanner,
		removeNotificationBanner,
		incrementHighestZIndex
	} from '../jdg-state-management.js';
	import { jdgColors, jdgSizes } from '../jdg-shared-styles.js';
	import { darkenColor, getIsValueInArray } from '../jdg-utils.js';
	import { JDGButton } from '../index.js';

	// possible notification types

	export let notificationType = 'information'; // default type
	export let message = jdgNotificationTypes[notificationType].message;
	export let backgroundColor = undefined; // type color can be overridden
	export let standalone = true; // set to false if included in a header already in a fixed position
	export let forceOnTop = false; // if true, will use z-index store to ensure always on top
	export let showCloseButton = true;

	let bannerId;
	let showBanner;

	const onClickCloseButton = () => {
		removeNotificationBanner(bannerId);
	};

	const notificationContainerCss = css`
		font-size: ${jdgSizes.fontSizeBodyXSm};
		z-index: ${forceOnTop ? incrementHighestZIndex() : 1};
		background-color: ${backgroundColor ?? jdgNotificationTypes[notificationType].color};
		color: ${jdgColors.text};
	`;

	const notificationMessageContainerCss = css`
		margin: 0 ${jdgSizes.headerSidePadding} 0 ${jdgSizes.headerSidePadding};
	`;

	onMount(() => {
		if (standalone) {
			// give this banner a unique id
			bannerId = uuidv4();
			addNotificationBanner(bannerId);
		}
	});

	$: {
		showBanner = getIsValueInArray($uiState.activeNotificationBanners, bannerId);
	}
</script>

{#if showBanner}
	<div class="notification-banner-outer-container {notificationContainerCss}">
		<div class="notification-banner-message-container {notificationMessageContainerCss}">
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
					textColor={darkenColor(jdgNotificationTypes[notificationType].color, 0.4).toString()}
					textColorHover={darkenColor(jdgNotificationTypes[notificationType].color, 0.8).toString()}
					backgroundColorHover="transparent"
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
	.notification-banner-outer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 100%;
		width: -moz-available;
		width: -webkit-fill-available;
		padding: 5px;
	}

	.notification-banner-message-container {
		flex-grow: 1;
	}

	.notification-button-container {
		right: 15px;
	}
</style>
