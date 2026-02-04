import { runBackfill } from '$lib/tools/backfill-releases.js';

/**
 * Handle POST for backfill/release sync. Body: { dryRun?: boolean, limit?: number }.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function handleBackfillReleases(request) {
	let dryRun = true;
	let limit;
	try {
		const body = await request.json().catch(() => ({}));
		dryRun = body.dryRun !== false;
		if (body.limit != null && Number.isFinite(body.limit) && body.limit > 0) {
			limit = Math.floor(body.limit);
		}
	} catch {
		// keep default dryRun true
	}

	const log = [];
	try {
		await runBackfill({ dryRun, log, limit });
		return new Response(JSON.stringify({ ok: true, output: log }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		log.push('');
		log.push(`Error: ${err?.message ?? String(err)}`);
		return new Response(
			JSON.stringify({ ok: false, output: log, error: err?.message ?? String(err) }),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
}
