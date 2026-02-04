<script>
	import {
		JDGBodyCopy,
		JDGButton,
		JDGCheckbox,
		JDGContentBoxFloating,
		JDGContentContainer
	} from '$lib/index.js';

	let syncDryRun = true;
	let syncOutput = '';
	let syncRunning = false;
	$: syncButtonLabel = syncRunning ? 'Running…' : 'Run sync';

	async function runSync() {
		syncRunning = true;
		syncOutput = '';
		try {
			const res = await fetch('/api/backfill-releases', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dryRun: syncDryRun })
			});
			const data = await res.json();
			syncOutput = Array.isArray(data.output) ? data.output.join('\n') : data.error ?? 'No output';
			if (!res.ok && data.error) {
				syncOutput = (syncOutput ? syncOutput + '\n\n' : '') + 'Error: ' + data.error;
			}
		} catch (e) {
			syncOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			syncRunning = false;
		}
	}
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating title="TOOLS">
		<JDGBodyCopy paddingTop="0" textAlign="center">
			<b>NPM + GitHub Version Sync</b>
			<br />
			Backfill GitHub releases and tags to match published npm versions.
			<br />
			<div class="sync-controls">
				<JDGCheckbox label="Dry run" bind:isChecked={syncDryRun} isEnabled={!syncRunning} />
				<JDGButton label={syncButtonLabel} onClickFunction={runSync} isEnabled={!syncRunning} />
			</div>
			{#if syncOutput}
				<pre class="sync-output">{syncOutput}</pre>
			{/if}
		</JDGBodyCopy>

		<JDGBodyCopy paddingTop="1.5rem" textAlign="center">
			<b>Clean image registry</b>
			<br />
			One-time cleanup script: rewrites JS files that use instantiateObject(...) or postProcessImageAttributes(...)
			by unwrapping those calls and leaving plain object literals. Use when migrating image registry
			files to a simpler format. Run from CLI (<code>src/lib/tools/clean-image-registry.js</code>);
			no UI.
		</JDGBodyCopy>

		<JDGBodyCopy paddingTop="1rem" textAlign="center">
			<b>Convert image registry to JSON</b>
			<br />
			One-time migration: reads the imageMetaRegistry from image-meta-registry.js and writes it as pretty-printed
			JSON to image-meta-registry.json. Run from CLI (<code
				>src/lib/tools/convert-image-registry-to-json.js</code
			>); no UI.
		</JDGBodyCopy>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	.sync-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		margin: 0.5rem 0 1rem;
	}

	.sync-output {
		text-align: left;
		white-space: pre-wrap;
		word-break: break-word;
		max-height: 400px;
		overflow: auto;
		font-size: 0.85rem;
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 1rem;
		border-radius: 6px;
		margin: 0.5rem 0 0;
	}
</style>
