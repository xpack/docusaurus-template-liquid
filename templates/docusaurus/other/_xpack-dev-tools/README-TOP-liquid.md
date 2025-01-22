[![GitHub package.json version](https://img.shields.io/github/package-json/v/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/xpack/package.json)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/releases)
[![npm (scoped)](https://img.shields.io/npm/v/{{packageScopedName}}.svg?color=blue)](https://www.npmjs.com/package/{{packageScopedName}}/)
[![license](https://img.shields.io/github/license/{{githubProjectOrganization}}/{{githubProjectName}})](https://github.com/{{githubProjectOrganization}}/{{githubProjectName}}/blob/xpack/LICENSE)

# The {{longXpackName}}

{% assign platforms_array = platforms | split: "," -%}

{% assign names_array = "" | split: "" -%}

{% for platform in platforms_array -%}
{% if platform == "win32-x64" %}{% assign names_array = names_array | concat: "Windows" %}{% endif -%}
{% if platform == "darwin-x64" or platform == "darwin-arm64" %}{% assign names_array = names_array | concat: "macOS" %}{% endif -%}
{% if platform == "linux-x64" or platform == "linux-arm64" or platform == "linux-arm" %}{% assign names_array = names_array | concat: "GNU/Linux" %}{% endif -%}
{% endfor -%}

{% assign names_array = names_array | uniq -%}

A standalone{% if names_array.size > 1 %}, cross-platform ({{ names_array | join: ", " }}){% else %} {{ names_array | first }}{% endif %} binary distribution of {{packageConfig.longName}},
intended for reproducible builds.

## Project documentation

For information on how to install and use the tools provided by this project,
please refer to the
[project web site]({{packageHomepage}}).

## License

Unless otherwise stated, the original content is released under the terms of the
[MIT License](https://opensource.org/licenses/mit/),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).
