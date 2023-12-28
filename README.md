# JDG SVELTE UI
Svelte components for the family of JDG UI elements.

# Developing

### First time install

```bash
yarn install
```

### Run the dev package
Use this when changes are in progress and realtime updates are required. 

This doesn't build the package, but just runs it for local debugging.
```bash
yarn run dev
```

# Building

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
Note that, if changes are made, cancel the preview server, and run `yarn build` and `yarn preview` again to ensure the latest version of the package is built.

This will also help ensure host apps get the latest version locally when linked (more on that below).

# Testing

It's a good idea to test the locally-built package in a locally-built website before publishing, to make sure everything is working.

First, create a link in the `jdg-ui-svelte` repo:

```bash
yarn link
```
Then, switch to the repo where you want to use `jdg-ui-svelte`, and run:

```bash
yarn link jdg-ui-svelte
```

In the host app, if you want to use the official package (not the linked one), be sure to un-link:

```bash
yarn unlink jdg-ui-svelte
```

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