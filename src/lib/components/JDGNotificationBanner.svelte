<script>
	import { onMount, tick } from 'svelte';
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
	export let iconSrc = null; // path to SVG/PNG image (takes priority over faIcon if set)
	export let message = notificationType.message;
	export let fontSize = jdgSizes.fontSizeBodyXSm;
	export let backgroundColor = undefined;
	export let standalone = true; // set to false if included in a header already in a fixed position
	export let forceOnTop = false; // if true, will use z-index store to ensure always on top
	export let showCloseButton = true;
	export let scrollToTopOnStatusChange = true; // scroll context to top when transitioning from inProgress

	let bannerId;
	let bannerElement;
	let previousNotificationType = notificationType;

	const onClickCloseButton = () => {
		showBanner = false;
	};

	// Find the nearest scrollable ancestor element
	const findScrollableParent = (element) => {
		if (!element) return null;

		let parent = element.parentElement;
		while (parent) {
			const style = window.getComputedStyle(parent);
			const overflowY = style.overflowY;
			const isScrollable =
				(overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight;

			if (isScrollable) {
				return parent;
			}
			parent = parent.parentElement;
		}
		return null;
	};

	// Scroll the containing context to the top
	const scrollContextToTop = async () => {
		await tick(); // Wait for DOM to update
		const scrollableParent = findScrollableParent(bannerElement);
		if (scrollableParent) {
			scrollableParent.scrollTo({ top: 0, behavior: 'smooth' });
		} else {
			// Fall back to window scroll
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	let notificationContainerCss = css`
		font-size: ${fontSize};
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

	// Watch for transitions to inProgress (so user sees it start) and from inProgress to final status
	$: if (notificationType !== previousNotificationType) {
		if (scrollToTopOnStatusChange) {
			// Scroll when entering inProgress state
			if (notificationType === jdgNotificationTypes.inProgress) {
				scrollContextToTop();
			}
			// Scroll when leaving inProgress state (to see the result)
			else if (previousNotificationType === jdgNotificationTypes.inProgress) {
				scrollContextToTop();
			}
		}
		previousNotificationType = notificationType;
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
	<div
		bind:this={bannerElement}
		class="notification-banner-outer-container {notificationContainerCss}"
		transition:slide
	>
		<!-- Icon and message -->
		<div class="notification-banner-message-container {notificationMessageContainerCss}">
			{#if iconSrc}
				<img src={iconSrc} alt="" class="notification-banner-icon" />
			{:else}
				<i class={'fa-solid ' + faIcon} />
			{/if}
			<span class="notification-banner-message">{message}</span>
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
		flex-wrap: wrap;
	}

	.notification-banner-icon {
		height: 1.2em;
		width: auto;
		object-fit: contain;
	}

	.notification-banner-message {
		text-wrap: balance;
	}

	.notification-button-container {
		position: absolute;
		display: flex;
		right: 10px;
	}
</style>
