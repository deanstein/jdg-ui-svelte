import fs from 'fs';
import path from 'path';
import vm from 'vm';

const input = path.resolve('src/lib/image-meta-registry.js');
const output = path.resolve('src/lib/image-meta-registry.json');
const content = fs.readFileSync(input, 'utf8');

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
