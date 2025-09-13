import CryptoJS from 'crypto-js';
import {
	jdgRepoOwner,
	fetchLatestBuildDate,
	fetchTotalCommitsQty,
	fetchLatestCommitDate
} from './jdg-persistence-management.js';
import { getDistancePxToBottomOfHeader } from './jdg-ui-management.js';

import { jdgSchemaVersion } from './schemas/jdg-schema-versions.js';
import jdgTimelineEvent from './schemas/timeline/jdg-timeline-event.js';
import jdgTimelineEventTypes from './schemas/timeline/jdg-timeline-event-types.js';

///
/// WINDOW UTILS
///

// remove an anchor tag from the URL
export const removeAnchorTagFromHistory = () => {
	const url = new URL(window.location.href);
	const cleanUrl = url.origin + url.pathname;
	window.history.replaceState(null, '', cleanUrl);
};

///
/// DOM UTILS
///

// traverses the DOM upwards to find a scrolling div
// if it doesn't find one, return the original element
export const getNearestScrollingElement = (element) => {
	let current = element.parentElement;
	while (current) {
		const style = getComputedStyle(current);
		const overflowY = style.overflowY;
		const hasScroll = current.scrollHeight > current.clientHeight;

		if ((overflowY === 'auto' || overflowY === 'scroll') && hasScroll) {
			return current;
		}

		current = current.parentElement;
	}

	// return the initial element if no scrolling container found
	return element;
};

///
/// ARRAY UTILS
///

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

///
/// ENCRYPTION UTILS
///

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

///
/// OBJECT UTILS
///

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
	return {
		...JSON.parse(JSON.stringify(object)),
		...JSON.parse(JSON.stringify(overrides))
	};
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

///
/// DATE UTILS
///

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

///
/// NUMBER UTILS
///

export const isNumberValid = (number) => {
	return typeof number === 'number' && number !== 0 && !isNaN(number) && number !== Infinity;
};

///
/// STRING UTILS
///

// get a pixel value from a string
export const getPixelValueFromString = (string) => {
	let stringValue;
	let stringUnit;
	let pixelValueFinal;
	// only try if prop is not auto
	if (string !== 'auto') {
		[stringValue, stringUnit] = string.match(/^(\d*\.?\d+)(\D+)$/).slice(1);
		const maxHeightParsed = parseFloat(stringValue);

		if (stringUnit === 'vh') {
			pixelValueFinal = Math.ceil(convertVhToPixels(maxHeightParsed));
		} else if (stringUnit === 'px') {
			pixelValueFinal = Math.ceil(maxHeightParsed);
		}
	}
	return pixelValueFinal;
};

// replaces spaces with hyphens, and converts to lowercase
// for use in converting section titles into anchor tags
export const convertStringToAnchorTag = (string, addHash = true) => {
	// don't do anything if it appears
	// the string is already formatted as an anchor tag
	const anchorTagPattern = /^#[a-z0-9-]+$/;
	if (anchorTagPattern.test(string)) {
		return string;
	}

	string = string?.replace(/ /g, '-').toLowerCase();
	// Add the hash if it doesn't exist already
	if (string && addHash && !string.startsWith('#')) {
		string = '#' + string;
	}
	return string;
};

// build code is in this format:
// yyyymmdd.nn where yyyymmdd is the "build date" and nn is the "build number" (see below)
export const getBuildCode = async (repoName) => {
	// build date is either the latest build date or the latest commit date
	const buildDate =
		(await fetchLatestBuildDate(jdgRepoOwner, repoName)) ??
		(await fetchLatestCommitDate(jdgRepoOwner, repoName));
	// build number is number of commits
	const buildNumber = await fetchTotalCommitsQty(jdgRepoOwner, repoName);
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

export const openUrl = (url, newTab) => {
	if (newTab) {
		window.open(url, '_blank');
	} else {
		window.location.href = url;
	}
};

///
/// ELEMENT UTILS
///

export const getMaxElementWidthPx = (elementRef) => {
	let maxWidthPx;
	// temporarily set the width to 100%
	const existingWidth = elementRef.style.width;
	elementRef.style.width = '100%';
	// get the maxWidth
	maxWidthPx = elementRef.clientWidth;
	// reset the style to what it was before
	elementRef.style.width = existingWidth;
	return maxWidthPx;
};

export const getMaxElementHeightPx = (elementRef) => {
	let maxHeightPx;
	// temporarily set the height to 100%
	const existingHeight = elementRef.style.height;
	elementRef.style.height = '100%';
	// get the maxHeightPx
	maxHeightPx = elementRef.clientHeight;
	// reset the style to what it was before
	elementRef.style.height = existingHeight;
	return maxHeightPx;
};

///
/// IMAGE AND PIXEL UTILS
///

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

export const doesStringContainVh = (string) => {
	const contains = typeof string === 'string' && string.includes('vh');
	return contains;
};

// converts either a number (assuming vh)
// or a string containing 'vh' to pixels
// based on the current window height
export const convertVhToPixels = (vhValue) => {
	// if no window, can't calculate equivalent pixels
	if (typeof window === 'undefined') {
		return vhValue;
	}
	// only handle raw numbers or strings containing 'vh'
	if (isFinite(vhValue) || doesStringContainVh(vhValue)) {
		return (parseFloat(vhValue) / 100) * window.innerHeight;
	}
	// otherwise, pass the value through and do nothing
	else {
		return vhValue;
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

// get a pixel value from whatever is passed into the maxHeight prop
export const getMaxHeightPxFromProp = (maxheightProp, containerRef) => {
	let maxHeightPx;
	// only calculate maxHeight if prop is not auto
	if (maxheightProp !== 'auto') {
		maxHeightPx = getPixelValueFromString(maxheightProp);
	} else {
		maxHeightPx = getMaxElementHeightPx(containerRef);
	}
	return maxHeightPx;
};

// get a pixel value from whatever is passed into the maxHeight prop
export const getMaxWidthPxFromProp = (maxWidthProp, containerRef) => {
	let maxWidthPx;
	// only calculate maxWidth if prop is not auto
	if (maxWidthProp !== 'auto') {
		maxWidthPx = getPixelValueFromString(maxWidthProp);
	} else {
		maxWidthPx = getMaxElementWidthPx(containerRef);
	}
	return maxWidthPx;
};

//
// COLOR UTILS
//

export const convertHexToRGBA = (hexColor, alpha = 1) => {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// adjusts a given color to meet a WCAG contrast value
export const adjustColorForContrast = (
	colorToChange,
	baseColor,
	minContrastRatio = 2.5 /* WCAG contrast value (ideal is 4.5) */
) => {
	// if incoming color is transparent, do nothing
	if (colorToChange === 'transparent') {
		return colorToChange;
	}
	//console.log("Adjusting color for contrast. Color to change: " + colorToChange + " and base color: " + baseColor);
	// check if color and baseColor are in HEX or RGBA format
	let isColorHex = typeof colorToChange === 'string' && colorToChange.startsWith('#');
	let isBaseColorHex = typeof baseColor === 'string' && baseColor.startsWith('#');

	// convert color and baseColor to RGB
	let rgbColor = isColorHex ? hexToRgb(colorToChange) : rgbaToRgb(colorToChange);
	let rgbBaseColor = isBaseColorHex ? hexToRgb(baseColor) : rgbaToRgb(baseColor);

	// extract alpha value if colorToChange is in RGBA format
	let alpha = 1; // Default alpha value
	if (!isColorHex && typeof colorToChange === 'string') {
		let rgbaMatch = colorToChange.match(/rgba\((\d+), (\d+), (\d+), (\d+\.?\d*)\)/);
		if (rgbaMatch) {
			alpha = parseFloat(rgbaMatch[4]);
		}
	}

	// calculate the contrast ratio
	let contrastRatio = calculateContrastRatio(rgbColor, rgbBaseColor);
	//console.log("Contrast ratio for " + colorToChange + ": " + contrastRatio);

	const maxIterations = 10;
	let iterations = 0;

	// if the contrast ratio is less than the minimum contrast ratio, adjust the color
	while (contrastRatio < minContrastRatio && iterations < maxIterations) {
		// If the base color is light, make the color darker
		if (isLight(rgbBaseColor)) {
			// @ts-expect-error
			rgbColor = darkenColor(rgbColor, 0.1);
		} else {
			// if the base color is dark, make the color lighter
			// @ts-expect-error
			rgbColor = lightenColor(rgbColor, 0.1);
		}

		// recalculate the contrast ratio
		contrastRatio = calculateContrastRatio(rgbColor, rgbBaseColor);

		iterations++;
	}

	// convert the color back to its original format
	let adjustedColor = isColorHex ? rgbToHex(rgbColor) : rgbToRgba(rgbColor, alpha);

	return adjustedColor;
};

export const rgbaToRgb = (rgba) => {
	let r, g, b, a;
	if (typeof rgba === 'string') {
		// Extract the r, g, b, a values from the rgba string
		[r, g, b, a] = rgba.slice(5, -1).split(',').map(Number);
	} else if (typeof rgba === 'object' && 'r' in rgba && 'g' in rgba && 'b' in rgba) {
		// If rgba is an object, extract the r, g, b values directly
		({ r, g, b } = rgba);
	} else {
		throw new Error(
			'Invalid color format for color ' + rgba + '. Please use either rgba format or an RGB object.'
		);
	}

	return { r, g, b };
};

export const rgbToRgba = (rgb, alpha) => {
	// Combine the r, g, b values into an rgba string with the given alpha
	let rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

	return rgba;
};

export const hexToRgb = (hex) => {
	let result;
	if (hex.length === 9) {
		// handle 8-digit hex (with alpha)
		result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
					a: parseInt(result[4], 16) / 255 // alpha value between 0 and 1
				}
			: null;
	} else {
		// handle 6-digit hex (without alpha)
		result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
					a: 1
				}
			: null;
	}
};

export const rgbToHex = (rgb) => {
	return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
};

export const calculateContrastRatio = (color1, color2) => {
	let l1 = getRelativeLuminance(color1) + 0.05;
	let l2 = getRelativeLuminance(color2) + 0.05;

	// Ensure l1 is the relative luminance of the lighter color
	if (l1 < l2) {
		[l1, l2] = [l2, l1];
	}

	return l1 / l2;
};

export const getRelativeLuminance = (color) => {
	let rgb = [color.r, color.g, color.b];
	rgb = rgb.map((c) => {
		c /= 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

export const isLight = (color) => {
	let yiq = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
	return yiq >= 128;
};

export const lightenColor = (color, lightenRatio, matchInputType = true) => {
	let rgbColor;
	let inputFormat = 'object';

	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			rgbColor = hexToRgb(color);
			inputFormat = 'hex';
		} else if (color.startsWith('rgba')) {
			rgbColor = rgbaToRgb(color);
			inputFormat = 'rgba';
		} else {
			throw new Error(
				'Invalid color format for color ' + color + '. Please use either rgba or hex format.'
			);
		}
	} else if (typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
		rgbColor = color;
	} else {
		throw new Error(
			'Invalid color format for color ' +
				color +
				'. Please use either rgba or hex format or an RGB object.'
		);
	}

	let ratio = 1 + lightenRatio;
	let result = {
		r: Math.min(Math.round(rgbColor.r * ratio), 255),
		g: Math.min(Math.round(rgbColor.g * ratio), 255),
		b: Math.min(Math.round(rgbColor.b * ratio), 255)
	};

	if (matchInputType) {
		switch (inputFormat) {
			case 'hex':
				return rgbToHex(result);
			case 'rgba':
				return `rgba(${result.r}, ${result.g}, ${result.b}, ${rgbColor.a || 1})`;
			default:
				return result;
		}
	} else {
		return result;
	}
};

export const darkenColor = (color, darkenRatio, matchInputType = true) => {
	let rgbColor;
	let inputFormat = 'object';

	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			rgbColor = hexToRgb(color);
			inputFormat = 'hex';
		} else if (color.startsWith('rgba')) {
			rgbColor = rgbaToRgb(color);
			inputFormat = 'rgba';
		} else {
			throw new Error(
				'Invalid color format for color ' + color + '. Please use either rgba or hex format.'
			);
		}
	} else if (typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
		rgbColor = color;
	} else {
		throw new Error(
			'Invalid color format for color ' +
				color +
				'. Please use either rgba or hex format or an RGB object.'
		);
	}

	let ratio = 1 - darkenRatio;
	let result = {
		r: Math.max(Math.round(rgbColor.r * ratio), 0),
		g: Math.max(Math.round(rgbColor.g * ratio), 0),
		b: Math.max(Math.round(rgbColor.b * ratio), 0)
	};

	if (matchInputType) {
		switch (inputFormat) {
			case 'hex':
				return rgbToHex(result);
			case 'rgba':
				return `rgba(${result.r}, ${result.g}, ${result.b}, ${rgbColor.a || 1})`;
			default:
				return result;
		}
	} else {
		return result;
	}
};

const hueToRgb = (p, q, t) => {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
};

export const setHexColorSaturation = (hexColor, saturation) => {
	let r = parseInt(hexColor.substring(1, 3), 16) / 255;
	let g = parseInt(hexColor.substring(3, 5), 16) / 255;
	let b = parseInt(hexColor.substring(5, 7), 16) / 255;

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		let d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	s = saturation / 100;
	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hueToRgb(p, q, h + 1 / 3);
		g = hueToRgb(p, q, h);
		b = hueToRgb(p, q, h - 1 / 3);
	}

	return `#${Math.round(r * 255)
		.toString(16)
		.padStart(2, '0')}${Math.round(g * 255)
		.toString(16)
		.padStart(2, '0')}${Math.round(b * 255)
		.toString(16)
		.padStart(2, '0')}`;
};

export const parseRgbaColorString = (rgbaColorString) => {
	const match = rgbaColorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
	if (match) {
		return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4] || 1)];
	}
	return null;
};

export const generateGradient = (steps, colorString1, colorString2, colorString3) => {
	const startColor = parseRgbaColorString(colorString1);
	const midColor = parseRgbaColorString(colorString2);
	const endColor = colorString3 ? parseRgbaColorString(colorString3) : midColor;
	const colors = [];
	const halfSteps = Math.floor(steps / 2);

	for (let i = 0; i < halfSteps; i++) {
		const r = startColor[0] + ((midColor[0] - startColor[0]) / halfSteps) * i;
		const g = startColor[1] + ((midColor[1] - startColor[1]) / halfSteps) * i;
		const b = startColor[2] + ((midColor[2] - startColor[2]) / halfSteps) * i;
		const a = startColor[3] + ((midColor[3] - startColor[3]) / halfSteps) * i;
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	for (let i = halfSteps; i < steps; i++) {
		const r = midColor[0] + ((endColor[0] - midColor[0]) / halfSteps) * (i - halfSteps);
		const g = midColor[1] + ((endColor[1] - midColor[1]) / halfSteps) * (i - halfSteps);
		const b = midColor[2] + ((endColor[2] - midColor[2]) / halfSteps) * (i - halfSteps);
		const a = midColor[3] + ((endColor[3] - midColor[3]) / halfSteps) * (i - halfSteps);
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	return colors;
};

///
/// CLOUDINARY UTILS
///

export const isUrlCloudinary = (url) => {
	if (url.includes('cloudinary.com')) {
		return true;
	} else {
		return false;
	}
};

// ensures that alt is the same as caption if not provided
export const postProcessImageMeta = (jdgImageMeta) => {
	// alt is likely the same as caption, unless already specified
	if (jdgImageMeta.caption && !jdgImageMeta.alt) {
		jdgImageMeta.alt = jdgImageMeta.caption;
	}
	return jdgImageMeta;
};

export const addCloudinaryUrlTransformation = (url, transformation = 'f_auto') => {
	if (isUrlCloudinary(url)) {
		let parts = url.split('/upload/');
		let baseUrl = parts[0];
		let path = parts[1];

		// remove existing f_auto transformation if it exists
		// TODO: Remove this once all imageMetaCollection are rid of manual f_auto
		path = path.replace(/^f_auto\/|\/f_auto\/|\/f_auto$/, '');

		return `${baseUrl}/upload/${transformation}/${path}`;
	}
	return url;
};

export const addCloudinaryUrlWidth = (url, width) => {
	if (isUrlCloudinary(url)) {
		return addCloudinaryUrlTransformation(url, `f_auto,w_${width},c_fill`);
	}
	return url;
};

export const addCloudinaryUrlHeight = (url, height) => {
	if (isUrlCloudinary(url)) {
		return addCloudinaryUrlTransformation(url, `f_auto,h_${height},c_fill`);
	}
	return url;
};

///
/// SCROLLING UTILS
///

// scrolls to the given anchor id
// with options for accounting for header and additional offset
// note that JDGContentBoxFloating anchors are already positioned with header height offset
export const scrollToAnchor = (anchorId, accountForHeader = false, additionalOffset = 0) => {
	// ensure the anchorId is properly formatted
	const anchorIdPostProcessed = convertStringToAnchorTag(anchorId, false);
	const element = document.getElementById(anchorIdPostProcessed);
	if (element) {
		// if not accounting to header and no add'l offset, do the simple thing
		if (accountForHeader == false && additionalOffset == 0) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		// otherwise, do some calculations
		else {
			const rect = element.getBoundingClientRect();
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const topValue = accountForHeader
				? rect.top + scrollTop - getDistancePxToBottomOfHeader() - additionalOffset
				: rect.top + scrollTop - additionalOffset;
			window.scrollTo({
				top: topValue,
				behavior: 'smooth'
			});
		}
	} else {
		console.error('scrollToAnchor: Element not found by ID: ' + anchorIdPostProcessed);
	}
};

export const getIsWindowScrolledToBottom = () => {
	return window.innerHeight + window.scrollY === document.body.offsetHeight;
};

///
/// TIMELINE MANAGEMENT UTILS
///

// Create a timeline event with optional customizations per type
export function createTimelineEvent(timelineEventType) {
	const typeDef = jdgTimelineEventTypes[timelineEventType];

	if (!typeDef) {
		throw new Error(`JDG UI: Invalid timeline event type: ${timelineEventType}`);
	}

	return {
		...jdgTimelineEvent,
		type: typeDef.type,
		additionalContent: { ...typeDef.content }
	};
}

// Upgrades a timeline event with the latest fields
export function upgradeTimelineEvent(event) {
	const typeKey = event?.type;
	const typeDef = jdgTimelineEventTypes[typeKey];

	if (!typeDef) {
		console.warn(`Unknown timeline event type: ${typeKey}`);
		return { ...event, version: jdgSchemaVersion };
	}

	const defaultContent = typeDef.content || {};
	const existingContent = event.additionalContent || {};

	// Merge defaults with existing content, preserving user-entered values
	const upgradedContent = { ...defaultContent, ...existingContent };

	return {
		...event,
		additionalContent: upgradedContent,
		version: jdgSchemaVersion
	};
}
