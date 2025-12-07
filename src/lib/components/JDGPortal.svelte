<script>
	import { onMount } from 'svelte';
	import { appContainerRef } from '$lib/stores/jdg-ui-store.js';

	// Target can be:
	// - undefined/null: uses JDGAppContainer element from store (recommended)
	// - 'body': uses document.body
	// - CSS selector string: uses document.querySelector result
	export let target = undefined;

	let portalRef;

	onMount(() => {
		let targetEl;

		if (target === undefined || target === null) {
			// Default: use the app container from the store
			targetEl = $appContainerRef || document.body;
		} else if (target === 'body') {
			targetEl = document.body;
		} else {
			targetEl = document.querySelector(target);
		}

		if (targetEl) {
			targetEl.appendChild(portalRef);
		}

		return () => {
			if (portalRef) {
				portalRef.remove();
			}
		};
	});
</script>

<div bind:this={portalRef} class="jdg-portal">
	<slot />
</div>

<style>
	.jdg-portal {
		display: contents;
	}
</style>
