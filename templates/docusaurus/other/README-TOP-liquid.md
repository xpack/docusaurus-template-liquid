{% if isNpmPublished == "true"  -%}
[![GitHub package.json version](https://img.shields.io/github/package-json/v/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/{{branchMain}}/package.json)
{%- if packageConfig.hasNoGithubReleases != "true" %}
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/releases)
{%- endif  %}
[![NPM Version](https://img.shields.io/npm/v/{{packageScopedName}}?color=blue)](https://www.npmjs.com/package/{{packageScopedName}}/)
{%- endif  %}
[![license](https://img.shields.io/github/license/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/{{branchMain}}/LICENSE)
[![Website](https://img.shields.io/website?url=https%3A%2F%2F{{githubProjectOrganization}}.github.io%2F{{githubProjectName}}%2F)]({{packageHomepage}})

{%- if packageConfig.isOrganizationWeb == "true"  %}

# The {{longXpackName}} website source

The Docusaurus source code for the {{longXpackName}} website.

{%- else  %}

# The {{longXpackName}}

{%- if isXpackBinary == "true"  %}
{%- assign platforms_array = platforms | split: ","  %}

{%- assign names_array = "" | split: ""  %}

{%- for platform in platforms_array  %}
{%- if platform == "win32-x64" %}{% assign names_array = names_array | concat: "Windows" %}{% endif  %}
{%- if platform == "darwin-x64" or platform == "darwin-arm64" %}{% assign names_array = names_array | concat: "macOS" %}{% endif  %}
{%- if platform == "linux-x64" or platform == "linux-arm64" or platform == "linux-arm" %}{% assign names_array = names_array | concat: "GNU/Linux" %}{% endif  %}
{%- endfor  %}

{%- assign names_array = names_array | uniq  %}

A standalone{% if names_array.size > 1 %}, cross-platform ({{ names_array | join: ", " }}){% else %} {{ names_array | first }}{% endif %} binary
distribution of {{packageConfig.upstreamDescriptiveName}},
intended for reproducible builds.

{%- else  %}

{% if packageWebsiteConfig.tagline %}{{packageWebsiteConfig.tagline}}{% else %}{{ packageDescription }}{% endif %}.

{%- endif  %}

## Project documentation

For information on how to {% if packageWebsiteConfig.skipInstallCommand != "true" %}install and {% endif %}use this project, please refer to the
[project website]({{packageHomepage}}).

{%- endif  %}

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
