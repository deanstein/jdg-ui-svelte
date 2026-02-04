import { handleBackfillReleases } from '$lib/tools/backfill-releases-endpoint.js';

export async function POST({ request }) {
	return handleBackfillReleases(request);
}
