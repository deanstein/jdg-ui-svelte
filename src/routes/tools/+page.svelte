<script>
	import { listPackageVersions } from '$lib/tools/list-versions/list-package-versions-client.js';
	import { allowTextSelection } from '$lib/stores/jdg-ui-store.js';
	import {
		JDGBodyCopy,
		JDGButton,
		JDGContentBoxFloating,
		JDGContentContainer
	} from '$lib/index.js';

	let listOutput = '';
	let listRunning = false;
	async function runListVersions() {
		listRunning = true;
		listOutput = '';
		try {
			const log = [];
			await listPackageVersions({ log });
			listOutput = log.join('\n');
		} catch (e) {
			listOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			listRunning = false;
		}
	}

	allowTextSelection.set(true);
</script>

<JDGContentContainer overlapWithHeader={false}>
	<JDGContentBoxFloating title="TOOLS">
		<JDGBodyCopy paddingTop="0" textAlign="center">
			<b>NPM + GitHub Version Sync</b>
			<br />
			Backfill GitHub releases and tags to match published npm versions.
			<br />
			Run these from the repo root (no env vars needed).
			<br />
			<div class="sync-instructions">
				<div class="sync-step">
					<p class="sync-step-title"><b>1. List versions</b></p>
					<p class="sync-step-desc">npm package versions and GitHub tags (read-only):</p>
					<div class="sync-step-actions">
						<JDGButton
							label={listRunning ? 'Running…' : 'List versions'}
							faIcon="fa-list"
							onClickFunction={runListVersions}
							isEnabled={!listRunning}
							paddingLeftRight="0.65rem"
							paddingTopBottom="0.35rem"
						/>
						<div class="sync-step-or">or:<br /><code>yarn list-versions</code></div>
					</div>
					{#if listOutput}
						<pre class="sync-output">{listOutput}</pre>
					{/if}
				</div>
				<div class="sync-step">
					<p class="sync-step-title"><b>2. Preview sync</b></p>
					<p class="sync-step-desc">
						Dry run, no tags/releases created. <br />
						Optional <code>--limit 10</code> to cap how many would be tagged:
					</p>
					<pre class="cli-block">yarn backfill
yarn backfill --limit 10</pre>
				</div>
				<div class="sync-step">
					<p class="sync-step-title"><b>3. Execute sync</b></p>
					<p class="sync-step-desc">
						Create tags and releases for real.
						<br />
						With <code>--limit 10</code>, each run tags at most 10 that need it; next run continues
						with the next batch:
					</p>
					<pre class="cli-block">yarn backfill --execute
yarn backfill --execute --limit 10</pre>
				</div>
			</div>
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
	.sync-instructions {
		text-align: center;
		max-width: 32em;
		margin: 1rem auto;
	}
	.sync-step {
		margin-top: 1rem;
	}
	.sync-step:first-child {
		margin-top: 0;
	}
	.sync-step-title {
		margin: 0;
	}
	.sync-step-desc {
		margin: 0.25rem 0 0;
		font-size: 0.95em;
	}
	.sync-step-actions {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.5rem 1rem;
		margin-top: 0.5rem;
	}
	.sync-step-or {
		font-size: 0.9em;
		color: var(--jdg-text-secondary, #666);
	}
	.sync-step-or code {
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 0.1rem 0.3rem;
		border-radius: 4px;
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
		margin: 0.5rem auto 0;
		display: block;
		width: 100%;
		max-width: 32em;
		box-sizing: border-box;
	}
	.cli-block {
		text-align: left;
		background: var(--jdg-bg-secondary, #f5f5f5);
		padding: 0.5rem 0.75rem;
		border-radius: 6px;
		font-size: 0.9rem;
		overflow-x: auto;
		margin: 0.5rem auto 0;
		display: block;
		width: fit-content;
		min-width: 18em;
	}
</style>
