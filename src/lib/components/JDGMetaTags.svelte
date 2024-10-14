<script>
	import { onMount } from "svelte";

	// this component sets meta tags
	// and can be used both at the +layout.svelte and +page.svelte levels
	// best practice is to use this at +layout.svelte and override when needed on +page.svelte

	export let title1 = undefined; // for example, the website name
	export let title2 = undefined; // for example, a page name
	export let titleSeparator = ' | '; // used between title1 and title2
	export let imageSrc = undefined; // URL or path to an image supporting the description
	export let description = undefined; // short blurb about the page
	export let faviconSrc = undefined; // primarily for the +layout.svelte level but can be used at +page.svelte too
	export let url = undefined;
	export let type = 'website';

	let combinedTitle;
	if (title1 && title2) {
		combinedTitle = title1 + titleSeparator + title2;
	} else if (title1 && title1 !== '') {
		combinedTitle = title1;
	} else {
		combinedTitle = title2;
	}

	onMount(() => {
		// remove all tags to ensure this overrides
		document.querySelectorAll('meta[property^="og:"], link[rel="icon"]').forEach(tag => tag.remove());
	})
</script>

<svelte:head>
	{#if combinedTitle}<title>{combinedTitle}</title>{/if}
	{#if combinedTitle}<meta property="og:title" content={combinedTitle} />{/if}
	{#if imageSrc}<meta property="og:image" content={imageSrc} />{/if}
	{#if description}<meta property="og:description" content={description} />{/if}
	{#if faviconSrc}<link rel="icon" href={faviconSrc} />{/if}
	{#if url}
		<meta property="og:url" content={url} />
	{/if}
	<meta property="og:type" content={type} />
</svelte:head>
