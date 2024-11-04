<script>
	import { afterUpdate } from 'svelte';
	import { css } from '@emotion/css';

	import { accentColors, isMobileBreakpoint, windowWidth } from '$lib/states/ui-state.js';
	import { lightenColor } from '$lib/jdg-utils.js';
	import { jdgSharedIdentifiers } from '$lib/jdg-shared-strings.js';
	import { jdgDurations } from '$lib/jdg-shared-styles.js';

	export let moduleHeightPx = 350; // if slot is GridLayout, this gets overridden
	export let moduleCountDesktop = 1.5; // how many rows to show before fading (desktop)
	export let moduleCountMobile = 4.5; // how many rows to show before fading (mobile)

	let gradientHeightPx = 200; // if slot is GridLayout, this gets overridden
	let isAnimatingClipState = false;

	// initial calculated height is based on moduleHeight * moduleCount
	// but if child is GridLayout, will get adjusted based on children height
	const getInitialMaxHeightPx = () => {
		let finalMaxHeightPx = 0;
		if ($isMobileBreakpoint) {
			finalMaxHeightPx = moduleHeightPx * moduleCountMobile;
		} else {
			finalMaxHeightPx = moduleHeightPx * moduleCountDesktop;
		}
		return finalMaxHeightPx;
	};
	let calculatedTotalHeightPx = getInitialMaxHeightPx();

	const textDivHeight = 50;

	// is the content clipped?
	let isClipped = true;
	// content ref for child calculations
	let clipFadeContentRef;

	const toggleClipping = () => {
		isClipped = !isClipped;

		// force animation by setting the height initially to the calculated height, before setting it to auto
		clipFadeContainerCssDynamic = css`
			height: ${isClipped ? '0' : `${clipFadeContentRef.scrollHeight}px`};
		`;
		isAnimatingClipState = true;
		setTimeout(() => {
			isAnimatingClipState = false;
			if (!isClipped) {
				clipFadeContainerCssDynamic = css`
					height: auto;
				`;
			}
		}, jdgDurations.default);
	};

	const clipFadeContainerCss = css`
		transition: height ${jdgDurations.default}${jdgDurations.unit} ease-in-out;
	`;

	const clipFadeGradientCss = css`
		background: linear-gradient(to top, white ${`${textDivHeight}px`}, transparent 200px);
		:hover {
			background: linear-gradient(
				to top,
				${lightenColor($accentColors[0], 1)} ${`${textDivHeight}px`},
				transparent 200px
			);
		}
	`;

	// set the max height or no height if no clipping requested
	let clipFadeContainerCssDynamic = css``;
	$: {
		$windowWidth;
		if (!isAnimatingClipState) {
			clipFadeContainerCssDynamic = css`
				height: ${isClipped ? `${calculatedTotalHeightPx}px` : 'auto'};
			`;
		}
	}

	// adjust the gradient height based on the last child height
	let clipFadeGradientDynamicCss = css``;
	$: {
		clipFadeGradientDynamicCss = css`
			height: ${gradientHeightPx}px;
		`;
	}

	// check if the slot contains a GridLayout
	// if so, use the first child + gap as the module size
	const updateCalculatedHeight = () => {
		const slotItems = clipFadeContentRef.children;
		if (slotItems.length === 1) {
			Array.from(slotItems).forEach((node) => {
				// is the first node a GridLayout?
				if (node.classList.contains(jdgSharedIdentifiers.gridLayout)) {
					// if so, get the gap size
					const computedStyles = getComputedStyle(node);
					const gapSizePx = parseInt(computedStyles.gap);

					// if mobile, check for each of the children up to the requested amount
					// and add them together to determine the overall height
					if ($isMobileBreakpoint) {
						const moduleCountCeil = Math.ceil(moduleCountMobile);
						let additiveHeightPx = 0;
						// for each child, get the height and gap size and add them together
						for (var i = 0; i < node.children.length - 1 || i < moduleCountCeil - 1; i++) {
							// add an event listener on the image to run this again when it loads
							const img = node.children[i].querySelector('img');
							if (img) {
								img.addEventListener('load', updateCalculatedHeight);
							}

							// if this is the final child, only count half of its height
							if (i === moduleCountCeil - 2) {
								additiveHeightPx += node.children[i].offsetHeight / 2 + gapSizePx;
								gradientHeightPx = node.children[i].offsetHeight / 2 + gapSizePx;
							}
							// otherwise, count the whole height
							else {
								additiveHeightPx += node.children[i].offsetHeight + gapSizePx;
							}
						}
						// redefine the calculated height as the additive height
						if (calculatedTotalHeightPx !== additiveHeightPx) {
							calculatedTotalHeightPx = additiveHeightPx;
						}
					}
					// otherwise, if desktop, use the first child height as the module size
					else {
						const moduleCountCeil = Math.ceil(moduleCountDesktop);
						calculatedTotalHeightPx =
							moduleCountDesktop * (node.children[0].offsetHeight + gapSizePx);
						gradientHeightPx =
							Math.abs(moduleCountCeil - moduleCountDesktop) *
							(node.children[0].offsetHeight + gapSizePx);
					}
				}
			});
		}
	};

	afterUpdate(() => {
		updateCalculatedHeight();
	});
</script>

<div class="jdg-clip-fade-container {clipFadeContainerCss} {clipFadeContainerCssDynamic}">
	{#if isClipped}
		<div class="clip-fade-absolute">
			<div class="clip-fade-see-more">
				SHOW MORE&nbsp;<i class="fa-solid fa-chevron-down"></i>
			</div>
			<div
				class="clip-fade-gradient {clipFadeGradientCss} {clipFadeGradientDynamicCss}"
				role="button"
				tabindex="0"
				on:click={toggleClipping}
				on:keypress={toggleClipping}
			/>
		</div>
	{/if}
	<div bind:this={clipFadeContentRef} class="clip-fade-content">
		<slot />
	</div>
</div>

<style>
	.jdg-clip-fade-container {
		position: relative;
		overflow: hidden;
	}

	.clip-fade-absolute {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 1;
		cursor: pointer;
	}

	.clip-fade-see-more {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 0;
		z-index: 1;
		height: 50px;
		width: 100%;
		text-align: center;
		pointer-events: none;
	}
</style>
