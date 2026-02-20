/**
 * One-time migration: reads the imageMetaRegistry object from a JS file
 * (const imageMetaRegistry = { ... }) and writes it as pretty-printed JSON.
 * If the JS uses instantiateObject(...) or postProcessImageAttributes(...),
 * those are unwrapped in memory so the output is pure JSON (no function calls).
 * Legacy keys are normalized for output: imgSrc→src, imgAlt→alt, imgCaption→caption,
 * imgAttribution→attribution.
 * If the output file already exists, the converted keys are merged into it
 * (existing keys are kept; same keys are overwritten by the converted object).
 *
 * Run from repo root:
 *   yarn convert-image-registry-to-json
 *   yarn convert-image-registry-to-json --input path/to/registry.js --output path/to/registry.json
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function findMatchingParen(str, openPos) {
	let depth = 0;
	for (let i = openPos; i < str.length; i++) {
		const ch = str[i];
		if (ch === '(') depth++;
		else if (ch === ')') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

function unwrapInstantiate(content) {
	let idx = 0;
	while (true) {
		const call = 'instantiateObject(';
		const pos = content.indexOf(call, idx);
		if (pos === -1) break;
		const open = pos + call.length - 1;
		const close = findMatchingParen(content, open);
		if (close === -1) break;
		const inner = content.slice(open + 1, close);
		const newInner = inner.replace(/^\s*jdgImageAttributes\s*,\s*/s, '');
		content = content.slice(0, pos) + newInner + content.slice(close + 1);
		idx = pos + newInner.length;
	}
	return content;
}

function unwrapPostProcess(content) {
	let idx = 0;
	while (true) {
		const call = 'postProcessImageAttributes(';
		const pos = content.indexOf(call, idx);
		if (pos === -1) break;
		const open = pos + call.length - 1;
		const close = findMatchingParen(content, open);
		if (close === -1) break;
		const inner = content.slice(open + 1, close);
		content = content.slice(0, pos) + inner + content.slice(close + 1);
		idx = pos + inner.length;
	}
	return content;
}

function tidyCommas(content) {
	content = content.replace(/,\s*,+/g, ',');
	content = content.replace(/\}\)\s*,/g, '},');
	content = content.replace(/\}\)\s*\)/g, '}}');
	content = content.replace(/\}\s*\},/g, '},');
	return content;
}

/** Normalize JS so object literal has no instantiateObject/postProcessImageAttributes calls. */
function normalizeRegistryJs(content) {
	content = unwrapInstantiate(content);
	content = unwrapPostProcess(content);
	content = tidyCommas(content);
	return content;
}

/** Map legacy img* keys to canonical keys in the output JSON. */
const KEY_RENAMES = {
	imgSrc: 'src',
	imgAlt: 'alt',
	imgCaption: 'caption',
	imgAttribution: 'attribution'
};

/** True only for leaf image-meta objects (have src/imgSrc). Ensures namespace objects (keys that contain nested registries) are recursed into so nesting is preserved. */
function isImageMetaEntry(obj) {
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
	return 'src' in obj || 'imgSrc' in obj;
}

/**
 * Recursively normalize keys: rename img* to canonical names only on leaf image-meta objects.
 * Handles both top-level image entries (registry = { id1: { imgSrc, ... }, id2: { ... } }) and
 * nested namespaces (registry = { arch: { id1: { imgSrc, ... } }, exp: { ... } }); structure is preserved.
 */
function normalizeImageMetaKeys(obj) {
	if (!obj || typeof obj !== 'object') return obj;
	if (Array.isArray(obj)) return obj.map(normalizeImageMetaKeys);

	if (isImageMetaEntry(obj)) {
		const out = { ...obj };
		for (const [oldKey, newKey] of Object.entries(KEY_RENAMES)) {
			if (oldKey in out) {
				out[newKey] = out[oldKey];
				delete out[oldKey];
			}
		}
		return out;
	}

	// Preserve nesting: recurse into namespace objects (registries keyed by category, etc.)
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [key, normalizeImageMetaKeys(value)])
	);
}

const cwd = process.cwd();
const args = process.argv.slice(2);

let input = path.resolve(cwd, 'src/lib/image-meta-registry.js');
let output = path.resolve(cwd, 'src/lib/image-meta-registry.json');

for (let i = 0; i < args.length; i++) {
	if (args[i] === '--input' && args[i + 1] != null) {
		input = path.resolve(cwd, args[++i]);
	} else if (args[i] === '--output' && args[i + 1] != null) {
		output = path.resolve(cwd, args[++i]);
	} else if (args[i] === '--help' || args[i] === '-h') {
		console.log(
			'Usage: yarn convert-image-registry-to-json [--input <path>] [--output <path>]\n' +
				'  Defaults: --input src/lib/image-meta-registry.js --output src/lib/image-meta-registry.json'
		);
		process.exit(0);
	}
}

if (!fs.existsSync(input)) {
	console.error('Input file not found:', input);
	process.exit(1);
}

let content = fs.readFileSync(input, 'utf8');
// Unwrap instantiateObject(...) and postProcessImageAttributes(...) so we get a plain object
content = normalizeRegistryJs(content);
const match = content.match(/const\s+imageMetaRegistry\s*=\s*(\{[\s\S]*\})\s*;?/m);
if (!match) {
	console.error('Could not find imageMetaRegistry object in', input);
	process.exit(1);
}

const objSrc = match[1];
const script = 'result = ' + objSrc;
const sandbox = { result: null };
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

let result = sandbox.result;
if (typeof result !== 'object' || result === null) {
	console.error('Converted value is not an object');
	process.exit(1);
}

result = normalizeImageMetaKeys(result);

// If output already exists, merge: keep existing keys, add/overwrite with converted keys
if (fs.existsSync(output)) {
	try {
		const existing = JSON.parse(fs.readFileSync(output, 'utf8'));
		if (typeof existing === 'object' && existing !== null && !Array.isArray(existing)) {
			result = { ...existing, ...result };
			console.log('Merged with existing', output);
		}
	} catch (err) {
		console.warn('Could not parse existing output file, overwriting:', err.message);
	}
}

fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log('Wrote', output);
