import { writable } from 'svelte/store';

import { jdgColors } from '$lib/jdg-shared-styles.js';

export let accentColors = writable(jdgColors.accentColorsJDG);
export let activeNotificationBanners = writable([]);
export let doShowDevTools = writable(false);
export let doShowHeaderStripes = writable(false);
export let doShowNavSidebar = writable(false);
export let highestZIndex = writable(1);
export let isMobileBreakpoint = writable(false);
export let isScrolling = writable(false);
export let jumpToNavItems = writable([]);

// image detail overlay
export let imageDetailAttributes = writable({});
export let imageDetailWidth = writable(0); // width of the image for caption alignment
export let doShowImageDetailOverlay = writable(false);

// sizes
export let clientWidth = writable(0); // window minus scrollbar
export let windowWidth = writable(0); // full window width, including scrollbar
