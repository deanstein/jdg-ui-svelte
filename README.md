# JDG SVELTE UI
Svelte components for the family of JDG UI elements.

# Developing

### Install dependencies

```bash
yarn
```

### Run the dev package
Use this when changes are in progress and realtime updates are required. 

This doesn't build the package, but just runs it for local debugging.
```bash
yarn run dev
```

> NOTE: Styles may flash more during first load. This won't happen in the final package.

# Testing

It's a good idea to test the locally-built package in a locally-built website before publishing, to make sure everything is working.

## In the `jdg-ui-svelte` repo

First, create a link:
```bash
yarn link
```
> Only need to do this once, unless a link is already present from a while ago, in which case run ```yarn unlink``` 

Then, build the `jdg-ui-svelte` package locally:
```bash
yarn build
```
> Repeat this step after every package change you want to test locally

## In the `consuming website` repo
Link to the `jdg-ui-svelte` package:
```bash
yarn link jdg-ui-svelte
```
> Only need to do this once, unless a link is already present from a while ago, in which case run ```yarn unlink jdg-ui-svelte```

Cancel any current ```yarn run dev``` command and re-run the dev server using ```--force```:
```bash
yarn run dev --force
```
> Need to cancel the server and re-run using `--force` any time the UI package has changed locally

To revert to using the official package (not the linked one), be sure to un-link:

```bash
yarn unlink jdg-ui-svelte
```
> After this, need to run ```yarn install --force```

# Previewing

### Build and preview the final package
Use this when changes are not in progress, and the package should be actually built for final testing.

First, build the `jdg-ui-svelte` package locally:

```bash
yarn build
```
Then host the package (and demo site) locally for viewing:
```bash
yarn preview
```
> NOTE: When testing, you may notice that styles flash when the page initially loads. This can be ignored as it shouldn't happen when the final website host is compiled.

> NOTE: If changes are made after building, cancel the preview server, and run `yarn build` and `yarn preview` again to ensure the latest version of the package is built. This also helps ensure any linked websites use the latest local package.

# Publishing
First, update the version in package.json by incrementing whichever field makes sense given the current changes.

Then:
```bash
yarn publish
```

# Usage
If the host app doesn't already have jdg-ui-svelte installed:
```bash
yarn add jdg-ui-svelte@latest