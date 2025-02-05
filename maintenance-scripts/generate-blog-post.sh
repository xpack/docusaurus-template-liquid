#!/usr/bin/env bash

# -----------------------------------------------------------------------------
#
# This file is part of the xPack project (http://xpack.github.io).
# Copyright (c) 2024 Liviu Ionescu.  All rights reserved.
#
# Permission to use, copy, modify, and/or distribute this software
# for any purpose is hereby granted, under the terms of the MIT license.
#
# If a copy of the license was not distributed with this file, it can
# be obtained from https://opensource.org/licenses/mit/.
#
# -----------------------------------------------------------------------------

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

# set -x

argv="$@"

# Rus as
# .../node_modules/@xpack/docusaurus-template-liquid/maintenance-scripts/generate-blog-post.sh",
helper_folder_path="$(dirname $(dirname "${script_folder_path}"))/npm-packages-helper"

source "${helper_folder_path}/maintenance-scripts/scripts-helper-source.sh"

# Parse options
# and leave variables in the environment.
parse_options "$@"

# -----------------------------------------------------------------------------

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

# -----------------------------------------------------------------------------

# Process package.json files and leave results in environment variables.
compute_context

# -----------------------------------------------------------------------------

echo

post_relative_file_path="blog/$(date -u '+%Y-%m-%d')-${xpack_npm_package_name}-v$(echo ${xpack_xpack_version} | tr '.' '-')-released.mdx"

post_file_path="${website_folder_path}/${post_relative_file_path}"

# if [ -f "${post_file_path}" ]
# then
#   echo "${post_file_path} already there! Remove it to force regenerate."
#   exit 1
# fi

xpack_binaries_folder_path="${HOME}/Downloads/xpack-binaries/${xpack_short_name}"

download_binaries "${xpack_binaries_folder_path}"

echo
ls -lL "${xpack_binaries_folder_path}"

echo
cat "${xpack_binaries_folder_path}"/*.sha

# -----------------------------------------------------------------------------

rm -rf "${post_file_path}"
touch "${post_file_path}"

echo "liquidjs -> ${post_relative_file_path}"
liquidjs --context "${xpack_context}" --template "@${website_folder_path}/blog/_templates/blog-post-release-part-1-liquid.mdx" > "${post_file_path}"

echo >> "${post_file_path}"
echo '```txt'  >> "${post_file_path}"
cat "${xpack_binaries_folder_path}"/*.sha \
  | sed -e 's|$|\n|' \
  | sed -e 's|  |\n|' \
  >> "${post_file_path}"
echo '```'  >> "${post_file_path}"

liquidjs --context "${xpack_context}" --template "@${website_folder_path}/blog/_templates/blog-post-release-part-2-liquid.mdx" >> "${post_file_path}"

echo "Don't forget to manually solve the TODO action point!"

echo
echo "'${script_name}' done"

# Completed successfully.
exit 0

# -----------------------------------------------------------------------------
