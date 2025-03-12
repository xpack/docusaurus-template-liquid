{% if isNpmPublished == "true"  -%}
[![GitHub package.json version](https://img.shields.io/github/package-json/v/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/{{branchMain}}/package.json)
[![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/{{githubProjectOrganization}}/{{githubProjectName}}?color=blue)](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/tags)
[![NPM Version](https://img.shields.io/npm/v/{{packageScopedName}}?color=blue)](https://www.npmjs.com/package/{{packageScopedName}}/)
{%- endif  %}
[![license](https://img.shields.io/github/license/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/{{branchMain}}/LICENSE)

{%- if packageConfig.isOrganizationWeb == "true"  %}

# The {{longXpackName}} website source

The Docusaurus source code for the {{longXpackName}} website.

{%- else  %}

# The {{packageConfig.descriptiveName}}

{{ packageDescription }}.

{%- endif  %}

## Project documentation

For information on how to {% if packageWebsiteConfig.skipInstallCommand != "true" %}install and {% endif %}use this project, please refer to the
[project website]({{packageHomepage}}).

## Project source

{%- if isNpmPublished == "true"  %}

The source code of the current release is available on
[GitHub tag v{{releaseVersion}} tree](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/tree/v{{releaseVersion}}).

{%- else  %}

The source code is available on
[GitHub](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/).

{%- endif  %}

## License

Unless otherwise stated, the original content is released under the terms of the
[MIT License](https://opensource.org/licenses/mit),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).

{%- if packageScopedName == "@micro-os-plus/micro-test-plus" %}

The code from Boost UT is released under the terms of the
[Boost Version 1.0 Software License](https://www.boost.org/LICENSE_1_0.txt).

{%- endif %}
