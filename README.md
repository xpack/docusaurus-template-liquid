# docusaurus-template-liquid

The template used to generate the Docusaurus web sites for the
xPack Node.js projects from files with liquid substitutions.

(Currently work in progress)

To add it to an existing project:

- add two scripts to package.json:

```json
    "npm-link-deps": "npm link @xpack/docusaurus-template-liquid",
    "website-generate-commons-and-build": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons-and-build.sh"
```

- add a `websiteConfig` object to `package.json`:

```json
  "websiteConfig": {
    "name": "Logger",
    "title": "logger - The xPack Logger",
    "metadataDescription": "A Node.js CommonJS/ES6 module with a generic console logger class",
    "metadataKeywords": "xpm, xpack, build, test, dependencies, npm, reproducibility"
  }
```

- run the `npm-link-deps` script
- run the `website-generate-commons-and-build` script
- run the npm install in `website`
