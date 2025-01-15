[![GitHub package.json version](https://img.shields.io/github/package-json/v/xpack-dev-tools/{{gitHubProjectName}})](https://github.com/xpack-dev-tools/{{gitHubProjectName}}/blob/xpack/package.json)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/xpack-dev-tools/{{gitHubProjectName}})](https://github.com/xpack-dev-tools/{{gitHubProjectName}}/releases/)
[![npm (scoped)](https://img.shields.io/npm/v/@xpack-dev-tools/{{appLcName}}.svg?color=blue)](https://www.npmjs.com/package/@xpack-dev-tools/{{appLcName}}/)
[![license](https://img.shields.io/github/license/xpack-dev-tools/{{gitHubProjectName}})](https://github.com/xpack-dev-tools/{{gitHubProjectName}}/blob/xpack/LICENSE)

# The xPack {{appName}}

{% assign platforms_array = platforms | split: "," -%}

{% assign names_array = "" | split: "" -%}

{% for platform in platforms_array -%}
{% if platform == "win32-x64" %}{% assign names_array = names_array | concat: "Windows" %}{% endif -%}
{% if platform == "darwin-x64" or platform == "darwin-arm64" %}{% assign names_array = names_array | concat: "macOS" %}{% endif -%}
{% if platform == "linux-x64" or platform == "linux-arm64" or platform == "linux-arm" %}{% assign names_array = names_array | concat: "GNU/Linux" %}{% endif -%}
{% endfor -%}

{% assign names_array = names_array | uniq -%}

A standalone{% if names_array.size > 1 %}, cross-platform ({{ names_array | join: ", " }}){% else %} {{ names_array | first }}{% endif %} binary distribution of {{appName}},
intended for reproducible builds.

## Project documentation

For information on how to install and use the tools provided by this project,
please refer to the
[project web site](https://xpack-dev-tools.github.io/{{gitHubProjectName}}/).

## License

Unless otherwise stated, the original content is released under the terms of the
[MIT License](https://opensource.org/licenses/mit/),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).
