# JDG SVELTE UI
Svelte-based UI component library for JDG websites and apps. Features basic building blocks (buttons, images, layouts) as well as advanced composite elements (timelines, image galleries). All components are reactive and published as an npm package.

**Changelog:** [GitHub Releases](https://github.com/deanstein/jdg-ui-svelte/releases)

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

Build the package locally (no link step needed in the package repo):
```bash
yarn build
```
> Repeat this step after every package change you want to test locally

## In the `consuming website` repo
Link to the local `jdg-ui-svelte` package (run from consumer repo, pass path to this repo):
```bash
yarn link /path/to/jdg-ui-svelte
```
Use the actual path to your `jdg-ui-svelte` clone (e.g. `../jdg-ui-svelte` if it’s a sibling folder). Add `--relative` to use a path relative to the consumer repo. Only need to do this once; to remove the link, run `yarn unlink /path/to/jdg-ui-svelte` or `yarn unlink jdg-ui-svelte`.

Cancel any current ```yarn run dev``` command and re-run the dev server using ```--force```:
```bash
yarn run dev --force
```
> Need to cancel the server and re-run using `--force` any time the UI package has changed locally

To revert to using the published package, unlink and reinstall:

```bash
yarn unlink jdg-ui-svelte
yarn install
```

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
yarn npm publish
```
For scoped packages on the public registry, add `--access public` if needed.

# Usage
If the host app doesn't already have jdg-ui-svelte installed:
```bash
yarn add jdg-ui-svelte@latest
```