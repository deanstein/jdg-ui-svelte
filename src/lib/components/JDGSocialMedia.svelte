<script>
	import { css } from '@emotion/css';
	import { JDGGridLayout } from '$lib/index.js';

	export let iconSize = '2rem';
	export let instagramHref = undefined;
	export let facebookHref = undefined;
	export let youtubeHref = undefined;
	export let linkedinHref = undefined;

	const faClass = 'fa-brands';
	const instagramFaIcon = 'fa-instagram';
	const facebookFaIcon = 'fa-facebook';
	const youtubeFaIcon = 'fa-youtube';
	const linkedinFaIcon = 'fa-linkedin';

	const fontClass = css`
		font-size: ${iconSize};
	`;
</script>

<JDGGridLayout forceMaxColumns={true}>
	{#if instagramHref}
		<a href={instagramHref} class="no-initial-highlight">
			<i class="{fontClass} {faClass} {instagramFaIcon}" />
		</a>
	{/if}
	{#if facebookHref}
		<a href={facebookHref} class="no-initial-highlight">
			<i class="{fontClass} {faClass} {facebookFaIcon}" />
		</a>
	{/if}
	{#if youtubeHref}
		<a href={youtubeHref} class="no-initial-highlight">
			<i class="{fontClass} {faClass} {youtubeFaIcon}" />
		</a>
	{/if}
	{#if linkedinHref}
		<a href={linkedinHref} class="no-initial-highlight">
			<i class="{fontClass} {faClass} {linkedinFaIcon}" />
		</a>
	{/if}
</JDGGridLayout>

<style>
	a {
		text-align: center;
	}
</style>
