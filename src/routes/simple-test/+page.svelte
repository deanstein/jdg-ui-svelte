<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImageTile
	} from '$lib/index.js';
	import { imageAttributesCollection } from '../image-attributes-collection.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating title="GRID LAYOUTS">
		<JDGBodyCopy textAlign="center" paddingBottom="0" paddingTop="0">
			<b>2 ITEMS</b>
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.ehs_1920_broadway_northeast}
				showCaption={true}
			/>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.hst.fms_2013_broadway_northeast}
				showCaption={true}
			/>
		</JDGGridLayout>
		<JDGGridLayout>
			<JDGImageTile
				imageAttributes={imageAttributesCollection.rose_mall_60s70s_1}
				fillContainer={false}
				maxHeight="400px"
			/>
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>
