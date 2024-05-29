import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const packageJsonFile = fileURLToPath(new URL('package.json', import.meta.url));
const packageJsonData = readFileSync(packageJsonFile, 'utf8');
const packageJson = JSON.parse(packageJsonData);

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		packageJson: packageJson
	}
});
