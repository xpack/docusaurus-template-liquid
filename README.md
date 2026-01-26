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

npm --prefix ~/Work/xpack/docusaurus-template-liquid.git link
```

### Top dependencies

Install `del-cli`, `json` and `liquidjs`:

```sh
(mkdir -p website; chmod -R +w website; cd website; if [ ! -f package.json ]; then; npm init --yes; fi; npm install del-cli json liquidjs github:xpack/npm-packages-helper github:xpack/docusaurus-template-liquid --save-dev)
```

Link the local helper & template projects:

```sh
(mkdir -p website; npm link @xpack/npm-packages-helper @xpack/docusaurus-template-liquid)
```

Note: for unknown reasons, `npm --prefix website` fails.

### Add npm script

in website/package.json:

```json
    "generate-website-commons-init": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh --micro-os-plus --init",
```

```sh
    "generate-website-commons-init": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh --xpack --init",
```

```json
    "generate-website-commons-init": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-website-commons.sh --xpack-dev-tools --dry-run",
```

Be sure topConfig.descriptiveName is defined.

Run the action.

```sh
npm --prefix website run generate-website-commons-init
```

## Add `websiteConfig`

Add a `websiteConfig` object to `website/package.json`, just before `engines`.

```json
{
  "websiteConfig": {
    "title": "logger - The xPack Logger",
    "tagline": "Tools to manage, configure and build complex, package based, multi-target projects, in a reproducible way.",
    "metadataDescription": "A Node.js CommonJS/ES6 module with a generic console logger class",
    "metadataKeywords": "xpm, xpack, build, test, dependencies, npm, reproducibility",
    "nodeVersion": "20.19.4"
  },
  "engines": {
    "node": ">=20.0"
  }
}
```

or

```json
  "websiteConfig": {
    "title": "The xPack Reproducible Build Framework",
    "tagline": "Tools to manage, configure and build complex, package based, multi-target projects, in a reproducible way",
    "metadataDescription": "The xPack Framework",
    "metadataKeywords": "xpack, project, manage, build, test, dependencies, xpm, npm, reproducibility",
    "nodeVersion": "18.20.4",
    "hasCustomSidebar": "true",
    "hasCustomDeveloper": "true",
    "hasCustomGettingStarted": "true",
    "customGettingStartedTitle": "Getting started with the xPack Project",
    "skipInstallGuide": "true",
    "skipFaq": "true",
    "hasCustomMaintainer": "true",
    "hasCustomAbout": "true",
    "customAboutTitle": "About the xPack Project",
    "hasCustomUser": "true",
    "hasHomepageTools": "true",
    "usePluralGuides": "true",
    "skipInstallCommand": "true",
    "skipReleases": "true",
    "hasCustomHomepageFeatures": "true"
  },
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
- hasTypedocApi
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

#### xpack 

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
  },
}
```

```json
{
  "websiteConfig": {
    "title": "doxygen2docusaurus - Doxygen Documentation Converter",
    "tagline": "A Node.js CLI application to convert Doxygen XML files into Docusaurus documentation",
    "programName": "doxygen2docusaurus",
    "hasCustomSidebar": "true",
    "hasCustomDocsNavbarItem": "true",
    "hasCustomHomepageFeatures": "true",
    "hasTSDocDocusaurusApi": "true",
    "skipTests": "true",
    "skipAlgolia": "true",
    "nodeVersion": "20.18.0"
  },
}
```

```json
{
  "websiteConfig": {
    "title": "logger - The xPack Logger",
    "metadataDescription": "A Node.js CommonJS/ES6 module with a generic console logger class",
    "metadataKeywords": "xpm, xpack, build, test, dependencies, npm, reproducibility",
    "hasTypedocApi": "true",
    "has100coverage": "true",
    "nodeVersion": "18.20.4"
  },
}
```

Library project with TSDoc API:

```json
{
  "websiteConfig": {
    "title": "xpm-lib - The xpm library",
    "tagline": "A Node.js TypeScript library for xpm and xpm enabled projects",
    "metadataDescription": "A Node.js ES6 module with xpm common code",
    "metadataKeywords": "xpm, xpack, liquid, typescript, nodejs, es6, module, library",
    "hasCustomSidebar": "true",
    "hasCustomDocsNavbarItem": "true",
    "hasCustomHomepageFeatures": "true",
    "hasTSDocDocusaurusApi": "true",
    "skipTests": "true",
    "skipAlgolia": "true",
    "nodeVersion": "20.18.1"
  },
}
```

#### xpack-dev-tools

```json
{
  "websiteConfig": {
    "programName": "m4",
    "branding": "m4 (GNU M4) ",
    "tagline": "A binary distribution of GNU M4"
    "isSecondaryTool": "true",
    "$link": "https://ftp.gnu.org/gnu/m4/",
    "m4ReleaseDate": "10 May 2025",
    "shareOnTwitter": "true"
  }
}
```

```json
  "websiteConfig": {
    "platforms": "linux-x64,linux-arm64,linux-arm,darwin-x64,darwin-arm64"
  }
```

#### micro-os-plus

TBD

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
