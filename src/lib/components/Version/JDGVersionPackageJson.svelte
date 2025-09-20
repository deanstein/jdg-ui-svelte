<script>
	import { onMount } from 'svelte';
	import { fetchJsonFromRepo } from '$lib/jdg-persistence-management.js';

	export let repoOwner;
	export let repoName;
	export let defaultVersion = 'v0.0.0';
	export let showIfInvalid = true; // if bad response from repo, show the default version

	let versionData = { version: defaultVersion };
	let version = defaultVersion;

	onMount(async () => {
		versionData = await fetchJsonFromRepo(repoOwner, repoName, 'package.json');
		version = versionData.version;
	});
</script>

{#if showIfInvalid}
	<div class="jdg-repo-package-version">
		v{version}
	</div>
{:else if repoOwner && repoName && versionData && versionData.version !== defaultVersion}
	<div class="jdg-repo-package-version">
		v{version}
	</div>
{/if}

<style>
</style>
