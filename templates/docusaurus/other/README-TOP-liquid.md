{% if releaseVersion != "0.0.0" %}[![GitHub package.json version](https://img.shields.io/github/package-json/v/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/master/package.json)
[![npm (scoped)](https://img.shields.io/npm/v/{{packageScopedName}}.svg?color=blue)](https://www.npmjs.com/package/{{packageScopedName}}/){% endif %}
[![license](https://img.shields.io/github/license/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/master/LICENSE)
{% if packageConfig.isOrganizationWeb == "true" %}
# The {{packageWebsiteConfig.longName}} web site source

The Docusaurus source code for the {{packageWebsiteConfig.longName}} web site.
{% else %}
# The {{packageWebsiteConfig.longName}}

{% if packageWebsiteConfig.tagline %}{{packageWebsiteConfig.tagline}}{% else %}{{ packageDescription }}{% endif %}

## Project documentation

For information on how to {% if packageWebsiteConfig.skipInstallCommand != "true" %}install and {% endif %}use this project,
please refer to the
[project web site]({{packageHomepage}}).
{% endif %}
## Project source
{% if releaseVersion != "0.0.0" %}
The source code of the current release is available on
[GitHub tag v{{releaseVersion}} tree](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/tree/v{{releaseVersion}}).
{% else %}
The source code is available on
[GitHub](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/).
{% endif %}
## License

Unless otherwise stated, the original content is released under the terms of the
[MIT License](https://opensource.org/licenses/mit/),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).
