<script>
	import { onMount } from 'svelte';

	export let packageName;
	export let defaultVersion = 'v0.0.0';
	export let showIfInvalid = true;

	let version = defaultVersion;

	async function fetchLatestNpmVersion(packageName) {
		try {
			const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
			if (!res.ok) throw new Error('Failed to fetch');
			const data = await res.json();
			return data.version ? `v${data.version}` : defaultVersion;
		} catch (e) {
			console.error('Error fetching npm version:', e);
			return defaultVersion;
		}
	}

	onMount(async () => {
		if (packageName) {
			version = await fetchLatestNpmVersion(packageName);
		}
	});
</script>

{#if showIfInvalid}
	<div class="jdg-npm-package-version">
		{version}
	</div>
{:else if packageName && version !== defaultVersion}
	<div class="jdg-npm-package-version">
		{version}
	</div>
{/if}

<style>
</style> 