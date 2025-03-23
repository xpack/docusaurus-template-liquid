# docusaurus-template-liquid

This project provides the template used to generate the Docusaurus
websites for the xPack Node.js projects. It uses the
[LiquidJs](https://liquidjs.com) engine for substitutions.

## How to use

To add the template to an existing project, start with the instructions in
`npm-package-helper`, up to the point where the folder `website` is
created

### Clone

```sh
rm -rf ~/Work/xpack/docusaurus-template-liquid.git && \
mkdir -p ~/Work/xpack && \
git clone \
https://github.com/xpack/docusaurus-template-liquid.git \
~/Work/xpack/docusaurus-template-liquid.git

(cd ~/Work/xpack/docusaurus-template-liquid.git; npm link)
```

### Top dependencies

Install `del-cli`, `json` and `liquidjs`:

```sh
(mkdir -p website; chmod -R +w website; cd website; if [ ! -f package.json ]; then; npm init; fi; npm install del-cli json liquidjs --save-dev)
```

Link the local helper & template projects:

```sh
(cd website; npm link @xpack/npm-packages-helper @xpack/docusaurus-template-liquid)
```

### Add npm script

```json
    "generate-website-commons-init": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh --micro-os-plus --init",
```

```json
    "generate-website-commons-init": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh --xpack-dev-tools --dry-run",
```

## `websiteConfig`

Add a `websiteConfig` object to `website/package.json`, after `engines`.

```json
{
  "websiteConfig": {
    "title": "logger - The xPack Logger",
    "tagline": "Tools to manage, configure and build complex, package based, multi-target projects, in a reproducible way.",
    "metadataDescription": "A Node.js CommonJS/ES6 module with a generic console logger class",
    "metadataKeywords": "xpm, xpack, build, test, dependencies, npm, reproducibility",
    "nodeVersion": "18.20.4"
  },
  "engines": {
    "node": ">=18.0"
  }
}
```

### Run actions once

In `website`:

```sh
npm install
npm run npm-link-helpers
npm run generate-website-commons
```

### Variables

- permalinkName: the lowercase short name, like xml; used in page titles;
if missing, the long name is used
- programName: application name for CLI projects, like "xpm", "xcdl"
- title: home page title, also used for all docs title
- tagline: home page tagline
- metadataDescription: home page SEO
- metadataKeywords: home page SEO

- nodeVersion: "18.20.4"

- hasCli
- shareOnTwitter
- isInstallGlobally
- hasApi
- has100coverage

For the xpm web

- hasCustomHomepageFeatures
- hasCustomUserSidebar
- hasCustomUserInformation

For the organisation web

- hasCustomSidebar
- hasCustomDocsNavbarItem
- hasCustomDeveloper
- hasCustomGettingStarted
- hasCustomMaintainer
- hasCustomAbout

For XBB

- skipInstallCommand


### Examples

```json
{
  "websiteConfig": {
    "title": "The xPack Reproducible Build Framework",
    "tagline": "Tools to manage, configure and build complex, package based, multi-target projects, in a reproducible way.",
    "metadataDescription": "The xPack Reproducible Build Framework",
    "metadataKeywords": "xpack, project, manage, build, test, dependencies, xpm, npm, reproducibility",
    "nodeVersion": "18.20.4"
  }
}
```

```json
{
  "websiteConfig": {
    "title": "xpm - The xPack Project Manager",
    "tagline": "A tool to automate builds, tests and manage C/C++ dependencies, inspired by npm",
    "metadataDescription": "The xPack Project Manager command line tool",
    "metadataKeywords": "xpm, xpack, project, manager, build, test, dependencies, npm, reproducibility",
    "hasCli": "true",
    "isInstallGlobally": "true",
    "shareOnTwitter": "true",
    "hasCustomUserSidebar": "true",
    "hasCustomUserInformation": "true",
    "nodeVersion": "18.20.4"
  }
}
```

```json
{
  "websiteConfig": {
    "title": "logger - The xPack Logger",
    "metadataDescription": "A Node.js CommonJS/ES6 module with a generic console logger class",
    "metadataKeywords": "xpm, xpack, build, test, dependencies, npm, reproducibility",
    "hasApi": "true",
    "has100coverage": "true",
    "nodeVersion": "18.20.4"
  }
}
```

## Run the scripts

In the `website` folder:

```sh
npm install
npm run npm-link-helpers
npm run generate-website-commons
```

## Front matter

- title: doc page SEO title
- description: doc page SEO description
- keywords: doc page SEO keywords

- H1: docs displayed title
