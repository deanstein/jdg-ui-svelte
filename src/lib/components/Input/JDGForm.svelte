<script>
	// Gap between form elements
	export let gap = '20px';
	// Expose the container element for parent binding
	export let containerRef = undefined;
</script>

<div bind:this={containerRef} class="jdg-form" style:gap>
	<slot />
</div>

<style>
	.jdg-form {
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		width: 100%;
		box-sizing: border-box;
	}
</style>
