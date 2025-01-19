#!/usr/bin/env bash

# -----------------------------------------------------------------------------
# Safety settings (see https://gist.github.com/ilg-ul/383869cbb01f61a51c4d).

if [[ ! -z ${DEBUG} ]]
then
  set ${DEBUG} # Activate the expand mode if DEBUG is anything but empty.
else
  DEBUG=""
fi

set -o errexit # Exit if command failed.
set -o pipefail # Exit if pipe failed.
set -o nounset # Exit if variable not set.

# Remove the initial space and instead use '\n'.
IFS=$'\n\t'

# -----------------------------------------------------------------------------
# Identify the script location, to reach, for example, the helper scripts.

script_path="$0"
if [[ "${script_path}" != /* ]]
then
  # Make relative path absolute.
  script_path="$(pwd)/$0"
fi

export script_path
export script_name="$(basename "${script_path}")"

export script_folder_path="$(dirname "${script_path}")"
export script_folder_name="$(basename "${script_folder_path}")"

# =============================================================================

# The script is invoked from the website via the following npm script:
# "website-generate-commons": "bash node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-commons.sh",

# set -x

current_folder_path="$(dirname $(dirname $(dirname $(dirname "${script_folder_path}"))))"
if [ "$(basename "${current_folder_path}")" == "website" ]
then
  website_folder_path="${current_folder_path}"
  project_folder_path="$(dirname "${current_folder_path}")"
else
  echo "Not called from the website folder"
  exit 1
fi

templates_folder_path="$(dirname "${script_folder_path}")/templates"

source "${current_folder_path}/node_modules/@xpack/npm-packages-helper/maintenance-scripts/compute-context.sh"

# -----------------------------------------------------------------------------

export do_force="y"
# export xpack_www_releases="$(dirname $(dirname $(dirname "${project_folder_path}")))/xpack.github/www/web-jekyll-xpack.git/_posts/releases"

export xpack_www_releases="${website_folder_path}/_xpack.github.io/_posts/releases"

if [ ! -d "${xpack_www_releases}/${xpack_npm_package_name}" ]
then
  echo "No ${xpack_www_releases}/${xpack_npm_package_name}, nothing to do..."
  exit 0
fi

cd "${xpack_www_releases}/${xpack_npm_package_name}"

echo
echo "Release posts..."

find . -type f -print0 | \
   xargs -0 -I '{}' bash "${script_folder_path}/website-convert-release-post.sh" '{}' "${website_folder_path}/blog"

echo
echo "Validating liquidjs..."

if grep -r -e '{{' "${website_folder_path}/blog"/*.md* | grep -v '/website/blog/_' || \
   grep -r -e '{%' "${website_folder_path}/blog"/*.md* | grep -v '/website/blog/_'
then
  exit 1
fi

echo
echo "Showing descriptions..."

egrep -h -e "(title:|description:)" "${website_folder_path}/blog"/*.md*

echo
echo "'${script_name}' done"

# -----------------------------------------------------------------------------
