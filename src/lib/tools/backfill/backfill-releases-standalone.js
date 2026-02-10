/**
 * Standalone backfill logic for the CLI only. No imports from the rest of the app
 * (no $lib, no jdg-persistence-management) so Node can run it without resolving SvelteKit aliases.
 * Duplicated from backfill-releases.js; keep in sync if that file's runBackfill logic changes.
 */
import { execSync } from 'node:child_process';

const PACKAGE_NAME = 'jdg-ui-svelte';
const REPO_OWNER = 'deanstein';
const REPO_NAME = 'jdg-ui-svelte';
const REPO = `${REPO_OWNER}/${REPO_NAME}`;
const CF_WORKER_JDG_GITHUB = 'https://jdg-github.jdeangoldstein.workers.dev';
const CF_ROUTE_GET_GITHUB_APP_TOKEN = '/get-github-app-token';

function getTokenUrl() {
	const url = new URL(CF_ROUTE_GET_GITHUB_APP_TOKEN, CF_WORKER_JDG_GITHUB);
	url.searchParams.set('repoOwner', REPO_OWNER);
	url.searchParams.set('repoName', REPO_NAME);
	return url.toString();
}

async function getGithubToken() {
	const res = await fetch(getTokenUrl());
	if (!res.ok) {
		const text = await res.text();
		throw new Error(
			`Cloudflare Worker token request failed: ${res.status}${text ? ` - ${text}` : ''}`
		);
	}
	const data = await res.json();
	if (!data.token) {
		throw new Error('Cloudflare Worker did not return a token');
	}
	return data.token;
}

function run(cmd, options = {}) {
	return execSync(cmd, { encoding: 'utf8', ...options }).trim();
}

/** Run a command and capture stderr so it doesn't print (for expected failures, e.g. parent has no package.json). */
function runQuiet(cmd) {
	try {
		return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
	} catch {
		return null;
	}
}

/** Fetch with retries on network failure (e.g. "other side closed"). Does not retry on 4xx/5xx. */
async function fetchWithRetry(url, options, { retries = 3, delayMs = 2000 } = {}) {
	let lastErr;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fetch(url, options);
		} catch (err) {
			lastErr = err;
			if (attempt < retries) await new Promise((r) => setTimeout(r, delayMs));
		}
	}
	throw lastErr;
}

/**
 * @param {{ dryRun?: boolean, log?: string[], limit?: number }} [options] - limit: max tags to create per run (only versions that need a tag); enables incremental runs
 * @returns {Promise<string[]>}
 */
export async function runBackfill({ dryRun = true, log: out = [], limit } = {}) {
	const ln = (msg) => out.push(msg);

	ln(`DRY RUN MODE: ${dryRun ? 'ON' : 'OFF'}`);
	if (limit != null && limit > 0) {
		ln(`Version limit: ${limit} (testing)`);
	}
	ln('Fetching GitHub App token from Cloudflare Worker…');

	const token = await getGithubToken();
	ln('Token acquired successfully');

	ln(`Fetching versions for ${PACKAGE_NAME} from npm…`);
	const npmData = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`).then((r) => r.json());
	let versions = Object.keys(npmData.versions);

	ln(`Found ${versions.length} versions on npm`);

	if (limit != null && limit > 0) {
		ln(`Limit: tag at most ${limit} versions per run (only those that need a tag).`);
	}

	ln('Fetching existing tags from GitHub…');
	const tagsRes = await fetch(`https://api.github.com/repos/${REPO}/tags`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/vnd.github.v3+json'
		}
	});
	const tagsData = tagsRes.ok ? await tagsRes.json() : [];
	const existingTags = Array.isArray(tagsData) ? tagsData.map((t) => t.name) : [];
	ln(`Found ${existingTags.length} existing tags on GitHub.`);

	// Commits that touched package.json (newest first). We tag the commit that *changes*
	// the version field to this value (the version-bump commit), not a later commit that left it as-is.
	const commits = run('git log --pretty=format:%H -- package.json').split('\n').filter(Boolean);
	ln(`Found ${commits.length} commits that modified package.json`);

	let taggedThisRun = 0;
	for (const version of versions) {
		if (limit != null && limit > 0 && taggedThisRun >= limit) {
			ln('');
			ln(`Reached limit of ${limit} tags this run; stopping.`);
			break;
		}
		const tag = `v${version}`;

		ln('');
		ln('----------------------------------------');
		ln(`Version: ${version}`);
		ln(`Tag:     ${tag}`);

		if (existingTags.includes(tag)) {
			ln('→ Already tagged, skipping');
			continue;
		}

		let matchingCommit = null;
		for (const sha of commits) {
			try {
				const file = run(`git show ${sha}:package.json`);
				const json = JSON.parse(file);
				if (json.version !== version) continue;
				let parentVersion = null;
				try {
					const parentFile = runQuiet(`git show ${sha}~1:package.json`);
					parentVersion = parentFile ? JSON.parse(parentFile).version : null;
				} catch {
					// no parent or parent has no package.json — this commit introduced the version
				}
				if (parentVersion === version) continue; // version was already there, not changed in this commit
				matchingCommit = sha;
				break;
			} catch {
				// ignore parse errors
			}
		}

		if (!matchingCommit) {
			ln('→ No matching commit found, skipping');
			continue;
		}

		ln(`→ Found commit: ${matchingCommit} (commit that set package.json version to ${version})`);

		if (dryRun) {
			ln(`→ DRY RUN: Would create tag ${tag} at ${matchingCommit}`);
			ln(`→ DRY RUN: Would create GitHub release for ${tag}`);
			taggedThisRun += 1;
			continue;
		}

		// Create tag on GitHub via API (no local git tag or push). Retry on transient network errors.
		const refRes = await fetchWithRetry(`https://api.github.com/repos/${REPO}/git/refs`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ref: `refs/tags/${tag}`, sha: matchingCommit })
		});

		if (!refRes.ok) {
			const errBody = await refRes.text();
			ln(`→ Failed to create tag ${tag}: ${refRes.status} ${errBody}`);
			continue;
		}
		taggedThisRun += 1;
		ln(`→ Created tag ${tag} on GitHub`);

		const releaseRes = await fetchWithRetry(`https://api.github.com/repos/${REPO}/releases`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: 'application/vnd.github+json'
			},
			body: JSON.stringify({
				tag_name: tag,
				name: tag,
				generate_release_notes: true
			})
		});
		const res = await releaseRes.json();

		if (res.id) {
			ln(`→ Created release ${tag}`);
		} else {
			ln(`→ Failed to create release for ${tag} ${JSON.stringify(res)}`);
		}

		// Throttle to reduce rate-limit risk (2 requests per version; delay before next)
		if (!dryRun) await new Promise((r) => setTimeout(r, 1500));
	}

	ln('');
	ln('Backfill complete!');
	return out;
}
