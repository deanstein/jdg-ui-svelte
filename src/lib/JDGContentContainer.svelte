<script>
	import { css } from '@emotion/css';

	import uiState from './stores/uiState.js';

	import { getDistanceToBottomOfHeader } from './jdg-ui-management.js';

	let contentContainerCss;

	$: {
		$uiState.activeNotificationBanners; // forces an update when uiState updates
		const getDistanceToBottomOfHeaderResult = getDistanceToBottomOfHeader();
		contentContainerCss = css`
			margin-top: ${getDistanceToBottomOfHeaderResult.value.toString() +
			getDistanceToBottomOfHeaderResult.unit};
		`;
	}
</script>

<div class="jdg-content-container {contentContainerCss}">
	<slot />
</div>

<style>
	.jdg-content-container {
		display: flex;
		flex-direction: column;
		gap: 10vh;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 70vh;
		padding: 10vh 0 10vh 0;
	}
</style>
