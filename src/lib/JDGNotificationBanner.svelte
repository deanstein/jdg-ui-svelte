<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import uiState from './stores/uiState.js';

	import {
		getHighestZIndex,
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

	const headerContainerCss = css`
		position: ${standalone ? 'fixed' : 'relative'};
		height: ${jdgSizes.notificationHeight};
		z-index: ${forceOnTop ? incrementHighestZIndex() : 1};
		background-color: ${color};
		color: ${jdgColors.text};
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
	<div class="notification-banner-outer-container {headerContainerCss}">
		{message}
		<div class="notification-button-container">
			<slot />
			{#if showCloseButton}
				<JDGButton
					onClickFunction={onClickCloseButton}
					faIcon={'fa-circle-xmark'}
					label={null}
					color={jdgColors.buttonPrimary}
					colorHover={jdgColors.hover}
					backgroundColor="transparent"
					backgroundColorHover="transparent"
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
		font-size: 1.5vh;
		height: 3vh;
		width: 100%;
		width: -moz-available;
		width: -webkit-fill-available;
	}

	.notification-button-container {
		display: grid;
		margin-left: 0.75vw;
		gap: 0.75vw;
	}
</style>
