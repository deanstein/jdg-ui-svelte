import { decrypt, extractObjectLiteral } from './jdg-utils.js';

// Admin Cloudflare worker
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

// Location of image metadata collection for all websites
export const imageMetaRegistryPath = 'src/routes/image-meta-registry.js';
// Typical imageMetaRegistry variable name, for finding within the .js file
export const imageMetaRegistryVarName = 'imageMetaRegistry';
// All repos containing an imageMetaRegistry
// that may require checking before changing a Cloudinary asset path
const allImageMetaRegistryRepoNames = [
	jdgUiSvelteRepoName,
	jdgWebsiteRepoName,
	pmx3dWebsiteRepoName,
	ccpWebsiteRepoName
];

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
			body: JSON.stringify(jsonContent)
		}
	);

	const result = await response.json();
	return result.success ? result : null;
}

// Fetch the imageMetaRegistry object from a given repo
export const fetchImageMetaRegistry = async (repoName) => {
	const url = new URL(cfRouteFetchPublicFile, cfWorkerUrlJdgGithub);
	url.searchParams.set('repoOwner', jdgRepoOwner);
	url.searchParams.set('repoName', repoName);
	url.searchParams.set('filePath', imageMetaRegistryPath);

	const response = await fetch(url.toString());

	if (!response.ok) {
		throw new Error(`Failed to fetch file: ${response.status}`);
	}

	const jsFileString = await response.text();
	// Extract the imageMetaRegistry object from the JS file string
	const imageMetaRegistry = extractObjectLiteral(jsFileString, 'imageMetaRegistry');

	return imageMetaRegistry;
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
