import { upgradeImageMetaRegistry } from '$lib/jdg-utils.js';
import imageMetaRegistryJson from './image-meta-registry.json' with { type: 'json' };

// Upgrade the registry - this upgrades and post-processes each imageMeta
const upgradedimageMetaRegistry = upgradeImageMetaRegistry(imageMetaRegistryJson);

export { upgradedimageMetaRegistry as imageMetaRegistry };
