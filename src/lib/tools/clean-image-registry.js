/**
 * One-time cleanup: rewrites JS files that use instantiateObject(...) or
 * postProcessImageAttributes(...) by unwrapping those calls and leaving
 * plain object literals, then tidying commas. Use when migrating image
 * registry files to a simpler format; not needed for ongoing use.
 */
import fs from 'fs/promises';
import path from 'path';

async function findJsFiles(target) {
	const stat = await fs.stat(target);
	if (stat.isFile()) return [target];
	const results = [];
	async function walk(dir) {
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(dir, e.name);
			if (e.isDirectory()) await walk(full);
			else if (e.isFile() && full.endsWith('.js')) results.push(full);
		}
	}
	await walk(target);
	return results;
}

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
		const open = pos + call.length - 1; // position of '('
		const close = findMatchingParen(content, open);
		if (close === -1) break;
		const inner = content.slice(open + 1, close);
		// Remove leading jdgImageAttributes, if present
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
	// Replace any sequence of commas with a single comma where appropriate
	content = content.replace(/,\s*,+/g, ',');
	// Replace patterns like '},)' or '}),', etc., that may remain
	content = content.replace(/\}\)\s*,/g, '},');
	content = content.replace(/\}\)\s*\)/g, '}}');
	// Remove accidental duplicated braces
	content = content.replace(/\}\s*\},/g, '},');
	return content;
}

async function processFile(file) {
	let content = await fs.readFile(file, 'utf8');
	const before = content;
	content = unwrapInstantiate(content);
	content = unwrapPostProcess(content);
	content = tidyCommas(content);
	if (content !== before) {
		await fs.writeFile(file, content, 'utf8');
		console.log('Processed', file);
	} else {
		console.log('No changes for', file);
	}
}

async function main() {
	const args = process.argv.slice(2);
	if (args.length === 0) {
		console.error('Usage: node fix-image-registry.mjs <file-or-directory> [...]');
		process.exit(2);
	}
	for (const target of args) {
		try {
			const list = await findJsFiles(target);
			for (const f of list) {
				const text = await fs.readFile(f, 'utf8');
				if (text.includes('instantiateObject(') || text.includes('postProcessImageAttributes(')) {
					await processFile(f);
				}
			}
		} catch (err) {
			// maybe it's a single file path that doesn't exist as directory
			try {
				await processFile(target);
			} catch (e) {
				console.error('Skipping', target, e.message);
			}
		}
	}
}

if (
	import.meta.url ===
	`file://${process.cwd().replace(/\\/g, '/')}/${path.basename(process.argv[1])}`
) {
	main().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}

export { unwrapInstantiate, unwrapPostProcess, tidyCommas, processFile };
