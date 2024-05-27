import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import { imagePreprocessor } from 'svimg';
const pkg = require('./package.json');

export default {
    input: 'src/AtButton.svelte',
    output: [
        { file: pkg.module, format: 'es' },
        { file: pkg.main, format: 'umd', name: 'Name' }
    ],
    plugins: [
        svelte({
            preprocess: [
                imagePreprocessor({
                    inputDir: 'public',
                    outputDir: 'public/g',
                    webp: true,
                    avif: true
                })
            ]
        }),
        resolve()
    ]
};
