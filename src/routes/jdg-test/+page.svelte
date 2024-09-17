<script>
	import { imageAttributesCollection } from '../image-attributes-collection.js';

	import {
		JDGBodyCopy,
		JDGContentBoxFloating,
		JDGContentContainer,
		JDGFullWidthContainer,
		JDGGridLayout,
		JDGImageFullWidth,
		JDGImageTile
	} from '$lib/index.js';
	import { breakpointHandler } from '$lib/jdg-ui-management.js';

	const imageHeightLg = 350;
	const imageHeightSm = 250;
	let currentImageHeight = 0;
	const imageHeightBreakpointHandler = () => {
		breakpointHandler(
			// breakpoint 0
			() => {
				// force the mobile nav on
				currentImageHeight = imageHeightSm;
			},
			// breakpoint 1
			() => {
				currentImageHeight = imageHeightSm;
			},
			// breakpoint 2
			() => {
				currentImageHeight = imageHeightLg;
			}
		);
	};

	$: {
		imageHeightBreakpointHandler();
	}
</script>

<JDGContentContainer overlapWithHeader={true} paddingTop="0" paddingBottom="0">
	<JDGImageFullWidth
		imageAttributes={imageAttributesCollection.arch.fairgrounds_river}
		overlayColorRgba={'rgba(50, 50, 50, 0.8)'}
		superText={`Hi! 👋 I'm Josh.`}
		primaryText={"I'm a 3D creator"}
		secondaryText={'with experience in:'}
	/>
</JDGContentContainer>
<JDGContentContainer paddingTop="0">
	<JDGContentBoxFloating animateWhenVisible={false} paddingTop="0px">
		<div class="hero-image-overlap" style={`margin-top: -${currentImageHeight / 2}px;`}>
			<JDGGridLayout>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.exp.corporate_showroom_corner}
					label={'ARCHITECTURE'}
					labelContainerVerticalAlign="top"
					labelJustification="center"
					href="#architecture"
					useCompactHeightOnMobile={false}
					maxHeight={`${currentImageHeight}px`}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.ind.planter_003F_1}
					label={'PRODUCTS'}
					labelContainerVerticalAlign="top"
					labelJustification="center"
					href="#industrial-design"
					useCompactHeightOnMobile={false}
					maxHeight={`${currentImageHeight}px`}
				/>
				<JDGImageTile
					imageAttributes={imageAttributesCollection.swe.ccp_1}
					label={'SOFTWARE'}
					labelContainerVerticalAlign="top"
					labelJustification="center"
					href="#software"
					useCompactHeightOnMobile={false}
					maxHeight={`${currentImageHeight}px`}
				/>
			</JDGGridLayout>
		</div>
		<JDGBodyCopy>
			Inspired by the natural and built environments of Colorado, my passion for 3D design of all
			things ignited a career in architecture that evolved into a unique software legacy, spanning
			domains and defying categorization.
			<br /><br />
			By day, I'm a Senior Product Manager building the next generation of 3D architectural modeling
			software at <a href="https://www.autodesk.com" target="blank">Autodesk</a>. By night, I'm a
			software and simulation developer, product designer, and architectural historian.
			<br /><br />
			I'm also the creator of
			<a href="https://www.cinderellacityproject.com/" target="blank">The Cinderella City Project</a
			>, an immersive digital reconstruction of a unique mid-century shopping center of the same
			name in Englewood, Colorado.
			<br /><br />
			See all my experience below, learn more <a href="./about">about me</a>, or
			<a href="./contact">get in touch</a>. Enjoy!
		</JDGBodyCopy>
	</JDGContentBoxFloating>
</JDGContentContainer>
<JDGContentContainer>
	<JDGContentBoxFloating title={'ARCHITECTURE'}>
		<JDGBodyCopy paddingTop="0" textAlign="center">
			Architecture is where it all started for me. 🎉
			<br /><br />
			After seeing the wasteful demolition of a
			<a href="https://www.cinderellacityproject.com/about">giant shopping mall</a>
			as a child, I embarked on a career to understand and evolve retail architectural design.
			<br /><br />
			I received my Master of Architecture degree in 2013 and worked at a world-class design firm before
			eventually moving into <a href="#software">architectural software.</a>
		</JDGBodyCopy>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<h3>EXPERIMENTAL PLACES</h3>
			Testing grounds for architecture and software. These projects were digitally built using<a
				href="https://formit.autodesk.com">Autodesk FormIt</a
			>, for which I was a Senior Product Manager.
		</JDGBodyCopy>
		<JDGFullWidthContainer>
			<JDGGridLayout>
				<JDGImageTile
					label={'MINDFUL SHOWROOM'}
					href="./exp/1551-wewatta"
					imageAttributes={imageAttributesCollection.exp.corporate_showroom_corner}
				/>
				<JDGImageTile
					label={'SCHOOL ADAPTIVE REUSE'}
					href="./exp/fms-campus"
					imageAttributes={imageAttributesCollection.exp.fms_campus_lawn}
				/>
				<JDGImageTile
					label={'ENCODE CAMPUS'}
					href="./exp/encode-campus"
					imageAttributes={imageAttributesCollection.exp.encode_campus_after}
				/>
				<JDGImageTile
					label={'DEPARTMENT STORE ADAPTIVE REUSE'}
					href="./exp/broadway-southwest"
					imageAttributes={imageAttributesCollection.exp.broadway_southwest_concept_2_promenade}
				/>
				<JDGImageTile
					label={'RANCH ELSIE MODERN HOME'}
					href="./about"
					imageAttributes={imageAttributesCollection.exp.ranch_elsie_option_3}
				/>
				<JDGImageTile
					label={'O2 RESEARCH LOBBY STUDY'}
					href="./exp/o2-research"
					imageAttributes={imageAttributesCollection.exp.o2_research}
				/>
				<JDGImageTile
					label={'16 PEARL ADAPTIVE REUSE'}
					href="./exp/sixteen-pearl"
					imageAttributes={imageAttributesCollection.exp.sixteen_pearl_corner}
				/>
				<JDGImageTile
					label={'SPEER POINT ADAPTIVE REUSE'}
					href="./exp/speer-point"
					imageAttributes={imageAttributesCollection.exp.speer_point_after}
				/>
				<JDGImageTile
					label={'FIFTEEN PLATTE MODERN OFFICE'}
					href="./exp/fifteen-platte"
					imageAttributes={imageAttributesCollection.exp.fifteen_platte_sunset}
				/>
			</JDGGridLayout>
		</JDGFullWidthContainer>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<h3>LEGACY PLACES</h3>
			Architectural designs from school and early career.
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile
				label={'BAYOU MIXED USE'}
				href="./arch/bayou-mixed-use"
				imageAttributes={imageAttributesCollection.arch.bayou_mixed_use_2}
			/>
			<JDGImageTile
				label={'MODERN TEXAS LOBBY'}
				href="./arch/texas-lobby"
				imageAttributes={imageAttributesCollection.arch.texas_lobby}
			/>
			<JDGImageTile
				label={'ORCHARD TOWN CENTER'}
				href="./arch/orchard-town-center"
				imageAttributes={imageAttributesCollection.arch.otc_below}
			/>
			<JDGImageTile
				label={'OLD ORCHARD'}
				href="./arch/old-orchard"
				imageAttributes={imageAttributesCollection.arch.old_orchard_outside}
			/>
			<JDGImageTile
				label={'ABANDONED SCHOOL REUSE'}
				href="./arch/random-school"
				imageAttributes={imageAttributesCollection.arch.random_school_terrace}
			/>
			<JDGImageTile
				label={'MINDFUL LIVE/WORK CAMPUS'}
				href="./arch/mindful-campus"
				imageAttributes={imageAttributesCollection.arch.mindful_campus_boulevard_close}
			/>
			<JDGImageTile
				label={'THE FAIRGROUNDS'}
				href="./arch/fairgrounds"
				imageAttributes={imageAttributesCollection.arch.fairgrounds_aerial}
			/>
			<JDGImageTile
				label={'BEACH CHIC ADAPTIVE REUSE'}
				href="./arch/beach-chic"
				imageAttributes={imageAttributesCollection.arch.beach_chic_concourse}
			/>
			<JDGImageTile
				label={'GRITTY BBQ ADAPTIVE REUSE'}
				href="./arch/gritty-bbq"
				imageAttributes={imageAttributesCollection.arch.gritty_bbq_option_3}
			/>
			<JDGImageTile
				label={'MINDFUL MULTIFAMILY'}
				href="./arch/mindful-multifamily"
				imageAttributes={imageAttributesCollection.arch.mindful_multifamily}
			/>
			<JDGImageTile
				label={'ARROWHEAD TOWNE CENTER'}
				href="./arch/arrowhead-towne-center"
				imageAttributes={imageAttributesCollection.arch.atc_elevator}
			/>
		</JDGGridLayout>
		<JDGBodyCopy textAlign="center" paddingBottom="0">
			<h3>HISTORIC PLACES</h3>
			Buildings lost to time, their dramatic rise and fall a product of a disposable society.
			<br />
			These places fascinated me as an aspiring architect, so I've documented their stories here.
		</JDGBodyCopy>
		<JDGGridLayout>
			<JDGImageTile label={'PROJECT 1'} />
			<JDGImageTile label={'PROJECT 2'} />
		</JDGGridLayout>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title={'PRODUCTS'}>
		<JDGGridLayout>
			<JDGImageTile label={'PROJECT 1'} />
			<JDGImageTile label={'PROJECT 2'} />
			<JDGImageTile label={'PROJECT 3'} />
		</JDGGridLayout>
	</JDGContentBoxFloating>
	<JDGContentBoxFloating title={'SOFTWARE'}>
		<JDGGridLayout>
			<JDGImageTile label={'PROJECT 1'} />
			<JDGImageTile label={'PROJECT 2'} />
			<JDGImageTile label={'PROJECT 3'} />
		</JDGGridLayout>
	</JDGContentBoxFloating>
</JDGContentContainer>

<style>
	h3 {
		text-align: center;
	}

	.intro-content-1 {
		display: flex;
		justify-content: center;
		font-size: 1.5rem;
	}
	.intro-content-2 {
		display: flex;
		justify-content: center;
		font-size: 2rem;
	}
</style>
