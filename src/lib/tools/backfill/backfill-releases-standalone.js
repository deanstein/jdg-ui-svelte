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

function run(cmd) {
	return execSync(cmd, { encoding: 'utf8' }).trim();
}

/**
 * @param {{ dryRun?: boolean, log?: string[], limit?: number }} [options]
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
		versions = versions.slice(0, limit);
		ln(`Processing first ${versions.length} versions (limit applied).`);
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

	const commits = run('git log --pretty=format:%H -- package.json').split('\n').filter(Boolean);
	ln(`Found ${commits.length} commits that modified package.json`);

	for (const version of versions) {
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
				if (json.version === version) {
					matchingCommit = sha;
					break;
				}
			} catch {
				// ignore parse errors
			}
		}

		if (!matchingCommit) {
			ln('→ No matching commit found, skipping');
			continue;
		}

		ln(`→ Found commit: ${matchingCommit}`);

		if (dryRun) {
			ln(`→ DRY RUN: Would create tag ${tag} at ${matchingCommit}`);
			ln(`→ DRY RUN: Would create GitHub release for ${tag}`);
			continue;
		}

		run(`git tag ${tag} ${matchingCommit}`);
		run(`git push origin ${tag}`);

		const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
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
		}).then((r) => r.json());

		if (res.id) {
			ln(`→ Created release ${tag}`);
		} else {
			ln(`→ Failed to create release for ${tag} ${JSON.stringify(res)}`);
		}
	}

	ln('');
	ln('Backfill complete!');
	return out;
}
