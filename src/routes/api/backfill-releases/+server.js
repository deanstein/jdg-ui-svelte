import { runBackfill } from '$lib/tools/backfill-releases.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let dryRun = true;
	try {
		const body = await request.json().catch(() => ({}));
		dryRun = body.dryRun !== false;
	} catch {
		// keep default dryRun true
	}

	const log = [];
	try {
		await runBackfill({ dryRun, log });
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
