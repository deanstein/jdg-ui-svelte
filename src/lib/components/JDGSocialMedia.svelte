<script>
	import { css } from '@emotion/css';
	import { JDGGridLayout } from '$lib/index.js';

	export let iconSize = '2rem';
	export let instagramHref = undefined;
	export let facebookHref = undefined;
	export let youtubeHref = undefined;
	export let linkedinHref = undefined;
	export let githubHref = undefined;

	const faClass = 'fa-brands';
	const instagramFaIcon = 'fa-instagram';
	const facebookFaIcon = 'fa-facebook';
	const youtubeFaIcon = 'fa-youtube';
	const linkedinFaIcon = 'fa-linkedin';
	const githubFaIcon = 'fa-github';

	const fontClass = css`
		font-size: ${iconSize};
	`;
</script>

<div class="jdg-social-media">
	<JDGGridLayout forceMaxColumns={true}>
		{#if instagramHref}
			<a href={instagramHref} target="_blank" class="no-initial-highlight">
				<i class="{fontClass} {faClass} {instagramFaIcon}" />
			</a>
		{/if}
		{#if facebookHref}
			<a href={facebookHref} target="_blank" class="no-initial-highlight">
				<i class="{fontClass} {faClass} {facebookFaIcon}" />
			</a>
		{/if}
		{#if youtubeHref}
			<a href={youtubeHref} target="_blank" class="no-initial-highlight">
				<i class="{fontClass} {faClass} {youtubeFaIcon}" />
			</a>
		{/if}
		{#if linkedinHref}
			<a href={linkedinHref} target="_blank" class="no-initial-highlight">
				<i class="{fontClass} {faClass} {linkedinFaIcon}" />
			</a>
		{/if}
		{#if githubHref}
			<a href={githubHref} target="_blank" class="no-initial-highlight">
				<i class="{fontClass} {faClass} {githubFaIcon}" />
			</a>
		{/if}
	</JDGGridLayout>
</div>

<style>
	a {
		text-align: center;
		max-width: fit-content;
	}
</style>
