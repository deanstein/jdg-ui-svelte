import { decrypt, extractAndParseObjectLiteral } from './jdg-utils.js';

// JDG-ADMIN Cloudflare worker
export const cfWorkerUrlAdmin = 'https://jdg-admin.jdeangoldstein.workers.dev';
export const cfRouteCheckAdmin = '/check-admin';
export const cfRouteListJsonFiles = '/list-json-files';
export const cfRouteFetchFile = '/fetch-file';
export const cfRouteWriteJsonFile = '/write-json-file';

// JDG-GITHUB Cloudflare worker
export const cfWorkerUrlJdgGithub = 'https://jdg-github.jdeangoldstein.workers.dev';
export const cfRouteDebugCors = '/debug-cors';
export const cfRouteFetchPublicFile = '/fetch-public-file';
export const cfRouteWritePublicJsFile = '/write-public-js-file';

// JDG-CLOUDINARY Cloudflare worker
export const cfWorkerUrlJdgCloudinary = 'https://jdg-cloudinary.jdeangoldstein.workers.dev';
export const cfRouteDeleteImage = '/delete-image';
export const cfRouteRenameImage = '/rename-image';

// Family Tree Data and Building Data use different keys
// for identifying the collection of TimelineHosts
export const buildingDataCollectionKey = 'allBuildings';
export const familyTreeDataCollectionKey = 'allPeople';

// Repos are all owned by this username
export const jdgRepoOwner = 'deanstein';
// All repo names
export const jdgUiSvelteRepoName = 'jdg-ui-svelte';
export const jdgWebsiteRepoName = 'jdg-website';
export const jdgBuildingDataRepoName = 'building-data';
export const pmx3dWebsiteRepoName = 'pmx-website';
export const ccpWebsiteRepoName = 'ccp-website';
export const ccpSimulationRepoName = 'CinderellaCityProject';
export const familyTreeRepoName = 'family-tree';
export const familyTreeDataRepoName = 'family-tree-data';
export const familyTreeDeployRepoName = 'family-tree-deploy';
export const hashtagGeneratorRepoName = 'hashtag-generator';
export const jsonToListRepoName = 'json-to-html';
export const encryptedPAT =
	'U2FsdGVkX19E4XXmu4s1Y76A+iKILjKYG1n92+pqbtzdoJpeMyl6Pit0H8Kq8G28M+ZuqmdhHEfb/ud4GEe5gw==';

// Possible locations of image metadata collection across websites
// The fetch function will try each path in order until one succeeds
export const imageMetaRegistryPaths = [
	'src/routes/image-meta-registry.json',
	'src/lib/image-meta-registry.json',
	'src/image-meta-registry.json'
];
// Keep single path for backwards compatibility (uses first path)
export const imageMetaRegistryPath = imageMetaRegistryPaths[0];
// Typical imageMetaRegistry variable name, for finding within the .js file
export const imageMetaRegistryVarName = 'imageMetaRegistry';
// All repos containing an imageMetaRegistry
// that may require checking before changing a Cloudinary asset path
export const allImageMetaRegistryRepoNames = [
	jdgUiSvelteRepoName,
	jdgWebsiteRepoName,
	pmx3dWebsiteRepoName,
	ccpWebsiteRepoName
];

// Options for JDGSelect component to choose which image meta registry to use
// Each option includes the repo name (value), display label, and file path within the repo
export const imageMetaRegistryOptions = {
	registries: {
		label: 'Image Meta Registries',
		jdgUiSvelte: {
			value: jdgUiSvelteRepoName,
			label: 'JDG UI Svelte (Package)'
		},
		jdgWebsite: {
			value: jdgWebsiteRepoName,
			label: 'JDG Website'
		},
		pmx3dWebsite: {
			value: pmx3dWebsiteRepoName,
			label: 'PMX Website'
		},
		ccpWebsite: {
			value: ccpWebsiteRepoName,
			label: 'CCP Website'
		}
	}
};

// Helper to get a display label for a repo name
export const getImageMetaRegistryLabel = (repoName) => {
	const options = imageMetaRegistryOptions.registries;
	for (const key in options) {
		if (options[key].value === repoName) {
			return options[key].label;
		}
	}
	return repoName || 'Unknown Registry';
};

// TODO: Remove, this won't be needed once we switch entirely to Cloudflare workers
const getAuthHeaders = (password) => ({
	Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
	Accept: 'application/vnd.github.v3.raw'
});

//
// CLOUDFLARE-BASED FUNCTIONS
//

export const debugCorsWorker = async () => {
	const debugUrl = cfWorkerUrlJdgGithub + cfRouteDebugCors; // Replace with your actual Worker URL

	try {
		const response = await fetch(debugUrl, {
			method: 'GET',
			headers: {
				// Optional: include headers to test
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Worker responded with status ${response.status}`);
		}

		const data = await response.json();
		console.log('🔍 Headers received by Worker:', data.headers);
		return data.headers;
	} catch (err) {
		console.error('❌ Error calling debug-cors route:', err);
		return null;
	}
};

// Determines if the given passphrase grants admin access
export async function fetchIsAdmin(passphrase) {
	try {
		const encodedPass = encodeURIComponent(passphrase);
		const response = await fetch(
			cfWorkerUrlAdmin + cfRouteCheckAdmin + '?passphrase=' + encodedPass
		);
		const contentType = response.headers.get('Content-Type');

		if (contentType?.includes('application/json')) {
			const responseJson = await response.json();
			return responseJson.success ? responseJson : null;
		} else {
			const text = await response.text();
			console.error('Unexpected response format:', text);
			return null;
		}
	} catch (err) {
		console.error('Error checking admin passphrase:', err);
		return null;
	}
}

export async function fetchJsonFileList(repoOwner, repoName) {
	try {
		const encodedOwner = encodeURIComponent(repoOwner);
		const encodedName = encodeURIComponent(repoName);
		const response = await fetch(
			`${cfWorkerUrlAdmin}${cfRouteListJsonFiles}?repoOwner=${encodedOwner}&repoName=${encodedName}`
		);
		const contentType = response.headers.get('Content-Type');

		if (contentType?.includes('application/json')) {
			const responseJson = await response.json();
			return responseJson.jsonFiles || null;
		} else {
			const text = await response.text();
			console.error('Unexpected response format:', text);
			return null;
		}
	} catch (err) {
		console.error('Error fetching JSON file list:', err);
		return null;
	}
}

export async function readJsonFileFromRepo(repoOwner, repoName, filePath) {
	try {
		const encodedOwner = encodeURIComponent(repoOwner);
		const encodedName = encodeURIComponent(repoName);
		const encodedPath = encodeURIComponent(filePath);

		const response = await fetch(
			`${cfWorkerUrlAdmin}${cfRouteFetchFile}?repoOwner=${encodedOwner}&repoName=${encodedName}&filePath=${encodedPath}`
		);

		const contentType = response.headers.get('Content-Type');

		if (contentType?.includes('application/json')) {
			return await response.json();
		} else {
			const text = await response.text();
			console.error('Unexpected response format:', text);
			return null;
		}
	} catch (err) {
		console.error('Error reading JSON file from repo:', err);
		return null;
	}
}

export async function writeJsonFileToRepo(repoOwner, repoName, filePath, jsonContent) {
	const encodedOwner = encodeURIComponent(repoOwner);
	const encodedName = encodeURIComponent(repoName);
	const encodedPath = encodeURIComponent(filePath);

	const response = await fetch(
		`${cfWorkerUrlAdmin}${cfRouteWriteJsonFile}?repoOwner=${encodedOwner}&repoName=${encodedName}&filePath=${encodedPath}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			// Format with tabs to match Prettier configuration (useTabs: true)
			body: JSON.stringify(jsonContent, null, '\t')
		}
	);

	const result = await response.json();
	return result.success ? result : null;
}

// Cache for fetched image meta registries (keyed by repo name)
const imageMetaRegistryCache = new Map();
// Track in-flight fetch promises to avoid duplicate concurrent requests
const imageMetaRegistryPending = new Map();

// Fetch the imageMetaRegistry object from a given repo
// Tries each path in imageMetaRegistryPaths until one succeeds
// Results are cached to avoid redundant fetches
export const fetchImageMetaRegistry = async (repoName) => {
	console.log(`🔍 Fetching imageMetaRegistry for ${repoName}`);

	// Return cached registry if available
	if (imageMetaRegistryCache.has(repoName)) {
		console.log(`📦 Using cached imageMetaRegistry for ${repoName}`);
		return imageMetaRegistryCache.get(repoName);
	}

	// If there's already a fetch in progress for this repo, wait for it
	if (imageMetaRegistryPending.has(repoName)) {
		console.log(`⏳ Waiting for in-flight fetch of imageMetaRegistry for ${repoName}`);
		return imageMetaRegistryPending.get(repoName);
	}

	// Create the fetch promise and store it
	const fetchPromise = (async () => {
		let lastError = null;

		for (const filePath of imageMetaRegistryPaths) {
			try {
				const url = new URL(cfRouteFetchPublicFile, cfWorkerUrlJdgGithub);
				url.searchParams.set('repoOwner', jdgRepoOwner);
				url.searchParams.set('repoName', repoName);
				url.searchParams.set('filePath', filePath);

				const response = await fetch(url.toString());

				if (!response.ok) {
					// Try next path
					lastError = new Error(`Failed to fetch from ${filePath}: ${response.status}`);
					continue;
				}

				const jsFileString = await response.text();
				// Extract and parse the imageMetaRegistry object from the JS file string
				const imageMetaRegistry = extractAndParseObjectLiteral(jsFileString, 'imageMetaRegistry');

				if (imageMetaRegistry) {
					console.log(`✅ Found imageMetaRegistry in ${repoName} at ${filePath}`);
					// Cache the result
					imageMetaRegistryCache.set(repoName, imageMetaRegistry);
					return imageMetaRegistry;
				}
			} catch (err) {
				lastError = err;
				// Continue to try next path
			}
		}

		// If we get here, none of the paths worked
		throw lastError || new Error(`Could not find imageMetaRegistry in ${repoName}`);
	})();

	// Store the pending promise
	imageMetaRegistryPending.set(repoName, fetchPromise);

	try {
		const result = await fetchPromise;
		return result;
	} finally {
		// Remove from pending once complete (success or failure)
		imageMetaRegistryPending.delete(repoName);
	}
};

// Clear the cache for a specific repo (useful after updates) or all repos
export const clearImageMetaRegistryCache = (repoName = null) => {
	if (repoName) {
		imageMetaRegistryCache.delete(repoName);
		console.log(`🗑️ Cleared imageMetaRegistry cache for ${repoName}`);
	} else {
		imageMetaRegistryCache.clear();
		console.log(`🗑️ Cleared all imageMetaRegistry cache`);
	}
};

// Fetch the raw image-meta-registry.js file content from a repo
// Returns the raw file content as a string (not parsed)
const fetchImageMetaRegistryRaw = async (repoName) => {
	let lastError = null;

	for (const filePath of imageMetaRegistryPaths) {
		try {
			const url = new URL(cfRouteFetchPublicFile, cfWorkerUrlJdgGithub);
			url.searchParams.set('repoOwner', jdgRepoOwner);
			url.searchParams.set('repoName', repoName);
			url.searchParams.set('filePath', filePath);

			console.log(`🔍 Trying to fetch ${repoName}/${filePath}...`);
			const response = await fetch(url.toString());

			if (!response.ok) {
				console.log(`   ❌ HTTP ${response.status} for ${filePath}`);
				lastError = new Error(`Failed to fetch from ${filePath}: ${response.status}`);
				continue;
			}

			const fileContent = await response.text();
			console.log(`   📄 Got response (${fileContent.length} chars) from ${filePath}`);

			// Check if the response is an error JSON (worker might return 200 with error body)
			if (fileContent.startsWith('{') && fileContent.includes('"error"')) {
				console.log(`   ⚠️ Response appears to be an error JSON`);
				lastError = new Error(`Error response from ${filePath}`);
				continue;
			}

			// Verify this looks like an image meta registry file
			if (fileContent.includes('imageMetaRegistry')) {
				console.log(`   ✅ Found imageMetaRegistry in ${repoName} at ${filePath}`);
				return fileContent;
			} else {
				console.log(`   ⚠️ File found but doesn't contain 'imageMetaRegistry'`);
			}
		} catch (err) {
			console.log(`   ❌ Exception: ${err.message}`);
			lastError = err;
		}
	}

	throw lastError || new Error(`Could not find imageMetaRegistry in ${repoName}`);
};

// Check if a Cloudinary URL is used across all repos with image meta registries
// Returns an array of objects with repo name and whether the URL was found
export const getImageMetaSrcUsageInRepos = async (targetUrl, excludeRepoName = null) => {
	const results = [];

	// Filter out the current repo if specified
	const reposToCheck = excludeRepoName
		? allImageMetaRegistryRepoNames.filter((name) => name !== excludeRepoName)
		: allImageMetaRegistryRepoNames;

	console.log(`🔍 Checking URL usage across ${reposToCheck.length} repos...`);

	// Fetch all registries in parallel
	const fetchPromises = reposToCheck.map(async (repoName) => {
		try {
			const fileContent = await fetchImageMetaRegistryRaw(repoName);
			return { repoName, fileContent, error: null };
		} catch (err) {
			console.warn(`⚠️ Failed to fetch registry from ${repoName}:`, err.message);
			return { repoName, fileContent: null, error: err.message };
		}
	});

	const fetchResults = await Promise.all(fetchPromises);

	// Search each registry file for the target URL
	for (const { repoName, fileContent, error } of fetchResults) {
		if (error || !fileContent) {
			results.push({
				repoName,
				error: error || 'Registry is empty',
				found: false
			});
			continue;
		}

		// Simply check if the URL string exists in the file content
		const found = fileContent.includes(targetUrl);

		results.push({
			repoName,
			error: null,
			found
		});

		if (found) {
			console.log(`✅ Found URL in ${repoName}`);
		}
	}

	return results;
};

// Replace an old URL with a new URL in a repo's image-meta-registry file
// This does a simple string replacement - useful when an image URL changes
export const replaceUrlInImageMetaRegistry = async (repoName, oldUrl, newUrl) => {
	try {
		// Try each possible path
		let registryData = null;
		let successfulPath = null;

		for (const filePath of imageMetaRegistryPaths) {
			try {
				const data = await readJsonFileFromRepo(jdgRepoOwner, repoName, filePath);
				if (data) {
					registryData = data;
					successfulPath = filePath;
					break;
				}
			} catch {
				// Try next path
			}
		}

		if (!registryData || !successfulPath) {
			throw new Error(`Could not find imageMetaRegistry in ${repoName}`);
		}

		// Check if the old URL exists in the data
		const jsonString = JSON.stringify(registryData);
		if (!jsonString.includes(oldUrl)) {
			console.log(`ℹ️ URL not found in ${repoName}, skipping`);
			return { success: true, skipped: true, repoName };
		}

		// Work with JSON object - recursively replace URLs
		const replaceUrlsInObject = (obj) => {
			for (const key in obj) {
				if (typeof obj[key] === 'string' && obj[key] === oldUrl) {
					obj[key] = newUrl;
				} else if (typeof obj[key] === 'object' && obj[key] !== null) {
					replaceUrlsInObject(obj[key]);
				}
			}
		};

		replaceUrlsInObject(registryData);

		// Write JSON file back
		const result = await writeJsonFileToRepo(jdgRepoOwner, repoName, successfulPath, registryData);
		console.log(`✅ Replaced URL in ${repoName}`);
		return { success: result ? true : false, skipped: false, repoName };
	} catch (err) {
		console.error(`❌ Failed to replace URL in ${repoName}:`, err.message);
		return { success: false, error: err.message, repoName };
	}
};

// Replace a URL across all repos that contain it
export const replaceUrlAcrossRepos = async (oldUrl, newUrl, excludeRepoName = null) => {
	// First, find which repos contain the URL
	const usageResults = await getImageMetaSrcUsageInRepos(oldUrl, excludeRepoName);
	const reposWithUrl = usageResults.filter((r) => r.found);

	if (reposWithUrl.length === 0) {
		console.log('ℹ️ No other repos contain this URL');
		return { updated: [], failed: [] };
	}

	console.log(`🔄 Replacing URL in ${reposWithUrl.length} repo(s)...`);

	// Replace URL in each repo
	const replacePromises = reposWithUrl.map((r) =>
		replaceUrlInImageMetaRegistry(r.repoName, oldUrl, newUrl)
	);

	const results = await Promise.all(replacePromises);

	const updated = results.filter((r) => r.success && !r.skipped).map((r) => r.repoName);
	const failed = results
		.filter((r) => !r.success)
		.map((r) => ({ repoName: r.repoName, error: r.error }));

	return { updated, failed };
};

// Write a single image meta entry to the registry
export const writeImageMetaEntryToRepo = async (repoName, registryKey, imageMeta) => {
	try {
		// Try each possible registry path until one succeeds
		let registryData = null;
		let successfulPath = null;

		for (const filePath of imageMetaRegistryPaths) {
			try {
				const data = await readJsonFileFromRepo(jdgRepoOwner, repoName, filePath);
				if (data) {
					registryData = data;
					successfulPath = filePath;
					break;
				}
			} catch {
				// Try next path
			}
		}

		if (!registryData || !successfulPath) {
			throw new Error(`Registry file not found in any expected location`);
		}

		// Filter out undefined/null values, keep everything else from the schema
		const cleanImageMeta = Object.fromEntries(
			Object.entries(imageMeta).filter(([_, value]) => value !== undefined && value !== null)
		);

		// Handle both top-level and nested keys
		const keyParts = registryKey.split('.');
		const isNested = keyParts.length > 1;

		if (isNested) {
			const parentKey = keyParts[0];
			const childKey = keyParts.slice(1).join('.');

			if (!registryData[parentKey]) {
				registryData[parentKey] = {};
			}
			registryData[parentKey][childKey] = cleanImageMeta;
		} else {
			registryData[registryKey] = cleanImageMeta;
		}

		// Write JSON file back
		const result = await writeJsonFileToRepo(jdgRepoOwner, repoName, successfulPath, registryData);
		return result;
	} catch (err) {
		console.error('Error writing image meta entry to repo:', err);
		return null;
	}
};

// Delete a single image meta entry from the registry
export const deleteImageMetaEntryFromRepo = async (repoName, registryKey) => {
	try {
		// Try each possible registry path until one succeeds
		let registryData = null;
		let successfulPath = null;

		for (const filePath of imageMetaRegistryPaths) {
			try {
				const data = await readJsonFileFromRepo(jdgRepoOwner, repoName, filePath);
				if (data) {
					registryData = data;
					successfulPath = filePath;
					break;
				}
			} catch {
				// Try next path
			}
		}

		if (!registryData || !successfulPath) {
			throw new Error(`Registry file not found in any expected location`);
		}

		// Handle both top-level and nested keys
		const keyParts = registryKey.split('.');
		const isNested = keyParts.length > 1;

		if (isNested) {
			const parentKey = keyParts[0];
			const childKey = keyParts.slice(1).join('.');

			if (!registryData[parentKey]) {
				throw new Error(`Parent key "${parentKey}" not found`);
			}

			if (!(childKey in registryData[parentKey])) {
				throw new Error(`Child key "${childKey}" not found in parent "${parentKey}"`);
			}

			delete registryData[parentKey][childKey];

			// If parent is now empty, remove the entire parent object
			if (Object.keys(registryData[parentKey]).length === 0) {
				delete registryData[parentKey];
			}
		} else {
			if (!(registryKey in registryData)) {
				throw new Error(`Registry key "${registryKey}" not found`);
			}
			delete registryData[registryKey];
		}

		// Write JSON file back
		const result = await writeJsonFileToRepo(jdgRepoOwner, repoName, successfulPath, registryData);
		return result;
	} catch (err) {
		console.error('Error deleting image meta entry from repo:', err);
		return null;
	}
};

// Delete an image from Cloudinary via Cloudflare worker
export const deleteCloudinaryImage = async (assetPath, fileName) => {
	try {
		const url = `${cfWorkerUrlJdgCloudinary}${cfRouteDeleteImage}?folder=${encodeURIComponent(
			assetPath
		)}&fileName=${encodeURIComponent(fileName)}`;

		const response = await fetch(url, {
			method: 'DELETE'
		});

		const data = await response.json();
		if (!response.ok || !data.success) {
			throw new Error(data.error || 'Delete failed');
		}

		console.log('✅ Delete complete:', assetPath + '/' + fileName);
		return data;
	} catch (err) {
		console.error('❌ Delete error:', err.message);
		throw err;
	}
};

// Rename/move an image in Cloudinary via Cloudflare worker
// This changes the public_id (path) of an existing image without re-uploading
export const renameCloudinaryImage = async (fromPublicId, toPublicId) => {
	try {
		// Remove file extension from public IDs (Cloudinary stores without extension)
		const cleanFrom = fromPublicId.replace(/\.[^/.]+$/, '');
		const cleanTo = toPublicId.replace(/\.[^/.]+$/, '');

		const url = `${cfWorkerUrlJdgCloudinary}${cfRouteRenameImage}?fromPublicId=${encodeURIComponent(
			cleanFrom
		)}&toPublicId=${encodeURIComponent(cleanTo)}`;

		const response = await fetch(url, {
			method: 'POST'
		});

		const data = await response.json();
		if (!response.ok || !data.success) {
			throw new Error(data.error || 'Rename failed');
		}

		console.log('✅ Rename complete:', cleanFrom, '→', cleanTo);
		return data; // { success: true, url: "new secure URL", public_id: "new-path" }
	} catch (err) {
		console.error('❌ Rename error:', err.message);
		throw err;
	}
};

//
// LEGACY FUNCTIONS (to be removed)
//
export const fetchFileFromRepo = async (
	repoOwner,
	repoName,
	fileName,
	password = null,
	isPrivate = false
) => {
	let fileData;
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

	try {
		const response = await fetch(url, isPrivate ? { headers: getAuthHeaders(password) } : {});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		fileData = await response.json();
	} catch (error) {
		console.error('There was a problem fetching the file:', error);
	}

	return fileData;
};

// specifically for json - directly gets the json data
export const fetchJsonFromRepo = async (
	repoOwner,
	repoName,
	fileName,
	password = null,
	isPrivate = false
) => {
	try {
		const fileData = await fetchFileFromRepo(repoOwner, repoName, fileName, password, isPrivate);

		if (fileData && fileData.content) {
			const decodedContent = atob(fileData.content); // Decode Base64 content
			const jsonData = JSON.parse(decodedContent); // Parse JSON content
			return jsonData;
		} else {
			throw new Error('Failed to fetch or parse file data');
		}
	} catch (error) {
		console.error('Error fetching JSON from repo:', error);
		return null;
	}
};

export const fetchLatestCommitDate = async (
	repoOwner,
	repoName,
	isPrivate = false,
	password = null,
	branch = 'main'
) => {
	const url = isPrivate
		? `https://api.github.com/repos/${repoOwner}/${repoName}/commits?sha=${branch}`
		: `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`;

	let latestCommitDate;

	await fetch(url, isPrivate ? { headers: getAuthHeaders(password) } : {})
		.then((response) => response.json())
		.then((data) => {
			latestCommitDate = new Date(data[0]?.commit.committer.date);
		})
		.catch((error) => console.error('Failed to get latest commit date. Error:', error));

	return latestCommitDate;
};

// all commit history url
export const getCommitHistoryUrl = (repoOwner, repoName, branch = 'main') => {
	return `https://github.com/${repoOwner}/${repoName}/commits/${branch}`;
};

// latest commit url
export const fetchLatestCommitUrl = async (
	repoOwner,
	repoName,
	isPrivate = false,
	password = null,
	branch = 'main'
) => {
	const url = isPrivate
		? `https://api.github.com/repos/${repoOwner}/${repoName}/commits?sha=${branch}`
		: `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`;

	let latestCommitUrl;

	await fetch(url, isPrivate ? { headers: getAuthHeaders(password) } : {})
		.then((response) => response.json())
		.then((data) => {
			latestCommitUrl = data?.html_url;
		})
		.catch((error) => console.error('Failed to get latest commit URL. Error:', error));

	return latestCommitUrl;
};

/**
 * Fetches the latest tag and its commit details from a GitHub repository.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {boolean} isPrivate - Whether the repository is private.
 * @param {string} password - The password for decrypting the token for private repositories.
 * @returns {Promise<{name: string, date: string, url: string}>} An object containing the name of the latest tag, the formatted date of the associated commit, and the URL to the tag.
 */
export const fetchLatestTagDetails = async (owner, repo, isPrivate = false, password = null) => {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/tags`,
		isPrivate ? { headers: getAuthHeaders(password) } : {}
	);
	const tags = await response.json();

	if (tags.length === 0) {
		throw new Error('No tags found in the repository');
	}

	const latestTag = tags[0];

	if (!latestTag.commit.sha) {
		throw new Error('SHA for the latest tag commit is undefined');
	}

	const commitDetailsResponse = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/commits/${latestTag.commit.sha}`,
		isPrivate ? { headers: getAuthHeaders(password) } : {}
	);
	const commitDetails = await commitDetailsResponse.json();

	const date = new Date(commitDetails.commit.committer.date);
	const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

	const url = `https://github.com/${owner}/${repo}/releases/tag/${latestTag.name}`;

	return {
		name: latestTag.name,
		date: formattedDate,
		url: url
	};
};

export const fetchLatestBuildDate = async (
	repoOwner,
	repoName,
	isPrivate = false,
	password = null
) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?status=success`;
	let latestBuildDate;

	await fetch(url, isPrivate ? { headers: getAuthHeaders(password) } : {})
		.then((response) => response.json())
		.then((data) => {
			if (data.total_count > 0) {
				latestBuildDate = new Date(data.workflow_runs[0].created_at);
			} else {
				console.warn('No successful builds found for ' + repoOwner + '/' + repoName);
			}
		})
		.catch((error) => console.error('Failed to get latest build date. Error:', error));

	return latestBuildDate;
};

export const fetchTotalCommitsQty = async (
	repoOwner,
	repoName,
	isPrivate = false,
	password = null
) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
	let totalCommits = 0;

	await fetch(url, isPrivate ? { headers: getAuthHeaders(password) } : {})
		.then((response) => response.json())
		.then((data) => {
			if (Array.isArray(data)) {
				data.forEach((contributor) => {
					totalCommits += contributor.contributions;
				});
			} else {
				console.log('Unexpected data:', data);
			}
		})
		.catch((error) => console.error('Error:', error));

	return totalCommits;
};
