<script>
	import { css } from '@emotion/css';

	export let quote = 'This is a quote from someone about something.';
	export let quoteAttribution = 'Someone Profound';
</script>

<div class="jdg-pull-quote-container">
	<div class="pull-quote">
		{`"${quote}"`}
	</div>
	<div class="pull-quote-attribution">
		{quoteAttribution}
	</div>
</div>

<style>
	.jdg-pull-quote-container {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.pull-quote {
		font-size: 3rem;
		color: white;
		text-align: center;
	}

	.pull-quote-attribution {
		font-size: 1.25rem;
		color: white;
		text-align: center;
	}
</style>
