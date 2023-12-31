<script>
    import { css, keyframes } from "@emotion/css";
    import { jdgColors, jdgSizes } from "./jdg-styling-constants.js";

    export let stripeColors = jdgColors.accentStripesJDG;

    const fillAnimation = keyframes`
        0% { width: 0; }
        100% { width: 100%; }
    `;

    const headerStripeCss = css`
        height: ${jdgSizes.headerStripeHeight};
        animation: ${fillAnimation} 0.5s ease-out forwards;
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
