import CryptoJS from 'crypto-js';
import {
	repoOwner,
	getLatestBuildDateFromPublicRepo,
	getTotalCommitsInPublicRepo,
	getLatestCommitDateFromPublicRepo
} from './jdg-persistence-management.js';

export const addUniqueValueToArray = (array, value) => {
	if (!array.includes(value)) {
		array.push(value);
	}
	return array;
};

export const getIsValueInArray = (array, value) => {
	const index = array.indexOf(value);
	return index > -1 ? true : false;
};

export const removeValueFromArray = (array, value) => {
	const index = array.indexOf(value);
	if (index > -1) {
		array.splice(index, 1);
	}
	return array;
};

export const decrypt = (encrypted, password) => {
	try {
		var encryptedWA = CryptoJS.enc.Base64.parse(encrypted);
		var saltWA = CryptoJS.lib.WordArray.create(encryptedWA.words.slice(8 / 4, 16 / 4));
		var ciphertextWA = CryptoJS.lib.WordArray.create(
			encryptedWA.words.slice(16 / 4, encryptedWA.words.length)
		);

		var keyIvWA = CryptoJS.PBKDF2(password, saltWA, {
			keySize: (32 + 16) / 4,
			iterations: 10000,
			hasher: CryptoJS.algo.SHA256
		});
		var keyWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(0, 32 / 4));
		var ivWA = CryptoJS.lib.WordArray.create(keyIvWA.words.slice(32 / 4, (32 + 16) / 4));

		var decryptedWA = CryptoJS.AES.decrypt(
			// @ts-ignore
			{
				ciphertext: ciphertextWA
			},
			keyWA,
			{
				iv: ivWA
			}
		);
		var decrypted = decryptedWA.toString(CryptoJS.enc.Utf8);

		if (decrypted === '') {
			throw new Error('Incorrect password. Decryption failed.');
		}

		return decrypted;
	} catch (error) {
		throw new Error('Error decrypting: ' + error.message);
	}
};

export const areObjectsEqual = (obj1, obj2) => {
	const logReasons = false;

	// Check if both objects are null or undefined
	if (obj1 === obj2) {
		return true;
	}
	// Check if both objects are not null and have the same type
	if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
		logReasons ? console.log('not equal because of null and type thing') : () => {};
		return false;
	}

	// If both objects are objects
	if (typeof obj1 === 'object') {
		// Get the keys of both objects
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		// Check if the number of keys are the same
		if (keys1.length !== keys2.length) {
			logReasons ? console.log('not equal because of key length', keys1, keys2) : () => {};
			return false;
		}
		// Check each property of the objects recursively
		for (let key of keys1) {
			if (!areObjectsEqual(obj1[key], obj2[key])) {
				logReasons ? console.log('one of the keys not equal', obj1[key], obj2[key]) : () => {};
				return false;
			}
		}
		return true;
	}

	// If both objects are not arrays or objects, compare them directly
	return obj1 === obj2;
};

export const instantiateObject = (object, overrides = {}) => {
	return { ...JSON.parse(JSON.stringify(object)), ...overrides };
};

export const deepMatchObjects = (dataToMatch, dataToChange, forceChangeToType = undefined) => {
	if (forceChangeToType && typeof dataToChange !== 'object') {
		dataToChange = forceChangeToType;
	}

	for (var key in dataToMatch) {
		if (!dataToChange.hasOwnProperty(key)) {
			if (Array.isArray(dataToMatch[key])) {
				dataToChange[key] = [];
			} else if (typeof dataToMatch[key] === 'string') {
				dataToChange[key] = '';
			} else if (typeof dataToMatch[key] === 'boolean') {
				dataToChange[key] = false;
			} else if (typeof dataToMatch[key] === 'object') {
				dataToChange[key] = {};
				deepMatchObjects(dataToMatch[key], dataToChange[key], forceChangeToType);
			}
		} else if (typeof dataToMatch[key] === 'object') {
			deepMatchObjects(dataToMatch[key], dataToChange[key], forceChangeToType);
		}
	}

	return dataToChange;
};

export const setNestedObjectProperty = (obj, path, value) => {
	let parts = path.split('.');
	let last = parts.pop();
	let target = obj;
	for (let part of parts) {
		target = target[part] || {};
	}
	target[last] = value;
	return obj;
};

// gets an object from an array of objects
export const getObjectByKeyValue = (arr, key, value) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === value) {
			return arr[i];
		}
	}
	return undefined;
};

// replaces an object in an array of objects
export const replaceObjectByKeyValue = (arr, key, value, replacementObject) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === value) {
			arr[i] = replacementObject;
			return true; // indicate that object was replaced
		}
	}
	console.log('Failed to find and replace object.');
	return false; // indicate that object was not found
};

// deletes an object in an array of objects
export const deleteObjectByKeyValue = (arr, key, value) => {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][key] === value) {
			arr.splice(i, 1);
			return true; // indicate that object was deleted
		}
	}
	return false; // indicate that object was not found
};

export const getIsDateValid = (dateToTest) => {
	const date = new Date(dateToTest);
	const isValid = !isNaN(date.getTime());
	//console.log("Date to test: " + dateToTest, "Is valid? " + isValid)
	return isValid;
};

export const convertDateToUTC = (date) => {
	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds()
	);
};

export const getNumberOfYearsBetweenEvents = (startDate, endDate) => {
	const correctedStartDate = new Date(startDate);
	const correctedEndDate = new Date(endDate);

	var years = correctedEndDate.getFullYear() - correctedStartDate.getFullYear();

	// Subtract a year if the other date is earlier in the year than the birth date
	if (
		correctedEndDate.getMonth() < correctedStartDate.getMonth() ||
		(correctedEndDate.getMonth() == correctedStartDate.getMonth() &&
			correctedEndDate.getDate() < correctedStartDate.getDate())
	) {
		years--;
	}

	return years;
};

// build code is in this format:
// yyyymmdd.nn where yyyymmdd is the "build date" and nn is the "build number" (see below)
export const getBuildCode = async (repoName) => {
	// build date is either the latest build date or the latest commit date
	const buildDate =
		(await getLatestBuildDateFromPublicRepo(repoOwner, repoName)) ??
		(await getLatestCommitDateFromPublicRepo(repoOwner, repoName));
	// build number is number of commits
	const buildNumber = await getTotalCommitsInPublicRepo(repoOwner, repoName);
	const newDate = new Date(buildDate);
	const year = newDate.getFullYear().toString();
	let month = (newDate.getMonth() + 1).toString();
	if (month.length === 1) {
		month = '0' + month;
	}
	let day = newDate.getDate().toString();
	if (day.length === 1) {
		day = '0' + day;
	}

	return year
		.concat(month)
		.concat(day)
		.concat('.' + buildNumber);
};

export const largest = (a, b) => {
	if (a > b) return a;
	else if (a === b) return a;
	else return b;
};

export const getExtensionFromUrl = (url) => {
	let fileExtensionWithDot = '';

	if (url) {
		try {
			const parsedUrl = new URL(url);
			const pathParts = parsedUrl.pathname.split('/');
			const fileNameWithExtension = pathParts.pop();
			const fileExtension = fileNameWithExtension.split('.').pop();

			if (fileExtension) {
				fileExtensionWithDot = `.${fileExtension}`;
			}
		} catch (error) {
			console.error('Error parsing URL:', error);
		}
	}

	return fileExtensionWithDot;
};

export const getMIMEType = (binaryData) => {
	if (!binaryData) {
		return;
	}

	const signatures = {
		'data:image/jpeg': [[0xff, 0xd8, 0xff]],
		'data:image/png': [
			[0x89, 0x50, 0x4e, 0x47], // PNG signature
			[0x89, 0x4c, 0x4e, 0x47] // Alternate PNG signature
		]
	};

	const bytes = new Uint8Array(binaryData.length);

	for (let i = 0; i < binaryData.length; i++) {
		bytes[i] = binaryData.charCodeAt(i);
	}

	for (const format in signatures) {
		const formatSignatures = signatures[format];
		for (const signature of formatSignatures) {
			const matchesSignature = signature.every((byte, index) => byte === bytes[index]);
			if (matchesSignature) {
				return format;
			}
		}
	}

	return 'data:image/png'; // Unknown format
};

export const convertVhToPixels = (vhValue) => {
	if (typeof window === 'undefined') {
		return 0;
	} else {
		return (vhValue / 100) * window.innerHeight;
	}
};

export const convertPixelsToVh = (pixelValue) => {
	if (typeof window === 'undefined') {
		return 0;
	} else {
		return ((pixelValue / window.innerHeight) * 100).toString() + 'vh';
	}
};

export const convertRemToPixels = (remValue) => {
	return (
		remValue * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('font-size'))
	);
};

export const convertHexToRGBA = (hexColor, alpha = 1) => {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// given an array of images (using meta.glob.import()),
// get the corresponding array of enhanced images (img:enhanced)
export const getImageEnhancedSrcCollection = async (importedImages, imageAttributesCollection) => {
	await Promise.all(
		Object.entries(imageAttributesCollection).map(async ([key, attributes]) => {
			const imagePromise = importedImages[attributes.imgSrc.split('?')[0]];
			if (imagePromise) {
				const module = await imagePromise();
				imageAttributesCollection[key].imgEnhancedSrc = module.default;
			}
		})
	);
};
