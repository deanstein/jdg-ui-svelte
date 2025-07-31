<script>
	import { JDGH3H4 } from '$lib/index.js';

	export let store;
	export let storeName = 'Store';
	const undefinedRepString = 'undefined';
</script>

<div class="jdg-storeview-container">
	<div class="jdg-storeview-title-and-output">
		<JDGH3H4 h3String={storeName.toUpperCase()} paddingTop="20px" />

		<div class="jdg-storeview-output">
			{#each Object.entries($store) as [key, value] (key)}
				<div class="jdg-storeview-entry">
					<b>{key}</b>: {JSON.stringify(value === undefined ? undefinedRepString : value, null, 2)}
				</div>
				<br />
			{/each}
		</div>
	</div>
</div>

<style>
	.jdg-storeview-container {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		padding: 20px;
	}

	.jdg-storeview-title-and-output {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.jdg-storeview-output {
		display: flex;
		flex-direction: column;
		text-align: center;
		max-width: 600px;
		padding-top: 20px;
		gap: 0.25rem;
		-webkit-touch-callout: text;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
		font-family: monospace;
		white-space: pre-wrap;
	}

	.jdg-storeview-entry {
		margin-bottom: 4px;
	}
</style>
