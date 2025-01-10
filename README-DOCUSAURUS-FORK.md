# docusaurus-algolia-fork

See cronica-it/docusaurus-chronology for a previous solution.

- fork https://github.com/facebook/docusaurus as https://github.com/xpack/docusaurus-algolia-fork
- clone docusaurus-algolia-fork.git
- npm i -g yarn

```
  "my-release": "yarn run my-deep-clean && yarn install && yarn run lint && yarn run my-npm-pack",
  "my-deep-clean": "rm -rf website/node_modules packages/_/node_modules argos/node_modules packages/_/lib packages/_/_.tgz release",
  "my-yarn-install": "yarn install",
  "my-build-packages": "yarn run build:packages",
  "my-npm-pack": "rm -rf release && mkdir -p release && for d in packages/_; do (cd $d; npm pack); done && cp packages/_/_.tgz release",
  "my-watch": "yarn run watch",
  "my-build-website-en": "yarn workspace website build --locale en",
  "my-start-website": "yarn run start:website",
  "my-format": "yarn run format",
  "my-lint-fix": "yarn run lint:js:fix",
  "my-lint-check-all": "yarn run lint",
  "my-npm-link": "for d in packages/_; do (cd $d; npm link); done",
  "my-version": "cat VERSION | sed -e '2,$d'",
  "my-bump-version": "yarn lerna version `yarn --silent my-version` --exact --no-push --yes",
```

- npm run my-yarn-install
- VERSION -> 3.7.0-1
- npm run my-bump-version
- npm run my-npm-link

## Publish

- npm run my-npm-pack

The archives are in `release`.

