/**
 * CLI: Backfill GitHub releases and tags to match published npm versions.
 * Run from repo root:
 *   yarn backfill                         — preview (dry run)
 *   yarn backfill --limit 10              — preview: at most 10 that need tagging
 *   yarn backfill --hard-limit 1          — only consider the newest version (fast when only latest is missing)
 *   yarn backfill --execute               — create tags and releases for real
 *   yarn backfill --execute --hard-limit 1 — create release for latest only
 */
import { runBackfill } from './backfill-releases-standalone.js';

const args = process.argv.slice(2);
const execute = args.includes('--execute');
const limitIdx = args.indexOf('--limit');
const limit =
	limitIdx >= 0 && args[limitIdx + 1] != null && Number.isFinite(Number(args[limitIdx + 1]))
		? Math.floor(Number(args[limitIdx + 1]))
		: undefined;
const hardLimitIdx = args.indexOf('--hard-limit');
const hardLimit =
	hardLimitIdx >= 0 &&
	args[hardLimitIdx + 1] != null &&
	Number.isFinite(Number(args[hardLimitIdx + 1]))
		? Math.floor(Number(args[hardLimitIdx + 1]))
		: undefined;

const log = [];
await runBackfill({ dryRun: !execute, log, limit, hardLimit });
console.log(log.join('\n'));
