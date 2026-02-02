/**
 * One-time backfill: creates GitHub releases and tags at the commits that match
 * each published npm version, so release history aligns with the package.
 * Not needed for future releases, only for catching up existing versions.
 */
import { execSync } from "node:child_process";
import fetch from "node-fetch";
import {
  cfRouteGetGithubAppToken,
  cfWorkerUrlJdgGithub,
  jdgRepoOwner,
  jdgUiSvelteRepoName
} from "$lib/jdg-persistence-management.js";

const PACKAGE_NAME = jdgUiSvelteRepoName;
const REPO = `${jdgRepoOwner}/${jdgUiSvelteRepoName}`;

// DRY RUN MODE
const DRY_RUN = process.env.DRY_RUN === "true";

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
    throw new Error("Cloudflare Worker did not return a token");
  }

  return data.token;
}

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

async function main() {
  console.log(`DRY RUN MODE: ${DRY_RUN ? "ON" : "OFF"}`);
  console.log("Fetching GitHub App token from Cloudflare Worker…");

  const token = await getGithubToken();
  console.log("Token acquired successfully");

  console.log(`Fetching versions for ${PACKAGE_NAME} from npm…`);
  const npmData = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`).then(r => r.json());
  const versions = Object.keys(npmData.versions);

  console.log(`Found ${versions.length} versions on npm`);

  const existingTags = run("git tag")
    .split("\n")
    .filter(Boolean);

  const commits = run("git log --pretty=format:%H -- package.json")
    .split("\n")
    .filter(Boolean);

  console.log(`Found ${commits.length} commits that modified package.json`);

  for (const version of versions) {
    const tag = `v${version}`;

    console.log("\n----------------------------------------");
    console.log(`Version: ${version}`);
    console.log(`Tag:     ${tag}`);

    if (existingTags.includes(tag)) {
      console.log(`→ Already tagged, skipping`);
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
      console.log(`→ No matching commit found, skipping`);
      continue;
    }

    console.log(`→ Found commit: ${matchingCommit}`);

    if (DRY_RUN) {
      console.log(`→ DRY RUN: Would create tag ${tag} at ${matchingCommit}`);
      console.log(`→ DRY RUN: Would create GitHub release for ${tag}`);
      continue;
    }

    // REAL MODE BELOW
    run(`git tag ${tag} ${matchingCommit}`);
    run(`git push origin ${tag}`);

    const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({
        tag_name: tag,
        name: tag,
        generate_release_notes: true
      })
    }).then(r => r.json());

    if (res.id) {
      console.log(`→ Created release ${tag}`);
    } else {
      console.error(`→ Failed to create release for ${tag}`, res);
    }
  }

  console.log("\nBackfill complete!");
}

main();