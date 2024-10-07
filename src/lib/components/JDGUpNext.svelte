<script>
	import { JDGContentBoxFloating, JDGGridLayout, JDGImageTile } from '$lib/index.js';

	export let contentBoxFloatingTitle = 'UP NEXT';

	// this is effectively a wrapper for 3 ImageTiles,
	// so we need to supply all those props
	export let item1Label;
	export let item1Href;
	export let item1ImageAttributes;
	export let item1ObjectPosition = 'center';

	export let item2Label;
	export let item2Href;
	export let item2ImageAttributes;
	export let item2ObjectPosition = 'center';

	export let item3Label;
	export let item3Href;
	export let item3ImageAttributes;
	export let item3ObjectPosition = 'center';
</script>

<JDGContentBoxFloating title={contentBoxFloatingTitle} includeInJumpTo={false}>
	<JDGGridLayout>
		<JDGImageTile
			label={item1Label}
			href={item1Href}
			imageAttributes={item1ImageAttributes}
			labelJustification={'center'}
			useCompactHeightOnMobile={false}
			objectPosition={item1ObjectPosition}
		/>
		<JDGImageTile
			label={item2Label}
			href={item2Href}
			imageAttributes={item2ImageAttributes}
			labelJustification={'center'}
			useCompactHeightOnMobile={false}
			objectPosition={item2ObjectPosition}
		/>
		<JDGImageTile
			label={item3Label}
			href={item3Href}
			imageAttributes={item3ImageAttributes}
			labelJustification={'center'}
			useCompactHeightOnMobile={false}
			objectPosition={item3ObjectPosition}
		/>
	</JDGGridLayout>
</JDGContentBoxFloating>
