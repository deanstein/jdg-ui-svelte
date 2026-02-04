<script>
	import {
		JDGBodyCopy,
		JDGButton,
		JDGContentBoxFloating,
		JDGContentContainer
	} from '$lib/index.js';

	let syncOutput = '';
	let previewRunning = false;
	let dryRunRunning = false;
	let executeRunning = false;
	let previewGenerated = false;
	let dryRunCompleted = false;
	$: previewButtonLabel = previewRunning ? 'Running…' : '1. Preview';
	$: dryRunButtonLabel = dryRunRunning ? 'Running…' : '2. Dry run';
	$: executeButtonLabel = executeRunning ? 'Running…' : '3. Execute';
	$: anyRunning = previewRunning || dryRunRunning || executeRunning;
	$: dryRunButtonEnabled = previewGenerated && !anyRunning;
	$: executeButtonEnabled = dryRunCompleted && !anyRunning;

	/** Step 1: List npm versions and GitHub tags only (no git, no token). */
	async function runPreviewSync() {
		previewRunning = true;
		syncOutput = '';
		try {
			const res = await fetch('/api/list-package-versions');
			const data = await res.json();
			syncOutput = Array.isArray(data.output) ? data.output.join('\n') : data.error ?? 'No output';
			if (!res.ok && data.error) {
				syncOutput = (syncOutput ? syncOutput + '\n\n' : '') + 'Error: ' + data.error;
			} else {
				previewGenerated = true;
			}
		} catch (e) {
			syncOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			previewRunning = false;
		}
	}

	/** Step 2: Full backfill logic with dryRun=true – same APIs as Execute, but no tags/releases created. */
	async function runDryRun() {
		dryRunRunning = true;
		syncOutput = '';
		try {
			const res = await fetch('/api/backfill-releases', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dryRun: true })
			});
			const data = await res.json();
			syncOutput = Array.isArray(data.output) ? data.output.join('\n') : data.error ?? 'No output';
			if (!res.ok && data.error) {
				syncOutput = (syncOutput ? syncOutput + '\n\n' : '') + 'Error: ' + data.error;
			} else {
				dryRunCompleted = true;
			}
		} catch (e) {
			syncOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			dryRunRunning = false;
		}
	}

	/** Step 3: Run backfill for real – creates tags and releases. */
	async function runSyncExecute() {
		executeRunning = true;
		syncOutput = '';
		try {
			const res = await fetch('/api/backfill-releases', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dryRun: false })
			});
			const data = await res.json();
			syncOutput = Array.isArray(data.output) ? data.output.join('\n') : data.error ?? 'No output';
			if (!res.ok && data.error) {
				syncOutput = (syncOutput ? syncOutput + '\n\n' : '') + 'Error: ' + data.error;
			}
		} catch (e) {
			syncOutput = 'Error: ' + (e?.message ?? String(e));
		} finally {
			executeRunning = false;
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
				<JDGButton
					label={previewButtonLabel}
					faIcon="fa-eye"
					onClickFunction={runPreviewSync}
					isEnabled={!anyRunning}
					paddingLeftRight="0.65rem"
					paddingTopBottom="0.35rem"
				/>
				<JDGButton
					label={dryRunButtonLabel}
					faIcon="fa-list-check"
					onClickFunction={runDryRun}
					isEnabled={dryRunButtonEnabled}
					paddingLeftRight="0.65rem"
					paddingTopBottom="0.35rem"
				/>
				<JDGButton
					label={executeButtonLabel}
					faIcon="fa-sync"
					onClickFunction={runSyncExecute}
					isEnabled={executeButtonEnabled}
					paddingLeftRight="0.65rem"
					paddingTopBottom="0.35rem"
				/>
			</div>
			<p class="sync-hint">
				1. Preview: list npm versions and GitHub tags. 2. Dry run: same as Execute but no changes.
				3. Execute: create tags and releases.
			</p>
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
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
		margin: 0.5rem 0 1rem;
	}

	.sync-hint {
		font-size: 0.85rem;
		color: var(--jdg-text-secondary, #666);
		margin: 0.25rem 0 0.5rem;
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
