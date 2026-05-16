<script>
	import { JDGOverlay } from '$lib/index.js';

	export let iconSrc =
		'https://res.cloudinary.com/jdg-main/image/upload/v1718070772/jdg-ui-svelte/jdg-ui-logo_cs4ji5.jpg';
	export let faIcon = 'fa-wrench';
	export let message = "We're working on some things. Try again shortly.";
</script>

<div class="jdg-maintenance-overlay-container">
	<JDGOverlay showTitleBar={false} closeOnOverlayClick={false}>
		<div class="jdg-maintenance-overlay-flex">
			<img src={iconSrc} class="jdg-maintenance-overlay-icon" alt="Maintenance" />
			<i class="fa-solid {faIcon} jdg-maintenance-overlay-fa-icon" />
			<p class="jdg-maintenance-overlay-message">
				{message}
			</p>
		</div>
	</JDGOverlay>
</div>

<style>
	.jdg-maintenance-overlay-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.jdg-maintenance-overlay-flex {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20px;
	}

	.jdg-maintenance-overlay-icon {
		max-height: 50px;
		object-fit: fill;
	}

	.jdg-maintenance-overlay-fa-icon {
		font-size: 1.5rem;
		opacity: 0.6;
	}

	.jdg-maintenance-overlay-message {
		font-size: 1.1rem;
		text-align: center;
		opacity: 0.8;
	}
</style>
