import { writable } from 'svelte/store';
// get the local json to define the structure initially
import sharedUrls from './jdg-shared-urls.json' with { type: 'json' };

// this will be overwritten by JDGAppContainer which gets the latest
// from jdg-shared-urls.json, decoupled from jdg-ui-svelte package version
const jdgSharedUrlsStore = writable(sharedUrls);
export default jdgSharedUrlsStore;
