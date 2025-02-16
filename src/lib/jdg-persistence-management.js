import { decrypt } from './jdg-utils.js';

export const jdgRepoOwner = 'deanstein';
export const jdgUiRepoName = 'jdg-ui-svelte';
export const jdgWebsiteRepoName = 'jdg-website';
export const pmx3dWebsiteRepoName = 'pmx-website';
export const ccpWebsiteRepoName = 'ccp-website';
export const familyTreeDataRepoName = 'family-tree-data';
export const familyTreeDeployRepoName = 'family-tree-deploy';
export const bioPhotoFileName = 'bio-photo';
export const encryptedPAT =
	'U2FsdGVkX19E4XXmu4s1Y76A+iKILjKYG1n92+pqbtzdoJpeMyl6Pit0H8Kq8G28M+ZuqmdhHEfb/ud4GEe5gw==';

const getAuthHeaders = (password) => ({
	Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
	Accept: 'application/vnd.github.v3.raw'
});

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

// for binary large objects (blobs)
export const fetchBlobFromRepo = async (repoOwner, repoName, password, filePath) => {
	// First, get the file's SHA
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
	let sha;
	try {
		const response = await fetch(url, {
			headers: getAuthHeaders(password)
		});

		if (response.ok) {
			const data = await response.json();
			sha = data.sha; // Get the file's SHA
		} else {
			console.log('Bad response: ' + response);
		}
	} catch (error) {
		console.error(error);
	}

	// Then, use the SHA to get the blob
	const blobUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs/${sha}`;
	try {
		const response = await fetch(blobUrl, {
			headers: getAuthHeaders(password)
		});

		if (response.ok) {
			const data = await response.json();
			const fileContent = atob(data.content); // Decode file content from Base64
			return fileContent;
		} else {
			console.log('Bad response: ' + response);
		}
	} catch (error) {
		console.error(error);
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
				console.log('No successful builds found.');
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

export const uploadFileToRepo = async (
	repoOwner,
	repoName,
	password,
	filePath,
	fileContent,
	commitMessage
) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: getAuthHeaders(password)
	});

	if (response.ok) {
		const existingFileData = await response.json();
		const data = {
			message: commitMessage,
			content: fileContent,
			sha: existingFileData.sha
		};

		const updateResponse = await fetch(url, {
			method: 'PUT',
			headers: getAuthHeaders(password),
			body: JSON.stringify(data)
		});

		const updatedData = await updateResponse.json();
		const updatedUrl = updatedData.content.url;

		return updatedUrl;
	} else {
		console.log("^ The above error is expected. This photo wasn't already present.");

		const data = {
			message: commitMessage,
			content: fileContent
		};

		const uploadResponse = await fetch(url, {
			method: 'PUT',
			headers: getAuthHeaders(password),
			body: JSON.stringify(data)
		});

		const uploadedData = await uploadResponse.json();
		const uploadedUrl = uploadedData.content.url;

		return uploadedUrl;
	}
};
