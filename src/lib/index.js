/*** CORE EXPORTS ***/

// 🧠 Schemas
export * from './schemas/jdg-image-meta.js';
export * from './schemas/jdg-notification-types.js';
export * from './schemas/jdg-nav-item.js';
// 🕰️ Timeline Schemas
export * from './schemas/timeline/jdg-timeline-event.js';
export * from './schemas/timeline/jdg-timeline-host.js';
export * from './schemas/timeline/jdg-timeline-event-image.js';
export * from './schemas/timeline/jdg-timeline-event-reference.js';
export * from './schemas/timeline/jdg-timeline-event-types.js';
export * from './schemas/timeline/jdg-timeline-row-item.js';

// 🏪 Stores
export * from './stores/jdg-ui-store.js';
export * from './stores/jdg-shared-urls-store.js';

// 🧩 Management & State
export * from './jdg-persistence-management.js';
export * from './jdg-state-management.js';
export * from './jdg-ui-management.js';

// 🛠️ Utilities
export * from './jdg-utils.js';

// 🧵 Shared Assets
export * from './jdg-shared-strings.js';
export * from './jdg-shared-styles.js';

/*** SVELTE EXPORTS ***/

import JDGAccentBlock from './components/JDGAccentBlock.svelte';
export { JDGAccentBlock };

import JDGAccentBlockWithText from './components/JDGAccentBlockWithText.svelte';
export { JDGAccentBlockWithText };

import JDGAccentText from './components/JDGAccentText.svelte';
export { JDGAccentText };

import JDGAdminLoginModal from './components/DevTools/JDGAdminLoginModal.svelte';
export { JDGAdminLoginModal };

import JDGAnimateOnVisible from './components/JDGAnimateOnVisible.svelte';
export { JDGAnimateOnVisible };

import JDGAnchorTag from './components/JDGAnchorTag.svelte';
export { JDGAnchorTag };

import JDGAppContainer from './components/JDGAppContainer.svelte';
export { JDGAppContainer };

import JDGBackground from './components/JDGBackground.svelte';
export { JDGBackground };

import JDGBodyCopy from './components/JDGBodyCopy.svelte';
export { JDGBodyCopy };

import JDGButton from './components/Input/JDGButton.svelte';
export { JDGButton };

import JDGCheckbox from './components/Input/JDGCheckbox.svelte';
export { JDGCheckbox };

import JDGClipFade from './components/JDGClipFade.svelte';
export { JDGClipFade };

import JDGComposeButton from './components/Compose/JDGComposeButton.svelte';
export { JDGComposeButton };

import JDGComposeToolbar from './components/Compose/JDGComposeToolbar.svelte';
export { JDGComposeToolbar };

import JDGContentBoxFloating from './components/JDGContentBoxFloating.svelte';
export { JDGContentBoxFloating };

import JDGContentContainer from './components/JDGContentContainer.svelte';
export { JDGContentContainer };

import JDGDevToolbar from './components/DevTools/JDGDevToolbar.svelte';
export { JDGDevToolbar };

import JDGDevToolbarSticky from './components/DevTools/JDGDevToolbarSticky.svelte';
export { JDGDevToolbarSticky };

import JDGDevOverlay from './components/DevTools/JDGDevOverlay.svelte';
export { JDGDevOverlay };

import JDGFeatureCard from './components/JDGFeatureCard.svelte';
export { JDGFeatureCard };

import JDGFooter from './components/JDGFooter.svelte';
export { JDGFooter };

import JDGFullWidthContainer from './components/JDGFullWidthContainer.svelte';
export { JDGFullWidthContainer };

import JDGGridLayout from './components/JDGGridLayout.svelte';
export { JDGGridLayout };

import JDGH3H4 from './components/JDGH3H4.svelte';
export { JDGH3H4 };

import JDGHeader from './components/JDGHeader.svelte';
export { JDGHeader };

import JDGIFrame from './components/JDGIFrame.svelte';
export { JDGIFrame };

import JDGImage from './components/Image/JDGImage.svelte';
export { JDGImage };

import JDGImageCaptionAttribution from './components/Image/JDGImageCaptionAttribution.svelte';
export { JDGImageCaptionAttribution };

import JDGImageCarousel from './components/Image/JDGImageCarousel.svelte';
export { JDGImageCarousel };

import JDGImageCompare from './components/Image/JDGImageCompare.svelte';
export { JDGImageCompare };

import JDGImageDetailOverlay from './components/Image/JDGImageDetailOverlay.svelte';
export { JDGImageDetailOverlay };

import JDGImageFullWidth from './components/Image/JDGImageFullWidth.svelte';
export { JDGImageFullWidth };

import JDGImageHybridGridCarousel from './components/Image/JDGImageHybridGridCarousel.svelte';
export { JDGImageHybridGridCarousel };

import JDGImageTile from './components/Image/JDGImageTile.svelte';
export { JDGImageTile };

import JDGImageThumbnailGroup from './components/Image/JDGImageThumbnailGroup.svelte';
export { JDGImageThumbnailGroup };

import JDGInputContainer from './components/Input/JDGInputContainer.svelte';
export { JDGInputContainer };

import JDGJumpTo from './components/Nav/JDGJumpTo.svelte';
export { JDGJumpTo };

import JDGLoadingOverlay from './components/JDGLoadingOverlay.svelte';
export { JDGLoadingOverlay };

import JDGModal from './components/JDGModal.svelte';
export { JDGModal };

import JDGNavItem from './components/Nav/JDGNavItem.svelte';
export { JDGNavItem };

import JDGNotificationBanner from './components/JDGNotificationBanner.svelte';
export { JDGNotificationBanner };

import JDGOverlay from './components/JDGOverlay.svelte';
export { JDGOverlay };

import JDGVersionPackageJson from './components/Version/JDGVersionPackageJson.svelte';
export { JDGVersionPackageJson };

import JDGVersionNpmPackage from './components/Version/JDGVersionNpmPackage.svelte';
export { JDGVersionNpmPackage };

import JDGScrollToTop from './components/JDGScrollToTop.svelte';
export { JDGScrollToTop };

import JDGSelect from './components/Input/JDGSelect.svelte';
export { JDGSelect };

import JDGSideNav from './components/Nav/JDGSideNav.svelte';
export { JDGSideNav };

import JDGSocialMedia from './components/JDGSocialMedia.svelte';
export { JDGSocialMedia };

import JDGStoreView from './components/DevTools/JDGStoreView.svelte';
export { JDGStoreView };

import JDGStripesHorizontal from './components/JDGStripesHorizontal.svelte';
export { JDGStripesHorizontal };

import JDGTextInput from './components/Input/JDGTextInput.svelte';
export { JDGTextInput };

import JDGTimeline from './components/Timeline/JDGTimeline.svelte';
export { JDGTimeline };

import JDGTimelineEvent from './components/Timeline/JDGTimelineEvent.svelte';
export { JDGTimelineEvent };

import JDGTopNav from './components/Nav/JDGTopNav.svelte';
export { JDGTopNav };

import JDGUpNext from './components/Nav/JDGUpNext.svelte';
export { JDGUpNext };

/*** SVG COMPONENTS ***/
import JDGCloseIcon from './assets/svg/JDGCloseIcon.svelte';
export { JDGCloseIcon };

import JDGLoadingSpinner from './assets/svg/JDGLoadingSpinner.svelte';
export { JDGLoadingSpinner };

import JDGMenuIcon from './assets/svg/JDGMenuIcon.svelte';
export { JDGMenuIcon };

import JDGRandomDelaunay from './assets/svg/JDGRandomDelaunay.svelte';
export { JDGRandomDelaunay };
