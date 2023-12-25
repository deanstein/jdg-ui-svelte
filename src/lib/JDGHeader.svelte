<script>
    import { fade } from 'svelte/transition'
    import { css } from '@emotion/css'

    import jdgStylingConstants from './jdg-styling-constants.js';
  
    //import HeaderNav from './JDG-HeaderNav.svelte'

    export let showLogo = true;
    export let showLogoTitle = false;
    export let showNav = true;
    export let logoAlignment = 'left';
    export let backgroundColor = 'white';
    export let backgroundOpacity = '1.0';
    export let logoSrc = "/jdg-logo.jpg"
    export let logoAlt = "Logo";
    export let logoTitle = "JDG Design";

    const headerLogoContainerCss = css`
    align-items: ${logoAlignment};
  `

    const headerContainerCss = css`
        @media (max-height: ${jdgStylingConstants.breakpoints.height[0]}) {
          padding-top: 5vh;
          padding-bottom: 5vh;
        }
        @media (min-height: ${jdgStylingConstants.breakpoints
            .height[0]}) and (max-height: ${jdgStylingConstants.breakpoints.height[1]}) {
          padding-top: 3vh;
          padding-bottom: 3vh;
        }
        @media (min-height: ${jdgStylingConstants.breakpoints.height[1]}) {
          padding-top: 2vh;
          padding-bottom: 2vh;
        }
        height: ${jdgStylingConstants.sizes.headerHeight};
        background-color: ${backgroundColor};
        opacity: ${backgroundOpacity};
      `
  </script>
  
  <div>
      <div
        id="header"
        class="{headerContainerCss} header-container"
        transition:fade
      >
        {#if showLogo}
          <div class="{headerLogoContainerCss} header-logo-container">
            <img
              src={logoSrc}
              id="headerLogo"
              class="header-logo"
              alt={logoAlt}
            />
            {#if showLogoTitle}
              <div class="header-logo-subtitle">
                {logoTitle}
              </div>
            {/if}
          </div>
        {/if}
        {#if showNav}
          <!-- <HeaderNav /> -->
        {/if}
      </div>
  </div>
  
  <style>
    .header-container {
      z-index: 1;
      display: flex;
      justify-content: space-between;
      position: fixed;
  
      width: 100%;
      width: -moz-available;
      width: -webkit-fill-available;
      padding: 10px;
  
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .header-logo-container {
      height: 100%;
      display: flex;
    }
  
    .header-logo {
      height: 100%; /* fill the header with the logo top-to-bottom */
    }
  
    .header-logo-subtitle {
      margin-left: 15px;
      display: inline;
      font-weight: bold;
      letter-spacing: 5px;
    }
  </style>
  