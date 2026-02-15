/**
 * One-time migration: reads the imageMetaRegistry object from a JS file
 * (const imageMetaRegistry = { ... }) and writes it as pretty-printed JSON.
 * If the JS uses instantiateObject(...) or postProcessImageAttributes(...),
 * those are unwrapped in memory so the output is pure JSON (no function calls).
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

fs.writeFileSync(output, JSON.stringify(sandbox.result, null, 2) + '\n', 'utf8');
console.log('Wrote', output);
