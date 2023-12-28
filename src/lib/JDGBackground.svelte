<script>
    // used only if no background is provided by the host app
    import placeholderBackgroundSrc from './images/jdg-background.jpg'

	export let backgroundSrc = placeholderBackgroundSrc;
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
