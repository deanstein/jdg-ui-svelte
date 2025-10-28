<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';
	import { activeNotificationBanners } from '$lib/stores/jdg-ui-store.js';

	import {
		addNotificationBanner,
		removeNotificationBanner,
		incrementHighestZIndex
	} from '$lib/jdg-state-management.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { darkenColor, getIsValueInArray } from '$lib/jdg-utils.js';
	import { JDGButton } from '$lib/index.js';

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
		showBanner = getIsValueInArray($activeNotificationBanners, bannerId);
	}
</script>

{#if showBanner}
	<div class="notification-banner-outer-container {notificationContainerCss}" transition:slide>
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
		flex-grow: 1;
	}

	.notification-button-container {
		position: absolute;
		display: flex;
		right: 10px;
	}
</style>
