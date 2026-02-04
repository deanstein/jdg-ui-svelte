import { listPackageVersions } from '$lib/tools/backfill-releases.js';

/**
 * Handle GET for listing npm versions and GitHub tags.
 * @returns {Promise<Response>}
 */
export async function handleListPackageVersions() {
	const log = [];
	try {
		await listPackageVersions({ log });
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
