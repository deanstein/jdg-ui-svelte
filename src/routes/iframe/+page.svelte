<script>
	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGH3H4,
		JDGIFrame
	} from '$lib/index.js';
</script>

<JDGContentContainer>
	<JDGContentBoxFloating>
		<JDGBodyCopy>
			<JDGH3H4 h3String="GOOGLE DOCS" />
			<br />
			This is a really long sentence in order to fill up the div. Is it full? Maybe. Let's check. Nope.
			Adding more text! What about now? We'll never know.
			<JDGIFrame
				title={'Contact Joshua Dean Goldstein'}
				src={'https://docs.google.com/forms/d/e/1FAIpQLSdaDSTRnBD0pYsOtxQE21axuPDNuYbxvpCEoST2pNOV8y-4BQ/viewform?embedded=true'}
			/>
		</JDGBodyCopy>
		<JDGBodyCopy>
			<JDGH3H4 h3String="YOUTUBE" />
			<br />
			This is a really long sentence in order to fill up the div. Is it full? Maybe. Let's check. Nope.
			Adding more text! What about now? We'll never know.
			<JDGIFrame
				title={'Contact Joshua Dean Goldstein'}
				src={'https://www.youtube.com/embed/va9xoslXjQo?si=x4nWo9sTY3pZ3OvB'}
				aspectRatio="1.77"
			/>
			Here's some more text!
		</JDGBodyCopy>
	</JDGContentBoxFloating>
</JDGContentContainer>
