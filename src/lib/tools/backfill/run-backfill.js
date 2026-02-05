/**
 * CLI: Backfill GitHub releases and tags to match published npm versions.
 * Run from repo root:
 *   yarn backfill              — preview (dry run)
 *   yarn backfill --limit 10   — preview, limit to 10 versions
 *   yarn backfill --execute    — create tags and releases for real
 */
import { runBackfill } from './backfill-releases-standalone.js';

const args = process.argv.slice(2);
const execute = args.includes('--execute');
const limitIdx = args.indexOf('--limit');
const limit =
	limitIdx >= 0 && args[limitIdx + 1] != null && Number.isFinite(Number(args[limitIdx + 1]))
		? Math.floor(Number(args[limitIdx + 1]))
		: undefined;

const log = [];
await runBackfill({ dryRun: !execute, log, limit });
console.log(log.join('\n'));
