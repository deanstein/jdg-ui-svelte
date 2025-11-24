<script>
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import jdgNotificationTypes from '$lib/schemas/jdg-notification-types.js';

	import { incrementHighestZIndex } from '$lib/jdg-state-management.js';
	import { jdgColors, jdgSizes } from '$lib/jdg-shared-styles.js';
	import { darkenColor } from '$lib/jdg-utils.js';
	import { JDGButton, topLevelBannerCumulativeHeightPx } from '$lib/index.js';

	export let showBanner = true;
	// Defines color and icon
	export let notificationType = jdgNotificationTypes.information;
	export let faIcon = 'fa-solid ' + notificationType.faIcon;
	export let message = jdgNotificationTypes.information.message;
	export let backgroundColor = undefined;
	// Set to true if banner should shift entire layout down
	export let isTopLevel = false;
	export let forceOnTop = false; // if true, will use z-index store to ensure always on top
	export let showCloseButton = true;

	let bannerContainerRef;
	let resizeObserver;
	let bannerHeight = 0;

	const onClickCloseButton = () => {
		showBanner = false;
	};

	// Update the banner height in the store
	const updateHeight = () => {
		const newHeight = bannerContainerRef?.offsetHeight ?? 0;
		if (newHeight !== bannerHeight) {
			topLevelBannerCumulativeHeightPx.update((total) => total - bannerHeight + newHeight);
			bannerHeight = newHeight;
		}
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
		// Top-level banners need to add their height to the cumulative height store
		if (isTopLevel) {
			updateHeight();
			resizeObserver = new ResizeObserver(updateHeight);
			resizeObserver.observe(bannerContainerRef);
		}
	});

	onDestroy(() => {
	// Remove observer and update height
	if (isTopLevel) {
			resizeObserver.disconnect();
		topLevelBannerCumulativeHeightPx.update((total) => total - bannerHeight);
	}
	});

	// Ensure the icon updates if the notification type updates
	$: {
		faIcon = 'fa-solid ' + notificationType.faIcon;
	}

	// Dynamic styles
	$: {
		notificationContainerCss = css`
			${notificationContainerCss};
			background-color: ${backgroundColor ?? notificationType.color};
		`;
	}
</script>

{#if showBanner}
	<div
		bind:this={bannerContainerRef}
		class="notification-banner-outer-container {notificationContainerCss}"
		transition:slide
	>
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
