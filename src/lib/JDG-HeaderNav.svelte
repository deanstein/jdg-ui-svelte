<script>
    import { css } from '@emotion/css'
    import { breakpoints } from './jdg-styling-constants.js'

    import navItem from '../schemas/nav-item.js'
    import instantiateObject from '../lib/jdg-utils.js'

    export let navItems = [instantiateObject(navItem), instantiateObject(navItem)];
  
    const headerNavContainerCss = css`
      @media (max-width: ${breakpoints.width[0]}) {
        display: block;
      }
      @media (min-width: ${breakpoints.width[0]}) and (max-height: ${breakpoints
          .width[1]}) {
        display: flex;
      }
      @media (min-width: ${breakpoints.width[1]}) {
        display: flex;
      }
      align-items: ${headerOptionsFromParent.nav.styleOverrides.alignItems};
    `
    const headerNavItemCss = css`
      align-items: ${headerOptionsFromParent.nav.styleOverrides.alignItems};
      color: ${headerOptionsFromParent.nav.styleOverrides.itemTextColor};
      background-color: ${headerOptionsFromParent.nav.styleOverrides
        .itemBackgroundColor};
      :hover {
        color: ${headerOptionsFromParent.nav.styleOverrides.itemTextHoverColor};
        background-color: ${headerOptionsFromParent.nav.styleOverrides
          .itemBackgroundColor};
      }
      ${headerOptionsFromParent.nav.styleOverrides.itemBackgroundColor ==
        'none' &&
      `
    :last-of-type {  
      margin-right: 0rem;
      padding-right: 0rem;
    }
    `}
    `
  </script>
  
  <div
    id="header-nav-container"
    class="{headerNavContainerCss} header-nav-container"
  >
    {#each navItems as { name: navItem }, i}
      <div class="{headerNavItemCss} header-nav-item">{navItem}</div>
    {/each}
  </div>
  
  <style>
    .header-nav-container {
      height: 100%;
      display: flex;
      float: right;
    }
  
    .header-nav-item {
      display: flex;
      letter-spacing: 5px;
      margin-left: 1rem;
      margin-right: 1rem;
      padding-left: 1rem;
      padding-right: 1rem;
      height: 50%;
      font-weight: bold;
    }
  </style>
  