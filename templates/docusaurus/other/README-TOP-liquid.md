[![GitHub package.json version](https://img.shields.io/github/package-json/v/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/master/package.json)
[![npm (scoped)](https://img.shields.io/npm/v/{{packageScopedName}}.svg?color=blue)](https://www.npmjs.com/package/{{packageScopedName}}/)
[![license](https://img.shields.io/github/license/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/master/LICENSE)

# The {{packageWebsiteConfig.longName}}

{% if packageWebsiteConfig.tagline %}{{packageWebsiteConfig.tagline}}{% else %}{{ packageDescription }}{% endif %}.

## Project documentation

For information on how to install and use this project,
please refer to the
[project web site]({{packageHomepage}}).

## Project source

The source code of the current release is available
on [GitHub tag v{{releaseVersion}} tree](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/tree/v{{releaseVersion}}).

## License

Unless otherwise stated, the original content is released under the terms of the
[MIT License](https://opensource.org/licenses/mit/),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).
