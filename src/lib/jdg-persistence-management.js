import { decrypt } from './jdg-utils.js';

export const repoOwner = 'deanstein';
export const jdgUiRepoName = 'jdg-ui-svelte';
export const jdgWebsiteRepoName = 'jdg-website';
export const pmx3dWebsiteRepoName = 'pmx3d-website';
export const ccpWebsiteRepoName = 'ccp-website';
export const familyTreeDataRepoName = 'family-tree-data';
export const familyTreeDeployRepoName = 'family-tree-deploy';
export const bioPhotoFileName = 'bio-photo';
export const encryptedPAT =
	'U2FsdGVkX19E4XXmu4s1Y76A+iKILjKYG1n92+pqbtzdoJpeMyl6Pit0H8Kq8G28M+ZuqmdhHEfb/ud4GEe5gw==';

export const getLatestCommitDateFromPublicRepo = async (repoOwner, repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/main`;
	let latestCommitDate;

	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			latestCommitDate = new Date(data.commit.committer.date);
		})
		.catch((error) => console.error('Failed to get latest commit date. Error:', error));

	return latestCommitDate;
};

export const getLatestBuildDateFromPublicRepo = async (repoOwner, repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/runs?status=success`;
	let latestBuildDate;

	await fetch(url)
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

export const getTotalCommitsInPublicRepo = async (repoOwner, repoName) => {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
	let totalCommits = 0;

	await fetch(url)
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

export const getFileFromRepo = async (repoOwner, repoName, fileName, password) => {
	let fileData = undefined;
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

	await fetch(url, {
		headers: {
			Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
			Accept: 'application/vnd.github.v3.raw'
		}
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then((data) => {
			fileData = data;
		})
		.catch((error) => {
			console.error('There was a problem fetching the JSON file:', error);
		});

	return fileData;
};

// for binary large objects (blobs)
export const readBlobFromRepo = async (repoOwner, repoName, password, filePath) => {
	// First, get the file's SHA
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
	let sha;
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`
			}
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
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`
			}
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
		headers: {
			Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
			'Content-Type': 'application/json'
		}
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
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
				'Content-Type': 'application/json'
			},
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
			headers: {
				Authorization: `Bearer ${decrypt(encryptedPAT, password)}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const uploadedData = await uploadResponse.json();
		const uploadedUrl = uploadedData.content.url;

		return uploadedUrl;
	}
};
