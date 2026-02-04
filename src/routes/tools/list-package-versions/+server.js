import { handleListPackageVersions } from '$lib/tools/list-package-versions-endpoint.js';

export async function GET() {
	return handleListPackageVersions();
}
