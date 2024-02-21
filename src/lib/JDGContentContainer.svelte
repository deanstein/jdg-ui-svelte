<script>
</script>

<div class="jdg-content-container">
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
