<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGGridLayout,
		JDGImage,
		JDGImageTile,
		JDGLoadingSpinner
	} from '$lib/index.js';
</script>

<JDGContentContainer overlapWithHeader={true} paddingTop="0">
	<JDGContentBoxFloating title="PLACEHOLDER IMAGES">
		<JDGBodyCopy paddingTop="0" textAlign="center">
			These images weren't provided a src property, so they get the default placeholder.
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile />
			<JDGImageTile />
			<JDGImageTile />
		</JDGGridLayout>
		<JDGBodyCopy textAlign="center">This is the loading spinner, at 50px:</JDGBodyCopy>
		<JDGGridLayout>
			<JDGLoadingSpinner />
		</JDGGridLayout>
		<JDGBodyCopy textAlign="center">And at 25px:</JDGBodyCopy>
		<JDGGridLayout>
			<JDGLoadingSpinner spinnerHeightPx={25} />
		</JDGGridLayout>
		<JDGBodyCopy textAlign="center">
			These images are always in a loading state for testing
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImage showDebugLoadingState={true} />
			<JDGImage showDebugLoadingState={true} />
			<JDGImage showDebugLoadingState={true} />
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>
