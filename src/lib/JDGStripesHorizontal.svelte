<script>
    import { css } from "@emotion/css";

    import { jdgColors, jdgSizes } from "./jdg-styling-constants.js";

    export let stripeColors = jdgColors.accentStripesJDG;
    
	const headerStripeCss = css`
		height: ${jdgSizes.headerStripeHeight};
	`;
</script>

<div class="jdg-header-stripes-container">
    {#each stripeColors as stripeColor, i}
        <div style:background-color={stripeColor} class={headerStripeCss} />
    {/each}
</div>

<style>
    .jdg-header-stripes-container {
		display: flex;
		flex-direction: column;
	}
</style>