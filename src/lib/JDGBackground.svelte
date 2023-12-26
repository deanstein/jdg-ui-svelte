<script>
	export let backgroundSrc = './jdg-background.jpg';
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
