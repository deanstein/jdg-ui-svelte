<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import uiState from './stores/uiState.js';

	import {
		addNotificationBannerToState,
		removeNotificationBannerFromState,
		incrementHighestZIndex
	} from './jdg-ui-management.js';
	import { jdgSizes, jdgColors } from './jdg-styling-constants.js';
	import { getIsValueInArray } from './jdg-utils.js';
	import { JDGButton } from './index.js';

	export let message = 'This is a notification banner.';
	export let color = jdgColors.notificationInformation;
	export let standalone = true; // set to false if included in a header already in a fixed position
	export let forceOnTop = false; // if true, will use z-index store to ensure always on top
	export let showCloseButton = true;

	let bannerId;
	let showBanner;

	const onClickCloseButton = () => {
		removeNotificationBannerFromState(bannerId);
	};

	const notificationContainerCss = css`
		font-size: ${jdgSizes.fontSizeNotification};
		z-index: ${forceOnTop ? incrementHighestZIndex() : 1};
		background-color: ${color};
		color: ${jdgColors.text};
	`;

	const notificationMessageContainerCss = css`
		margin: 0 ${jdgSizes.headerSidePadding} 0 ${jdgSizes.headerSidePadding};
	`;

	onMount(() => {
		if (standalone) {
			// give this banner a unique id
			bannerId = uuidv4();
			addNotificationBannerToState(bannerId);
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
					color={jdgColors.buttonPrimary}
					colorHover={jdgColors.buttonPrimary}
					backgroundColor="transparent"
					backgroundColorHover={jdgColors.hoverBackground}
					tooltip="Dismiss"
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
