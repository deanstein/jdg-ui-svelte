<script>
	import { css } from '@emotion/css';
	import { getAccentColors } from '$lib/jdg-state-management.js';
	import { onMount } from 'svelte';

	export let backgroundColor = getAccentColors()[0];

	const accentBlockCss = css`
		background-color: ${backgroundColor};
	`;

	onMount(() => {
		backgroundColor = getAccentColors()[0];
	});
</script>

<div class="jdg-accent-block-container {accentBlockCss}">
	<slot />
</div>

<style>
	.jdg-accent-block-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: -webkit-fill-available;
		width: -moz-available;
		min-height: 200px;
		padding: 25px;
	}
</style>
