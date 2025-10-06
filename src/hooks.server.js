// src/hooks.server.js

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response('{}', {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	return resolve(event);
}
