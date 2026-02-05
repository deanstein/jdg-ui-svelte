/**
 * CLI: List npm package versions and GitHub repo tags (no git, no token).
 * Run from repo root: yarn list-versions
 */
import { listPackageVersions } from './list-package-versions-client.js';

const log = [];
await listPackageVersions({ log });
console.log(log.join('\n'));
