import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.GITHUB_ACTION ? '/' + process.env.GITHUB_REPOSITORY.split('/')[1] : ''
		  }		  
	}
};

export default config;
