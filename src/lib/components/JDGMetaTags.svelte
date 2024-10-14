<script>
	// this component sets meta tags and also the <title> and favicon, instead of in app.html
	// should be used at +layout.svelte with good site-wide defaults
	// then each +page.svelte gets a +page.js with a load() function that sets per-page tags and title

	export let title1 = undefined; // for example, the website name
	export let title2 = undefined; // for example, a page name
	export let titleSeparator = ' | '; // used between title1 and title2
	export let imageSrc = undefined; // URL or path to an image supporting the description
	export let description = undefined; // short blurb about the page
	export let faviconSrc = undefined; // likely doesn't need to be set per-page
	export let url = undefined;
	export let type = 'website';

	let combinedTitle;
	// keep combined title and <title> tags updated
	$: {
		if (title1 && title2) {
			combinedTitle = title1 + titleSeparator + title2;
		} else if (title1 && title1 !== '') {
			combinedTitle = title1;
		} else {
			combinedTitle = title2;
		}
		// force update the title so the browser tab always shows the latest
		if (typeof document !== 'undefined') {
			console.log('FORCING TITLE CHANGE!', title1, title2, combinedTitle);
			document.title = combinedTitle;
		}
	}
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
