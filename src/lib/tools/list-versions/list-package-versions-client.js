/**
 * Browser-safe: list npm package versions and GitHub repo tags (fetch only, no Node).
 * Used by the tools page, main page "List versions" button, and the list-versions CLI.
 * No app imports so Node can run the CLI without $lib.
 */
const PACKAGE_NAME = 'jdg-ui-svelte';
const REPO = 'deanstein/jdg-ui-svelte';

/**
 * @param {{ log?: string[] }} [options]
 * @returns {Promise<string[]>}
 */
export async function listPackageVersions({ log: out = [] } = {}) {
	const ln = (msg) => out.push(msg);

	ln(`Package: ${PACKAGE_NAME}`);
	ln(`Repo: ${REPO}`);
	ln('');

	ln('Fetching versions from npm…');
	const npmData = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`).then((r) => r.json());
	const npmVersions = Object.keys(npmData.versions ?? {});
	ln(`NPM versions (${npmVersions.length}):`);
	if (npmVersions.length) {
		ln(npmVersions.join(', '));
	} else {
		ln('(none)');
	}
	ln('');

	ln('Fetching tags from GitHub…');
	const tagsRes = await fetch(`https://api.github.com/repos/${REPO}/tags`, {
		headers: { Accept: 'application/vnd.github.v3+json' }
	});
	if (!tagsRes.ok) {
		ln(`GitHub API error: ${tagsRes.status} ${tagsRes.statusText}`);
		return out;
	}
	const tagsData = await tagsRes.json();
	const tagNames = (tagsData ?? []).map((t) => t.name);
	ln(`GitHub tags (${tagNames.length}):`);
	if (tagNames.length) {
		ln(tagNames.join(', '));
	} else {
		ln('(none)');
	}
	ln('');
	ln('Done.');
	return out;
}
