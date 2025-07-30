<script>
	import { JDGH3H4 } from '$lib/index.js';
    import { onDestroy } from 'svelte';

	export let store;
	export let storeName = 'Store';

	let storeValue;
	let undefinedRepString = 'undefined';

	const unsubscribe = store.subscribe(value => {
		storeValue = value;
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="jdg-storeview-container">
    <JDGH3H4 h3String={storeName.toUpperCase()} paddingTop="20px" />
	<div class="jdg-storeview-output">
		<div class="jdg-store-container">
			<pre>{JSON.stringify(
				storeValue,
				(key, value) => value === undefined ? undefinedRepString : value,
				2
			)}</pre>
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

	.jdg-storeview-output {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		-webkit-touch-callout: text;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}
</style>