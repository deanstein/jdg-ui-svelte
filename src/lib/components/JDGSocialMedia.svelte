<script>
	import { css } from '@emotion/css';
	import { JDGGridLayout } from '$lib/index.js';

	export let iconSize = '2rem';
	export let instagramHref = undefined;

	const faClass = 'fa-brands';
	const instagramFaIcon = 'fa-instagram';

	const fontClass = css`
		font-size: ${iconSize};
	`;
</script>

<JDGGridLayout>
	{#if instagramHref}
		<i class="{fontClass} {faClass} {instagramFaIcon}" />
	{/if}
</JDGGridLayout>
