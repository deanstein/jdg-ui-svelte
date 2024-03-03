<script>
	import { css } from '@emotion/css';

	export let imgSrc =
		'https://raw.githubusercontent.com/deanstein/jdg-ui-svelte/main/static/history/CCP1.jpg';
	export let imgAlt = 'Full-width';
	export let heightVh = '80vh';

	let fullWidthImageCss = css`
		height: ${heightVh};
	`;
</script>

<div class="jdg-full-width-image-container">
	<img class="jdg-full-width-image {fullWidthImageCss}" src={imgSrc} alt={imgAlt} />
</div>

<style>
	.jdg-full-width-image-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.jdg-full-width-image {
		width: 100%;
		object-fit: cover;
	}
</style>
