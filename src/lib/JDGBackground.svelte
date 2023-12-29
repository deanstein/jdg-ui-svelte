<script>
	export let backgroundSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/jdg-background.jpg'; // default if not passed in from host app
</script>

<div class="jdg-background-container">
	<img src={backgroundSrc} alt="Background" />
</div>

<style>
	.jdg-background-container {
		position: fixed;
		width: 100%;
		height: 100%;
	}

	img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
</style>
