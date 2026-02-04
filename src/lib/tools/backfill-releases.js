/**
 * One-time backfill: creates GitHub releases and tags at the commits that match
 * each published npm version, so release history aligns with the package.
 * Not needed for future releases, only for catching up existing versions.
 */
import { execSync } from 'node:child_process';
import {
	cfRouteGetGithubAppToken,
	cfWorkerUrlJdgGithub,
	jdgRepoOwner,
	jdgUiSvelteRepoName
} from '$lib/jdg-persistence-management.js';

const PACKAGE_NAME = jdgUiSvelteRepoName;
const REPO = `${jdgRepoOwner}/${jdgUiSvelteRepoName}`;

// Cloudflare Worker endpoint for GitHub App token
const CF_WORKER_TOKEN_URL = cfWorkerUrlJdgGithub + cfRouteGetGithubAppToken;

// Always use Cloudflare Worker for token
async function getGithubToken() {
	const res = await fetch(CF_WORKER_TOKEN_URL);

	if (!res.ok) {
		throw new Error(`Cloudflare Worker token request failed: ${res.status}`);
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
 * List npm package versions and GitHub repo tags (no git, no token). For display only.
 * @param {{ log?: string[] }} options
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

/**
 * Run the backfill. When log is provided, appends lines to it and returns it; otherwise uses console.
 * @param {{ dryRun: boolean, log?: string[] }} options
 * @returns {Promise<string[]>} lines of output
 */
export async function runBackfill({ dryRun = true, log: out = [] }) {
	const ln = (msg) => {
		out.push(msg);
	};

	ln(`DRY RUN MODE: ${dryRun ? 'ON' : 'OFF'}`);
	ln('Fetching GitHub App token from Cloudflare Worker…');

	const token = await getGithubToken();
	ln('Token acquired successfully');

	ln(`Fetching versions for ${PACKAGE_NAME} from npm…`);
	const npmData = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`).then((r) => r.json());
	const versions = Object.keys(npmData.versions);

	ln(`Found ${versions.length} versions on npm`);

	const existingTags = run('git tag').split('\n').filter(Boolean);

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

		// REAL MODE BELOW
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

// CLI entry: run with DRY_RUN from env and log to console
async function main() {
	const DRY_RUN = process.env.DRY_RUN === 'true';
	const lines = await runBackfill({ dryRun: DRY_RUN, log: [] });
	for (const line of lines) {
		console.log(line);
	}
}

// Only run main when executed directly (e.g. node backfill-releases.js)
const isMain = typeof process !== 'undefined' && process.argv[1]?.includes('backfill-releases');
if (isMain) {
	main().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
