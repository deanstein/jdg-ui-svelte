// All images referenced in this website must be in image-meta-registry.json
// This file takes image-meta-registry.json
// and upgrades then exports it for this website to reference

import imageMetaRegistryJson from './image-meta-registry.json' with { type: 'json' };
import { upgradeImageMetaRegistry } from '$lib/jdg-utils.js';

// Upgrade the registry - this upgrades and post-processes each imageMeta
const imageMetaRegistry = upgradeImageMetaRegistry(imageMetaRegistryJson);

export default imageMetaRegistry;
